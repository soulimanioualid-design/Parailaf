import React, { useState, useRef, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Save, 
  Edit3, 
  X, 
  Sparkles, 
  Trash2, 
  Upload, 
  Plus, 
  Star, 
  Check, 
  Wand2, 
  Loader2, 
  AlertCircle,
  Layers,
  ArrowUpRight,
  ListPlus,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface AdminProductManagerProps {
  initialProductId?: string | null;
}

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({ initialProductId }) => {
  const { allProducts, updateProduct, productCustomImages, updateProductImage, showToast } = useCart();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (initialProductId) {
      const prod = allProducts.find(p => p.id === initialProductId);
      if (prod) {
        setEditingProduct(prod);
      }
    }
  }, [initialProductId, allProducts]);

  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoadingMode, setAiLoadingMode] = useState<string | null>(null);

  // New feature bullet input
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Image upload ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceIndexRef = useRef<number | null>(null);

  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // AI Generator function
  const handleAiAction = async (mode: 'all' | 'improve_title' | 'improve_short' | 'improve_full') => {
    if (!editingProduct) return;
    try {
      setAiLoadingMode(mode);
      showToast('Génération du contenu par l’IA en cours...');

      const res = await fetch('/api/ai-product-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt || editingProduct.name,
          currentName: editingProduct.name,
          currentShort: editingProduct.shortDescription,
          currentFull: editingProduct.fullDescription,
          mode
        })
      });

      const json = await res.json();
      if (json && json.data) {
        const d = json.data;
        setEditingProduct(prev => {
          if (!prev) return null;
          return {
            ...prev,
            name: d.name || prev.name,
            shortDescription: d.shortDescription || prev.shortDescription,
            fullDescription: d.fullDescription || prev.fullDescription,
            features: Array.isArray(d.features) && d.features.length > 0 ? d.features : prev.features,
            price: d.suggestedPrice && mode === 'all' ? d.suggestedPrice : prev.price,
            originalPrice: d.suggestedOriginalPrice && mode === 'all' ? d.suggestedOriginalPrice : prev.originalPrice,
            badge: d.badge && mode === 'all' ? d.badge : prev.badge,
          };
        });
        showToast('✓ Contenu généré avec succès par l’IA !');
      } else {
        showToast('Erreur de génération avec l’IA.');
      }
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la communication avec l’IA.');
    } finally {
      setAiLoadingMode(null);
    }
  };

  // Image management helpers
  const getCurrentMainImage = (prod: Product) => {
    return productCustomImages[prod.id] || prod.image;
  };

  const getDistinctGallery = (prod: Product) => {
    const mainImg = getCurrentMainImage(prod);
    const raw = Array.isArray(prod.gallery) ? prod.gallery : [];
    return raw.filter(img => img && img !== mainImg && img !== prod.image);
  };

  // Delete an image from product
  const handleDeleteImage = (index: number) => {
    if (!editingProduct) return;
    const currentMain = getCurrentMainImage(editingProduct);
    const secondary = getDistinctGallery(editingProduct);

    if (index === 0) {
      // Deleting main photo
      if (secondary.length > 0) {
        const newMain = secondary[0];
        const newSecondary = secondary.slice(1);
        setEditingProduct({
          ...editingProduct,
          image: newMain,
          gallery: [newMain, ...newSecondary]
        });
        updateProductImage(editingProduct.id, newMain);
        showToast('Photo principale supprimée, photo suivante promue.');
      } else {
        showToast('Impossible de supprimer la seule photo restante.');
      }
    } else {
      // Deleting secondary photo (e.g. index 1 is the 2nd photo)
      const secondaryIndex = index - 1;
      const updatedSecondary = secondary.filter((_, idx) => idx !== secondaryIndex);
      setEditingProduct({
        ...editingProduct,
        gallery: [currentMain, ...updatedSecondary]
      });
      showToast('✓ 2ème photo supprimée de la galerie !');
    }
  };

  // Set secondary image as main
  const handlePromoteToMain = (index: number) => {
    if (!editingProduct || index === 0) return;
    const currentMain = getCurrentMainImage(editingProduct);
    const secondary = getDistinctGallery(editingProduct);
    const selected = secondary[index - 1];

    if (!selected) return;
    const remainingSecondary = secondary.filter((_, idx) => idx !== index - 1);
    const newSecondary = [currentMain, ...remainingSecondary];

    setEditingProduct({
      ...editingProduct,
      image: selected,
      gallery: [selected, ...newSecondary]
    });
    updateProductImage(editingProduct.id, selected);
    showToast('✓ Photo définie comme image principale.');
  };

  // Remove all secondary photos to keep ONLY 1 photo
  const handleKeepSinglePhoto = () => {
    if (!editingProduct) return;
    const currentMain = getCurrentMainImage(editingProduct);
    setEditingProduct({
      ...editingProduct,
      image: currentMain,
      gallery: []
    });
    showToast('✓ Galerie vidée : seule la photo principale est conservée.');
  };

  // Upload or replace image
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    try {
      showToast('Optimisation de la photo...');
      const compressed = await compressImageFile(file, 1200, 0.85);

      const currentMain = getCurrentMainImage(editingProduct);
      const secondary = getDistinctGallery(editingProduct);

      if (replaceIndexRef.current === 0) {
        // Replacing main photo
        setEditingProduct({
          ...editingProduct,
          image: compressed,
          gallery: [compressed, ...secondary]
        });
        await updateProductImage(editingProduct.id, compressed);
        showToast('✓ Photo principale remplacée !');
      } else if (replaceIndexRef.current !== null && replaceIndexRef.current > 0) {
        // Replacing secondary photo
        const secIndex = replaceIndexRef.current - 1;
        const newSec = [...secondary];
        newSec[secIndex] = compressed;
        setEditingProduct({
          ...editingProduct,
          gallery: [currentMain, ...newSec]
        });
        showToast('✓ Photo secondaire modifiée !');
      } else {
        // Adding new photo to gallery
        const newSec = [...secondary, compressed];
        setEditingProduct({
          ...editingProduct,
          gallery: [currentMain, ...newSec]
        });
        showToast('✓ Nouvelle photo ajoutée à la galerie !');
      }
    } catch (err) {
      console.error(err);
      showToast('Erreur lors du traitement de la photo.');
    } finally {
      replaceIndexRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add bullet feature
  const handleAddFeature = () => {
    if (!editingProduct || !newFeatureInput.trim()) return;
    setEditingProduct({
      ...editingProduct,
      features: [...(editingProduct.features || []), newFeatureInput.trim()]
    });
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      features: (editingProduct.features || []).filter((_, i) => i !== idx)
    });
  };

  // Save changes to Firestore
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const currentMain = getCurrentMainImage(editingProduct);
      const secondary = getDistinctGallery(editingProduct);
      const finalProduct: Product = {
        ...editingProduct,
        image: currentMain,
        gallery: [currentMain, ...secondary]
      };
      updateProduct(finalProduct);
      // Ensure custom image matches
      updateProductImage(finalProduct.id, currentMain);
      setEditingProduct(null);
    }
  };

  // EDITING VIEW
  if (editingProduct) {
    const currentMain = getCurrentMainImage(editingProduct);
    const secondaryImages = getDistinctGallery(editingProduct);
    const allImageList = [currentMain, ...secondaryImages];

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200 space-y-6">
        
        {/* Hidden File Input for uploading images */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setEditingProduct(null)} 
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer shrink-0"
              title="Retour à la liste des produits"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
                Éditeur de Fiche Produit
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading mt-0.5">
                {editingProduct.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button 
              type="button"
              onClick={() => setEditingProduct(null)} 
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Annuler
            </button>
            <button 
              type="submit"
              form="product-edit-form"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ASSISTANT IA GEMINI (NOUVEAU ET ULTRA PRATIQUE)                  */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white p-5 rounded-3xl shadow-md border border-indigo-500/20 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-slate-950 shadow-sm">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h4 className="font-black text-sm text-white flex items-center gap-1.5 font-heading">
                  Remplissage Facile avec l'IA Gemini
                </h4>
                <p className="text-xs text-slate-300">
                  Générez ou optimisez le titre, l'accroche, la description complète et les points forts en 1 clic.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
            <input
              type="text"
              placeholder="Que voulez-vous vendre ? (ex: FreeStyle Libre 2 Plus, aiguilles, pack promo...)"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            <button
              type="button"
              disabled={aiLoadingMode !== null}
              onClick={() => handleAiAction('all')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer shrink-0"
            >
              {aiLoadingMode === 'all' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rédaction IA en cours...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>✨ Tout Générer avec l'IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* GESTION COMPLÈTE DES PHOTOS (1ère photo, 2ème photo, etc.)        */}
        {/* ================================================================= */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 font-heading">
                <Layers className="w-4 h-4 text-red-600" />
                Photos du produit ({allImageList.length})
              </h4>
              <p className="text-xs text-slate-500">
                Vous avez la main totale : supprimez les photos indésirables (comme la 2ème photo) ou ajoutez de nouvelles images.
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              {allImageList.length > 1 && (
                <button
                  type="button"
                  onClick={handleKeepSinglePhoto}
                  className="text-xs font-bold text-slate-600 hover:text-red-600 bg-white border border-slate-300 hover:border-red-300 px-3 py-1.5 rounded-xl transition cursor-pointer"
                  title="Supprimer toutes les photos secondaires"
                >
                  Ne garder qu'une seule photo
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  replaceIndexRef.current = null;
                  fileInputRef.current?.click();
                }}
                className="text-xs font-black text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une photo</span>
              </button>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-2">
            {allImageList.map((imgSrc, idx) => {
              const isMain = idx === 0;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-2xl border ${isMain ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200'} p-2.5 flex flex-col justify-between shadow-xs transition group relative`}
                >
                  <div className="relative aspect-square w-full rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100 mb-2">
                    <img 
                      src={imgSrc} 
                      alt={`Photo ${idx + 1}`} 
                      className="w-full h-full object-contain mix-blend-multiply p-1"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/400?text=Image')}
                    />

                    {/* Badge */}
                    <div className="absolute top-1.5 left-1.5">
                      {isMain ? (
                        <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                          Principale
                        </span>
                      ) : (
                        <span className="bg-slate-900/75 text-white font-bold text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                          Photo {idx + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar on card */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        replaceIndexRef.current = idx;
                        fileInputRef.current?.click();
                      }}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition text-center cursor-pointer"
                      title="Changer cette photo"
                    >
                      Remplacer
                    </button>

                    {!isMain && (
                      <button
                        type="button"
                        onClick={() => handlePromoteToMain(idx)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition cursor-pointer"
                        title="Mettre en photo principale"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* RED DELETE BUTTON: Specifically requested by the user */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(idx)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer"
                      title="Supprimer cette photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* FORMULAIRE DES DÉTAILS DU PRODUIT                                */}
        {/* ================================================================= */}
        <form id="product-edit-form" onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Titre du produit */}
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Nom / Titre du Produit</label>
                <button
                  type="button"
                  disabled={aiLoadingMode !== null}
                  onClick={() => handleAiAction('improve_title')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Optimiser avec l'IA</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 font-bold"
              />
            </div>
            
            {/* Description Courte */}
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Description Courte (Accroche)</label>
                <button
                  type="button"
                  disabled={aiLoadingMode !== null}
                  onClick={() => handleAiAction('improve_short')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Rédiger l'accroche avec l'IA</span>
                </button>
              </div>
              <textarea
                rows={2}
                required
                value={editingProduct.shortDescription}
                onChange={e => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Description Détaillée */}
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Description Détaillée (Page Produit)</label>
                <button
                  type="button"
                  disabled={aiLoadingMode !== null}
                  onClick={() => handleAiAction('improve_full')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Rédiger la description avec l'IA</span>
                </button>
              </div>
              <textarea
                rows={5}
                required
                value={editingProduct.fullDescription}
                onChange={e => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 leading-relaxed"
              />
            </div>

            {/* Points Forts (Features) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Points Forts & Caractéristiques Clés</label>
              <div className="space-y-2 mb-2">
                {(editingProduct.features || []).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const newF = [...(editingProduct.features || [])];
                        newF[idx] = e.target.value;
                        setEditingProduct({ ...editingProduct, features: newF });
                      }}
                      className="w-full bg-transparent text-xs text-slate-800 focus:outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add feature line */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter un avantage (ex: Autonomie 15 jours, sans piqûre...)"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {/* Prix Actuel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prix de Vente (DH)</label>
              <input
                type="number"
                required
                min="0"
                value={editingProduct.price}
                onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-red-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Ancien Prix Barré */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ancien Prix Barré (DH)</label>
              <input
                type="number"
                min="0"
                value={editingProduct.originalPrice || ''}
                onChange={e => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) || undefined })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-500 line-through font-bold focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Badge Promo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge Promo (Étiquette)</label>
              <input
                type="text"
                placeholder="Ex: Promo, Nouveau, Offre Spéciale..."
                value={editingProduct.badge || ''}
                onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value || undefined })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.inStock}
                  onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded-md focus:ring-red-500"
                />
                <span className="text-xs font-bold text-slate-800">Produit en stock au Maroc</span>
              </label>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder les modifications</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // CATALOG LIST VIEW
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5 font-heading">
            <Package className="w-6 h-6 text-red-600" />
            Catalogue Produits ({allProducts.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cliquez sur "Modifier" pour changer les prix, titres, descriptions avec l'IA, ou supprimer les photos en trop.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(product => {
          const mainImg = getCurrentMainImage(product);
          const gallery = getDistinctGallery(product);
          const photoCount = 1 + gallery.length;

          return (
            <div key={product.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="aspect-video bg-slate-50 relative border-b border-slate-100 flex items-center justify-center p-4">
                  <img 
                    src={mainImg} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply transition group-hover:scale-105 duration-200"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/400?text=Image')}
                  />
                  
                  {/* Photo count indicator */}
                  <span className="absolute bottom-2.5 left-2.5 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-300" />
                    {photoCount} photo{photoCount > 1 ? 's' : ''}
                  </span>

                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                      {product.badge}
                    </span>
                  )}

                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 rounded-xl shadow-md font-black text-xs flex items-center gap-1.5 transition cursor-pointer border border-red-200"
                    >
                      <Edit3 className="w-4 h-4 text-red-600" />
                      <span>Modifier</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-bold text-red-600">{product.categoryLabel}</div>
                  <h3 className="font-black text-slate-900 text-sm line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-3 border-t border-slate-50 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-black text-lg text-slate-900 font-heading">
                      {product.price} DH
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-slate-400 line-through font-bold">
                        {product.originalPrice} DH
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {product.inStock ? '✓ En stock' : 'Épuisé'}
                  </span>
                </div>

                {/* BIG PROMINENT ACTION BUTTON (ESPECIALLY VISIBLE ON MOBILE) */}
                <button
                  onClick={() => setEditingProduct(product)}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modifier (Photos, Textes, IA)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
