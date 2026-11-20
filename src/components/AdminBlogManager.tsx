import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  UploadCloud,
  X,
  Save,
  Eye,
  EyeOff,
  Star,
  ShieldCheck,
} from 'lucide-react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../utils/firebase';
import { BlogArticle, BlogCategory } from '../types';
import {
  BLOG_CATEGORIES,
  INITIAL_BLOG_ARTICLES,
  resolveBlogArticleImage,
} from '../data/blogArticles';
import { useCart } from '../context/CartContext';

function sanitizeArticleForFirestore(article: BlogArticle): Record<string, any> {
  const cleanId = article.id
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 128);

  const payload: Record<string, any> = {
    id: cleanId,
    slug: String(article.slug || cleanId).slice(0, 150),
    title: String(article.title || '').trim().slice(0, 200),
    excerpt: String(article.excerpt || '').trim().slice(0, 450),
    content: String(article.content || '').trim().slice(0, 12000),
    category: article.category,
    categoryLabel: String(article.categoryLabel || 'Conseils Diabète').slice(0, 80),
    readTimeMinutes: Math.min(60, Math.max(1, Number(article.readTimeMinutes) || 4)),
    author: String(article.author || 'Équipe Conseil Parailaf').slice(0, 100),
    authorRole: String(article.authorRole || 'Spécialiste Diabète Maroc').slice(0, 120),
    publishedAt: String(article.publishedAt || new Date().toISOString().slice(0, 10)).slice(0, 40),
    image: String(article.image || '').slice(0, 600),
    imageAlt: String(article.imageAlt || article.title || 'Produit Parailaf Maroc').slice(0, 220),
    tags: (Array.isArray(article.tags) ? article.tags : [])
      .map((t) => String(t).trim())
      .filter(Boolean)
      .slice(0, 8),
    featured: Boolean(article.featured),
    published: Boolean(article.published),
    sortOrder: Number(article.sortOrder) || 99,
    updatedAt: new Date().toISOString().slice(0, 40),
  };

  if (article.titleAr && article.titleAr.trim()) {
    payload.titleAr = article.titleAr.trim().slice(0, 200);
  }
  if (article.excerptAr && article.excerptAr.trim()) {
    payload.excerptAr = article.excerptAr.trim().slice(0, 450);
  }
  if (article.contentAr && article.contentAr.trim()) {
    payload.contentAr = article.contentAr.trim().slice(0, 12000);
  }
  if (article.categoryLabelAr && article.categoryLabelAr.trim()) {
    payload.categoryLabelAr = article.categoryLabelAr.trim().slice(0, 80);
  }
  if (article.imageKey && article.imageKey.trim()) {
    payload.imageKey = article.imageKey.trim().slice(0, 100);
  }
  if (article.relatedProductId && article.relatedProductId.trim()) {
    payload.relatedProductId = article.relatedProductId.trim().slice(0, 128);
  }
  if (Array.isArray(article.keyTakeaways) && article.keyTakeaways.length > 0) {
    payload.keyTakeaways = article.keyTakeaways
      .map((k) => String(k).trim())
      .filter(Boolean)
      .slice(0, 8);
  }
  if (Array.isArray(article.keyTakeawaysAr) && article.keyTakeawaysAr.length > 0) {
    payload.keyTakeawaysAr = article.keyTakeawaysAr
      .map((k) => String(k).trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  return payload;
}

export const AdminBlogManager: React.FC = () => {
  const { allProducts, getProductImage, showToast } = useCart();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [takeawaysInput, setTakeawaysInput] = useState('');

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'blog_articles'),
      (snap) => {
        const list: BlogArticle[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as BlogArticle;
          if (data && data.title) {
            list.push({ ...data, id: data.id || docSnap.id });
          }
        });
        list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
        setArticles(list);
        setIsLoading(false);
      },
      (err) => {
        console.warn('AdminBlogManager snapshot notice:', err?.message || err);
        setIsLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const isFirebaseAdminVerified =
    Boolean(firebaseUser?.email_verified) &&
    firebaseUser?.email?.toLowerCase() === 'soulimani.oualid@gmail.com';

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast('✓ Session Firebase Admin connectée', 'success');
    } catch (err: any) {
      setAuthError(err?.message || 'Erreur lors de la connexion Google Firebase.');
    }
  };

  const handleSeedDefaultArticles = async () => {
    if (!isFirebaseAdminVerified) {
      setAuthError('Connectez-vous d’abord avec le compte Google Administrateur.');
      return;
    }
    setIsSaving(true);
    try {
      const batch = writeBatch(db);
      for (const item of INITIAL_BLOG_ARTICLES) {
        const relatedProd = allProducts.find((p) => p.id === item.relatedProductId);
        const resolvedImg = resolveBlogArticleImage(item, relatedProd, getProductImage);
        // Never store large base64 strings directly inside blog_articles; use product path or imageKey
        const safeImage = resolvedImg.startsWith('data:')
          ? (relatedProd?.image || '')
          : resolvedImg;

        const clean = sanitizeArticleForFirestore({
          ...item,
          image: safeImage,
          imageKey: item.relatedProductId || item.imageKey,
        });
        batch.set(doc(db, 'blog_articles', clean.id), clean, { merge: true });
      }
      await batch.commit();
      showToast('✓ Les 6 articles conseils ont été publiés dans Firestore !', 'success');
    } catch (err: any) {
      try {
        handleFirestoreError(err, OperationType.WRITE, 'blog_articles');
      } catch (wrapped: any) {
        showToast(wrapped?.message || 'Erreur Firestore lors de la publication', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openNewArticleForm = () => {
    const defaultProd =
      allProducts.find((p) => p.id === 'capteur-fsl2-plus-unite') || allProducts[0];
    const newId = `article-${Date.now()}`;
    const draft: BlogArticle = {
      id: newId,
      slug: newId,
      title: '',
      titleAr: '',
      excerpt: '',
      excerptAr: '',
      content: '',
      contentAr: '',
      category: 'capteurs-freestyle',
      categoryLabel: 'Capteurs FreeStyle',
      categoryLabelAr: 'مجسات فري ستايل',
      readTimeMinutes: 4,
      author: 'Équipe Conseil Parailaf',
      authorRole: 'Spécialiste Dispositifs CGM Maroc',
      publishedAt: new Date().toISOString().slice(0, 10),
      image: defaultProd?.image || '',
      imageKey: defaultProd?.id || 'capteur-fsl2-plus-unite',
      imageAlt: defaultProd?.name || 'Produit FreeStyle Libre Parailaf',
      relatedProductId: defaultProd?.id || 'capteur-fsl2-plus-unite',
      tags: ['FreeStyle Libre', 'Diabète Maroc'],
      keyTakeaways: [],
      featured: false,
      published: true,
      sortOrder: articles.length + 1,
    };
    setEditingArticle(draft);
    setTagsInput(draft.tags.join(', '));
    setTakeawaysInput('');
  };

  const openEditArticleForm = (article: BlogArticle) => {
    setEditingArticle({ ...article });
    setTagsInput((article.tags || []).join(', '));
    setTakeawaysInput((article.keyTakeaways || []).join('\n'));
  };

  const handleSelectRelatedProduct = (productId: string) => {
    if (!editingArticle) return;
    const prod = allProducts.find((p) => p.id === productId);
    const prodImg = prod ? (prod.image.startsWith('data:') ? prod.image.slice(0, 580) : prod.image) : editingArticle.image;

    setEditingArticle({
      ...editingArticle,
      relatedProductId: productId,
      imageKey: productId || editingArticle.imageKey,
      image: prod && !prod.image.startsWith('data:') ? prod.image : prodImg,
      imageAlt: prod?.name || editingArticle.imageAlt,
    });
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    if (!isFirebaseAdminVerified) {
      setAuthError('Connexion Google Administrateur requise pour enregistrer dans Firestore.');
      return;
    }
    if (editingArticle.title.trim().length < 3) {
      showToast('Le titre doit contenir au moins 3 caractères.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const catMeta = BLOG_CATEGORIES.find((c) => c.id === editingArticle.category);
      const relatedProd = allProducts.find(
        (p) => p.id === editingArticle.relatedProductId
      );
      const safeImage =
        relatedProd && relatedProd.image && !relatedProd.image.startsWith('data:')
          ? relatedProd.image
          : editingArticle.image.startsWith('data:')
          ? ''
          : editingArticle.image;

      const prepared: BlogArticle = {
        ...editingArticle,
        image: safeImage,
        imageKey: editingArticle.relatedProductId || editingArticle.imageKey,
        imageAlt: relatedProd?.name || editingArticle.imageAlt || editingArticle.title,
        categoryLabel: catMeta?.label || editingArticle.categoryLabel,
        categoryLabelAr: catMeta?.labelAr || editingArticle.categoryLabelAr,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 8),
        keyTakeaways: takeawaysInput
          .split('\n')
          .map((k) => k.trim())
          .filter(Boolean)
          .slice(0, 8),
      };

      const cleanPayload = sanitizeArticleForFirestore(prepared);
      await setDoc(doc(db, 'blog_articles', cleanPayload.id), cleanPayload, {
        merge: true,
      });
      showToast(`✓ Article « ${cleanPayload.title} » enregistré dans Firestore`, 'success');
      setEditingArticle(null);
    } catch (err: any) {
      try {
        handleFirestoreError(err, OperationType.WRITE, `blog_articles/${editingArticle.id}`);
      } catch (wrapped: any) {
        showToast(wrapped?.message || 'Erreur lors de l’enregistrement', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublished = async (article: BlogArticle) => {
    if (!isFirebaseAdminVerified) {
      setAuthError('Connexion Google Administrateur requise.');
      return;
    }
    try {
      const cleanPayload = sanitizeArticleForFirestore({
        ...article,
        published: !article.published,
      });
      await setDoc(doc(db, 'blog_articles', cleanPayload.id), cleanPayload, {
        merge: true,
      });
      showToast(
        cleanPayload.published ? '✓ Article publié sur le site' : '✓ Article passé en brouillon',
        'success'
      );
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, `blog_articles/${article.id}`);
      } catch (wrapped: any) {
        showToast(wrapped?.message || 'Erreur mise à jour', 'error');
      }
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!isFirebaseAdminVerified) {
      setAuthError('Connexion Google Administrateur requise.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'blog_articles', articleId));
      showToast('✓ Article supprimé de Firestore', 'success');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `blog_articles/${articleId}`);
      } catch (wrapped: any) {
        showToast(wrapped?.message || 'Erreur suppression', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Firebase Auth Verification Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isFirebaseAdminVerified
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Gestion des Articles Conseils Firestore (`blog_articles`)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {isFirebaseAdminVerified
                ? `Connecté en tant qu’administrateur vérifié (${firebaseUser?.email}). Chaque article utilise directement les vrais produits et visuels du catalogue.`
                : 'Les règles de sécurité Firestore exigent une authentification Google Administrateur pour publier ou modifier les articles du blog.'}
            </p>
            {authError && (
              <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{authError}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isFirebaseAdminVerified ? (
            <button
              onClick={handleGoogleSignIn}
              className="px-4 py-2.5 bg-[#002f6c] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Connexion Google Admin
            </button>
          ) : (
            <>
              <button
                onClick={handleSeedDefaultArticles}
                disabled={isSaving}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4 text-[#002f6c]" />
                <span>Initialiser les 6 guides</span>
              </button>
              <button
                onClick={openNewArticleForm}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel Article</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor Inline Form */}
      {editingArticle && (() => {
        const previewProd = allProducts.find(
          (p) => p.id === editingArticle.relatedProductId
        );
        const previewImg = resolveBlogArticleImage(
          editingArticle,
          previewProd,
          getProductImage
        );

        return (
          <form
            onSubmit={handleSaveArticle}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-base">
                {articles.some((a) => a.id === editingArticle.id)
                  ? 'Modifier l’article'
                  : 'Créer un nouvel article conseil'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Titre (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Titre (Arabe - optionnel)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={editingArticle.titleAr || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, titleAr: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={editingArticle.category}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      category: e.target.value as BlogCategory,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Produit associé du catalogue (photo & lien) *
                </label>
                <select
                  value={editingArticle.relatedProductId || ''}
                  onChange={(e) => handleSelectRelatedProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price} DH)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src={previewImg}
                  alt={previewProd?.name || editingArticle.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-contain bg-white border border-slate-200 shrink-0 p-1"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-500">
                    Visuel automatique du produit lié
                  </p>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {previewProd?.name || 'Produit du catalogue'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Temps de lecture (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={editingArticle.readTimeMinutes}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        readTimeMinutes: Number(e.target.value) || 4,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ordre d’affichage
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingArticle.sortOrder}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        sortOrder: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Résumé / Accroche (Français) *
              </label>
              <textarea
                required
                rows={2}
                value={editingArticle.excerpt}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contenu complet (utilisez ## pour les sous-titres et - pour les puces) *
              </label>
              <textarea
                required
                rows={7}
                value={editingArticle.content}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, content: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Points clés à retenir (1 par ligne)
                </label>
                <textarea
                  rows={3}
                  value={takeawaysInput}
                  onChange={(e) => setTakeawaysInput(e.target.value)}
                  placeholder="Point clé 1&#10;Point clé 2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mots-clés / Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="FreeStyle Libre, Pose, Maroc"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <div className="flex items-center gap-4 mt-3">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingArticle.published}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          published: e.target.checked,
                        })
                      }
                      className="rounded text-red-600"
                    />
                    <span>Publié sur le site</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingArticle.featured)}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          featured: e.target.checked,
                        })
                      }
                      className="rounded text-red-600"
                    />
                    <span>Article à la une</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Enregistrement...' : 'Enregistrer dans Firestore'}</span>
              </button>
            </div>
          </form>
        );
      })()}

      {/* Articles List */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">
          Chargement des articles Firestore...
        </div>
      ) : articles.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-900">
            Aucun article enregistré dans Firestore (`blog_articles`)
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Le site affiche actuellement les 6 guides liés à vos produits du catalogue. Connectez-vous avec votre compte Google Admin puis cliquez sur « Initialiser les 6 guides » pour les gérer en direct depuis Firestore.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => {
            const relatedProd = allProducts.find(
              (p) => p.id === article.relatedProductId
            );
            const resolvedImg = resolveBlogArticleImage(
              article,
              relatedProd,
              getProductImage
            );

            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-4"
              >
                <img
                  src={resolvedImg}
                  alt={relatedProd?.name || article.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-contain p-1 border border-slate-100 shrink-0 bg-white"
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-red-600">
                      {article.categoryLabel} · {article.readTimeMinutes} min
                    </span>
                    {article.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        À la une
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{article.excerpt}</p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => openEditArticleForm(article)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => handleTogglePublished(article)}
                      className={`px-2.5 py-1.5 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer ${
                        article.published
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {article.published ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Publié</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Brouillon</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer ml-auto"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
