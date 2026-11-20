import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Eye,
  Edit3,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, testConnection, handleFirestoreError, OperationType } from '../utils/firebase';
import { BlogArticle, BlogCategory, Product } from '../types';
import {
  BLOG_CATEGORIES,
  INITIAL_BLOG_ARTICLES,
  resolveBlogArticleImage,
} from '../data/blogArticles';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class BlogErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  declare props: ErrorBoundaryProps;
  declare setState: (state: ErrorBoundaryState) => void;
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('BlogSection ErrorBoundary caught:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section id="blog-conseils" className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="p-8 bg-white rounded-2xl border border-slate-200 space-y-3">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">
                Impossible de charger les articles conseils pour le moment
              </h3>
              <p className="text-sm text-slate-600">
                Veuillez vérifier votre connexion ou réessayer dans quelques instants.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Réessayer</span>
              </button>
            </div>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

const BlogProductImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        className={`w-full h-full bg-slate-100 flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <BookOpen className="w-10 h-10 text-[#002f6c]/40 mb-2" />
        <span className="text-xs font-semibold text-slate-500 line-clamp-2 max-w-[220px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

function formatDate(dateStr: string, lang: 'fr' | 'ar'): string {
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

const ArticleFormattedBody: React.FC<{ content: string }> = ({ content }) => {
  const blocks = content
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
      {blocks.map((block, index) => {
        if (block.startsWith('## ')) {
          return (
            <h3
              key={index}
              className="text-lg sm:text-xl font-bold text-slate-900 pt-3 font-heading"
            >
              {block.replace(/^##\s+/, '')}
            </h3>
          );
        }

        const lines = block.split('\n').map((l) => l.trim());
        const isBulletList = lines.every((l) => l.startsWith('- '));

        if (isBulletList) {
          return (
            <ul key={index} className="space-y-2.5 py-1">
              {lines.map((line, lineIdx) => (
                <li key={lineIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                  <span>{renderInlineBold(line.replace(/^-\s+/, ''))}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-slate-700 leading-relaxed">
            {renderInlineBold(block)}
          </p>
        );
      })}
    </div>
  );
};

const BlogSectionContent: React.FC = () => {
  const { language, isRTL, translateProduct } = useLanguage();
  const {
    allProducts,
    getProductImage,
    setSelectedProductForModal,
    addToCart,
    setQuickBuyProduct,
    setIsCheckoutOpen,
    openAdmin,
  } = useCart();
  const { isAdmin, isStaff, isAdminSessionActive, canAccessTab } = useAuth();
  const hasBlogAdminAccess = (isAdmin || isStaff || isAdminSessionActive) && canAccessTab('blog');

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firestoreSource, setFirestoreSource] = useState<'firestore' | 'starter'>('firestore');
  const [activeCategory, setActiveCategory] = useState<'all' | BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  // Connect and stream published blog articles from Firestore
  useEffect(() => {
    let isMounted = true;
    testConnection();

    let unsubscribe: (() => void) | null = null;
    try {
      const blogQuery = query(
        collection(db, 'blog_articles'),
        where('published', '==', true)
      );

      unsubscribe = onSnapshot(
        blogQuery,
        (snapshot) => {
          if (!isMounted) return;

          if (!snapshot.empty) {
            const loaded: BlogArticle[] = [];
            snapshot.forEach((docSnap) => {
              const raw = docSnap.data() as Partial<BlogArticle>;
              if (raw && raw.title && raw.content) {
                loaded.push({
                  id: raw.id || docSnap.id,
                  slug: raw.slug || docSnap.id,
                  title: raw.title,
                  titleAr: raw.titleAr,
                  excerpt: raw.excerpt || '',
                  excerptAr: raw.excerptAr,
                  content: raw.content,
                  contentAr: raw.contentAr,
                  category: (raw.category as BlogCategory) || 'capteurs-freestyle',
                  categoryLabel: raw.categoryLabel || 'Conseils Diabète',
                  categoryLabelAr: raw.categoryLabelAr,
                  readTimeMinutes:
                    typeof raw.readTimeMinutes === 'number' && raw.readTimeMinutes > 0
                      ? raw.readTimeMinutes
                      : 4,
                  author: raw.author || 'Équipe Conseil Parailaf',
                  authorRole: raw.authorRole || 'Spécialiste Diabète Maroc',
                  publishedAt: raw.publishedAt || '2026-11-01',
                  image: raw.image || '',
                  imageKey: raw.imageKey,
                  imageAlt: raw.imageAlt || raw.title,
                  relatedProductId: raw.relatedProductId,
                  tags: Array.isArray(raw.tags) ? raw.tags : [],
                  keyTakeaways: Array.isArray(raw.keyTakeaways) ? raw.keyTakeaways : [],
                  keyTakeawaysAr: Array.isArray(raw.keyTakeawaysAr) ? raw.keyTakeawaysAr : [],
                  featured: Boolean(raw.featured),
                  published: raw.published !== false,
                  sortOrder: typeof raw.sortOrder === 'number' ? raw.sortOrder : 99,
                  updatedAt: raw.updatedAt,
                });
              }
            });

            loaded.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
            setArticles(loaded);
            setFirestoreSource('firestore');
          } else {
            setArticles(INITIAL_BLOG_ARTICLES);
            setFirestoreSource('starter');
          }
          setIsLoading(false);
        },
        (error) => {
          if (!isMounted) return;
          const errMessage = error?.message || '';
          if (errMessage.toLowerCase().includes('permission')) {
            try {
              handleFirestoreError(error, OperationType.LIST, 'blog_articles');
            } catch (structuredErr) {
              console.warn('Firestore blog_articles permission notice, displaying starter guides:', structuredErr);
            }
          } else {
            console.warn('Firestore blog_articles listener notice:', errMessage);
          }
          setArticles(INITIAL_BLOG_ARTICLES);
          setFirestoreSource('starter');
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.warn('Could not initialize blog_articles Firestore listener:', err);
      setArticles(INITIAL_BLOG_ARTICLES);
      setFirestoreSource('starter');
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Close article modal on Escape
  useEffect(() => {
    if (!selectedArticle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCat =
        activeCategory === 'all' || article.category === activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;

      const haystack = [
        article.title,
        article.titleAr || '',
        article.excerpt,
        article.excerptAr || '',
        article.categoryLabel,
        article.categoryLabelAr || '',
        ...(article.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [articles, activeCategory, searchQuery]);

  const showFeaturedLayout =
    activeCategory === 'all' && !searchQuery.trim() && filteredArticles.length > 0;

  const featuredArticle = showFeaturedLayout
    ? filteredArticles.find((a) => a.featured) || filteredArticles[0]
    : null;

  const gridArticles = featuredArticle
    ? filteredArticles.filter((a) => a.id !== featuredArticle.id)
    : filteredArticles;

  const findRelatedProduct = (productId?: string): Product | undefined => {
    if (!productId) return undefined;
    return allProducts.find((p) => p.id === productId);
  };

  const getLocalized = (article: BlogArticle) => {
    const isAr = language === 'ar';
    const relatedProduct = findRelatedProduct(article.relatedProductId);
    const localizedRelated = relatedProduct
      ? translateProduct(relatedProduct)
      : undefined;

    return {
      title: isAr && article.titleAr ? article.titleAr : article.title,
      excerpt: isAr && article.excerptAr ? article.excerptAr : article.excerpt,
      content: isAr && article.contentAr ? article.contentAr : article.content,
      categoryLabel:
        isAr && article.categoryLabelAr
          ? article.categoryLabelAr
          : article.categoryLabel,
      keyTakeaways:
        isAr && article.keyTakeawaysAr && article.keyTakeawaysAr.length > 0
          ? article.keyTakeawaysAr
          : article.keyTakeaways || [],
      relatedProduct,
      localizedRelated,
      // Always resolve image from the real catalog product (and its live Firestore custom image) first
      resolvedImage: resolveBlogArticleImage(article, relatedProduct, getProductImage),
    };
  };

  const handleViewRelatedProduct = (product: Product) => {
    setSelectedArticle(null);
    setSelectedProductForModal(product);
  };

  const handleQuickOrderRelatedProduct = (product: Product) => {
    setSelectedArticle(null);
    setQuickBuyProduct(product);
    setIsCheckoutOpen(true);
  };

  const DirectionalArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      id="blog-conseils"
      className="py-16 bg-slate-50 border-b border-slate-200"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-bold tracking-wider uppercase text-red-600">
              {language === 'ar'
                ? 'مدونة التوعية الصحية · منتجات بارا إيلاف'
                : 'Éducation Thérapeutique · Produits FreeStyle Libre'}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading text-balance">
              {language === 'ar'
                ? 'مقالات ونصائح لإدارة السكري واستخدام المجسات'
                : 'Conseils Diabète & Guides FreeStyle Libre'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'إرشادات عملية موثوقة لتركيب المجسات، فهم المنحنيات، واختيار المستلزمات المناسبة من الكتالوج.'
                : 'Des guides pratiques associés à nos dispositifs médicaux pour réussir la pose de vos capteurs et maîtriser votre suivi glycémique.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'ابحث في المقالات...'
                    : 'Rechercher un conseil...'
                }
                className={`w-full ${
                  isRTL ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'
                } py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition`}
              />
              <Search
                className={`w-4 h-4 text-slate-400 absolute ${
                  isRTL ? 'right-3' : 'left-3'
                } top-3 pointer-events-none`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute ${
                    isRTL ? 'left-2.5' : 'right-2.5'
                  } top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer`}
                  aria-label="Effacer la recherche"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {hasBlogAdminAccess && (
              <button
                onClick={() => openAdmin('blog')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#002f6c] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>
                  {language === 'ar' ? 'إدارة المقالات' : 'Gérer le Blog'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Category Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {language === 'ar' ? cat.labelAr : cat.label}
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-1/2 bg-slate-200 rounded" />
                  <div className="h-5 w-4/5 bg-slate-200 rounded" />
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-2/3 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          /* Empty Search State */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar'
                ? 'لم يتم العثور على مقالات مطابقة لبحثك'
                : 'Aucun article ne correspond à votre recherche'}
            </h3>
            <p className="text-sm text-slate-500">
              {language === 'ar'
                ? 'جرّب كلمات أخرى أو اعرض جميع النصائح المتاحة.'
                : 'Essayez un autre mot-clé ou réinitialisez les filtres de catégorie.'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition cursor-pointer"
            >
              {language === 'ar' ? 'عرض جميع المقالات' : 'Voir tous les articles'}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Article Split Card */}
            {featuredArticle && (() => {
              const loc = getLocalized(featuredArticle);

              return (
                <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-xs hover:shadow-md transition-shadow">
                  <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[260px] bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex items-center justify-center p-6 overflow-hidden">
                    <BlogProductImage
                      src={loc.resolvedImage}
                      alt={loc.localizedRelated?.name || featuredArticle.imageAlt}
                      className="w-full h-full max-h-[340px] object-contain"
                    />
                  </div>

                  <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
                    <div className="space-y-3.5">
                      {/* Unboxed clean metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium tabular-nums">
                        <span className="font-bold text-red-600">
                          {loc.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {featuredArticle.readTimeMinutes}{' '}
                          {language === 'ar' ? 'دقائق للقراءة' : 'min de lecture'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(featuredArticle.publishedAt, language)}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading text-balance">
                        {loc.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {loc.excerpt}
                      </p>

                      {loc.keyTakeaways.length > 0 && (
                        <ul className="space-y-2 pt-2 border-t border-slate-100">
                          {loc.keyTakeaways.slice(0, 3).map((point, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-slate-700"
                            >
                              <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedArticle(featuredArticle)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002f6c] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>
                          {language === 'ar' ? 'اقرأ الدليل الكامل' : 'Lire le guide complet'}
                        </span>
                        <DirectionalArrow className="w-4 h-4" />
                      </button>

                      {loc.localizedRelated && loc.relatedProduct && (
                        <button
                          onClick={() => setSelectedProductForModal(loc.relatedProduct!)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[240px] tabular-nums">
                            {loc.localizedRelated.name} · {loc.relatedProduct.price} DH
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })()}

            {/* Editorial Articles Grid */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((article) => {
                  const loc = getLocalized(article);
                  return (
                    <article
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <div>
                        <div className="aspect-[4/3] w-full bg-white border-b border-slate-100 p-4 flex items-center justify-center overflow-hidden">
                          <BlogProductImage
                            src={loc.resolvedImage}
                            alt={loc.localizedRelated?.name || article.imageAlt}
                            className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-300"
                          />
                        </div>

                        <div className="p-6 space-y-2.5">
                          {/* Clean unboxed inline metadata */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium tabular-nums">
                            <span className="font-bold text-red-600">
                              {loc.categoryLabel}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTimeMinutes} min
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{formatDate(article.publishedAt, language)}</span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-heading group-hover:text-red-600 transition-colors">
                            {loc.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                            {loc.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        {loc.localizedRelated && loc.relatedProduct ? (
                          <span className="text-slate-600 font-semibold truncate max-w-[175px] tabular-nums">
                            {loc.localizedRelated.name} · {loc.relatedProduct.price} DH
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium truncate max-w-[160px]">
                            {article.author}
                          </span>
                        )}
                        <span className="font-bold text-[#002f6c] group-hover:text-red-600 inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                          <span>{language === 'ar' ? 'اقرأ المزيد' : 'Lire la suite'}</span>
                          <DirectionalArrow className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Medical Note + Subtle Admin Sync Notice */}
        <div className="mt-10 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
            <span>
              <strong>
                {language === 'ar' ? 'معلومة طبية توجيهية :' : 'Information santé :'}
              </strong>{' '}
              {language === 'ar'
                ? 'المقالات المنشورة في هذا القسم ذات طابع تثقيفي وتوعوي، ولا تغني عن استشارة طبيبك المعالج لتعديل جرعات الإنسولين أو العلاج.'
                : 'Les conseils publiés dans cet espace sont informatifs et ne remplacent jamais l’avis personnalisé de votre médecin diabétologue.'}
            </span>
          </div>
          {hasBlogAdminAccess && firestoreSource === 'starter' && (
            <button
              onClick={() => openAdmin('blog')}
              className="whitespace-nowrap font-bold text-[#002f6c] hover:text-red-600 hover:underline cursor-pointer shrink-0"
            >
              {language === 'ar'
                ? 'مزامنة المقالات مع Firestore ←'
                : 'Synchroniser ces guides vers Firestore →'}
            </button>
          )}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (() => {
        const loc = getLocalized(selectedArticle);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setSelectedArticle(null)}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-5 sm:px-7 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
                  <span className="font-bold text-red-600">{loc.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {selectedArticle.readTimeMinutes}{' '}
                    {language === 'ar' ? 'دقائق' : 'min'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer shrink-0"
                  aria-label="Fermer l'article"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Real Product Photo Header */}
              <div className="aspect-[16/9] max-h-[320px] w-full bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-center overflow-hidden">
                <BlogProductImage
                  src={loc.resolvedImage}
                  alt={loc.localizedRelated?.name || selectedArticle.imageAlt}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Article Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading text-balance">
                    {loc.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">
                      {selectedArticle.author}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedArticle.authorRole}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {formatDate(selectedArticle.publishedAt, language)}
                    </span>
                  </div>
                </div>

                {/* Key Takeaways Box */}
                {loc.keyTakeaways.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#002f6c]">
                      {language === 'ar'
                        ? 'أهم النقاط المستفادة'
                        : 'Points clés à retenir'}
                    </h4>
                    <ul className="space-y-2">
                      {loc.keyTakeaways.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Formatted Article Content */}
                <ArticleFormattedBody content={loc.content} />

                {/* Recommended Real Product Conversion Card */}
                {loc.relatedProduct && loc.localizedRelated && (
                  <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                        <BlogProductImage
                          src={loc.resolvedImage}
                          alt={loc.localizedRelated.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                          {language === 'ar'
                            ? 'المنتج الموصى به في هذا الدليل'
                            : 'Produit recommandé'}
                        </p>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {loc.localizedRelated.name}
                        </h4>
                        <p className="text-sm font-black text-[#002f6c] tabular-nums">
                          {loc.relatedProduct.price} DH
                          {loc.relatedProduct.originalPrice &&
                            loc.relatedProduct.originalPrice > loc.relatedProduct.price && (
                              <span className="ml-2 text-xs font-medium text-slate-400 line-through">
                                {loc.relatedProduct.originalPrice} DH
                              </span>
                            )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => handleViewRelatedProduct(loc.relatedProduct!)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'التفاصيل' : 'Voir la fiche'}</span>
                      </button>
                      <button
                        onClick={() => {
                          addToCart(loc.relatedProduct!, 1);
                          handleQuickOrderRelatedProduct(loc.relatedProduct!);
                        }}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'اطلب الآن' : 'Commander'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};

export const BlogSection: React.FC = () => {
  return (
    <BlogErrorBoundary>
      <BlogSectionContent />
    </BlogErrorBoundary>
  );
};
