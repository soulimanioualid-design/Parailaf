import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderCustomerInfo } from '../types';
import { BRAND_CONFIG } from '../data/config';
import { INITIAL_SEED_ORDERS } from '../data/seedOrders';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import imgPack4Custom from '../assets/images/custom_pack-4-fsl2-plus.jpg';
import imgDexcomG6Pack from '../assets/images/dexcom_g6_clean_1789129052228.jpg';
import imgDexcomG7 from '../assets/images/dexcom_g7_box_sensor_1789135976489.jpg';
import imgTrousseIsotherme from '../assets/images/trousse_isotherme_bleue_1789135961656.jpg';
import { sendOrderEmailNotification } from '../utils/notificationService';
import { doc, onSnapshot, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { sanitizeProductForFirestore, prepareCatalogForFirestore } from '../utils/productUtils';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  savingsTotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  totalAmount: number;
  
  // UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminActiveTab: 'orders' | 'email' | 'analytics' | 'new-order' | 'media' | 'employees' | 'products';
  setAdminActiveTab: (tab: 'orders' | 'email' | 'analytics' | 'new-order' | 'media' | 'employees' | 'products') => void;
  openAdmin: (tab?: 'orders' | 'email' | 'analytics' | 'new-order' | 'media' | 'employees' | 'products') => void;
  quickBuyProduct: Product | null;
  setQuickBuyProduct: (product: Product | null) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  
  // Toasts
  toastMessage: string | null;
  showToast: (message: string) => void;
  
  // Catalog / Products
  allProducts: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  reorderProducts: (reorderedProducts: Product[]) => Promise<void>;
  
  // Product Images Override (Admin controlled)
  productCustomImages: Record<string, string>;
  getProductImage: (product: Product) => string;
  updateProductImage: (productId: string, base64Image: string | null) => Promise<void>;

  // Orders Management & Dashboard
  lastOrder: Order | null;
  allOrders: Order[];
  createOrder: (customer: OrderCustomerInfo, source?: Order['source'], userId?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], adminNotes?: string) => void;
  deleteOrder: (orderId: string) => void;
  addManualOrder: (order: Order) => void;
  generateWhatsAppOrderUrl: (customer?: OrderCustomerInfo, singleProduct?: { product: Product, quantity: number }) => string;
  
  // Navigation & Search helper
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scrollToSection: (sectionId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'parailaf_cart_v1';
const ORDERS_STORAGE_KEY = 'parailaf_all_orders_v2';
const PRODUCTS_STORAGE_KEY = 'parailaf_catalog_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
        }
      }
    } catch (e) {
      console.error("Erreur chargement catalogue local:", e);
    }
    return INITIAL_PRODUCTS;
  });
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Safe helper to sync parailaf_catalog_v1 without exceeding Firestore 1MB limit
  const safeSyncCatalogDocument = async (products: Product[]) => {
    try {
      const safeCatalog = prepareCatalogForFirestore(products);
      await setDoc(doc(db, 'products', 'parailaf_catalog_v1'), { 
        products: safeCatalog,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (err: any) {
      console.warn("Notice: Sync to parailaf_catalog_v1 skipped/failed, individual product docs remain authoritative:", err?.message || err);
    }
  };

  // Sync products catalog with Firestore
  useEffect(() => {
    let unsubCatalog: (() => void) | null = null;
    let unsubCollection: (() => void) | null = null;

    try {
      // 1. Listen to aggregate catalog document
      unsubCatalog = onSnapshot(doc(db, 'products', 'parailaf_catalog_v1'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.products) && data.products.length > 0) {
            setAllProducts((prev) => {
              const map = new Map<string, Product>();
              data.products.forEach((p: Product) => map.set(p.id, sanitizeProductForFirestore(p)));
              prev.forEach(p => {
                if (!map.has(p.id)) map.set(p.id, p);
              });
              const merged = Array.from(map.values()).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
              try {
                localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        } else {
           if (allProducts.length > 0) {
              safeSyncCatalogDocument(allProducts);
           }
        }
        setProductsLoaded(true);
      }, (err) => {
        console.warn("Firebase products onSnapshot warning:", err);
        setProductsLoaded(true);
      });

      // 2. Also listen to individual product documents in 'products' collection
      unsubCollection = onSnapshot(collection(db, 'products'), (snapshot) => {
        const individualProducts: Product[] = [];
        snapshot.forEach((d) => {
          if (d.id !== 'parailaf_catalog_v1') {
            const prodData = d.data() as Product;
            if (prodData && prodData.name && prodData.price !== undefined) {
              individualProducts.push(sanitizeProductForFirestore(prodData));
            }
          }
        });

        if (individualProducts.length > 0) {
          setAllProducts((prev) => {
            const map = new Map<string, Product>();
            prev.forEach(p => map.set(p.id, p));
            individualProducts.forEach(p => map.set(p.id, p));
            const merged = Array.from(map.values()).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
            try {
              localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      }, (err) => {
        console.warn("Collection products snapshot warning:", err);
      });

    } catch (e) {
      console.error("Firebase products sync error:", e);
      setProductsLoaded(true);
    }

    return () => {
      if (unsubCatalog) unsubCatalog();
      if (unsubCollection) unsubCollection();
    };
  }, []);

  // Save allProducts to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(allProducts));
    } catch (e) {
      console.error("Erreur sauvegarde catalogue local:", e);
    }
  }, [allProducts]);

  const updateProduct = async (updatedProduct: Product) => {
    const cleanProduct = sanitizeProductForFirestore(updatedProduct);
    
    // 1. Immediate React state update using functional updater
    let updatedList: Product[] = [];
    setAllProducts((prev) => {
      updatedList = prev.map(p => p.id === cleanProduct.id ? cleanProduct : p);
      return updatedList;
    });

    // 2. Immediate LocalStorage persistence
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error("Erreur sauvegarde localStorage:", e);
    }

    // 3. Immediate Cloud Firestore persistence
    try {
      // Always persist the individual document (has its own full 1MB budget)
      await setDoc(doc(db, 'products', cleanProduct.id), cleanProduct, { merge: true });
    } catch (err) {
      console.error("Erreur Cloud Firestore enregistrement doc individuel:", err);
    }

    // Safely sync the aggregate catalog
    await safeSyncCatalogDocument(updatedList);

    showToast(`✓ Produit "${cleanProduct.name}" enregistré avec succès !`);
  };

  const addProduct = async (newProduct: Product) => {
    // Ensure unique ID
    let finalProduct = { ...newProduct };
    if (!finalProduct.id || allProducts.some(p => p.id === finalProduct.id)) {
      finalProduct.id = `prod_${Date.now()}`;
    }

    const cleanProduct = sanitizeProductForFirestore(finalProduct);

    // 1. Immediate React state update with newly created product at the top
    let updatedList: Product[] = [];
    setAllProducts((prev) => {
      const filtered = prev.filter(p => p.id !== cleanProduct.id);
      updatedList = [cleanProduct, ...filtered];
      return updatedList;
    });

    // 2. Immediate LocalStorage persistence
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error("Erreur sauvegarde localStorage:", e);
    }

    // 3. Immediate Cloud Firestore persistence
    try {
      // Always persist the individual document (has its own full 1MB budget)
      await setDoc(doc(db, 'products', cleanProduct.id), cleanProduct, { merge: true });
    } catch (err) {
      console.error("Erreur Cloud Firestore ajout doc individuel:", err);
    }

    // Safely sync the aggregate catalog
    await safeSyncCatalogDocument(updatedList);

    showToast(`✓ Nouveau produit "${cleanProduct.name}" ajouté au catalogue !`);
  };

  const deleteProduct = async (productId: string) => {
    let toDeleteName = '';
    let updatedList: Product[] = [];
    setAllProducts((prev) => {
      const toDelete = prev.find(p => p.id === productId);
      toDeleteName = toDelete?.name || 'Produit';
      updatedList = prev.filter(p => p.id !== productId);
      return updatedList;
    });

    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error("Erreur sauvegarde localStorage:", e);
    }

    try {
      await deleteDoc(doc(db, 'products', productId)).catch(() => {});
    } catch (err) {
      console.error("Erreur suppression doc Firestore:", err);
    }

    await safeSyncCatalogDocument(updatedList);

    showToast(`✓ Produit "${toDeleteName}" supprimé.`);
  };

  const reorderProducts = async (reorderedProducts: Product[]) => {
    // assign sortOrder based on index
    const updatedList = reorderedProducts.map((p, index) => ({ ...p, sortOrder: index }));
    
    setAllProducts(updatedList);
    
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error("Erreur sauvegarde localStorage:", e);
    }
    
    // Save to Firestore catalog (the aggregate doc)
    await safeSyncCatalogDocument(updatedList);
    
    // Update sortOrder on individual documents in the background in a single batch
    const batch = writeBatch(db);
    updatedList.forEach(p => {
      batch.set(doc(db, 'products', p.id), { sortOrder: p.sortOrder }, { merge: true });
    });
    batch.commit().catch(err => console.error("Erreur lors de la mise à jour de l'ordre:", err));
    
    showToast(`✓ L'ordre des produits a été mis à jour.`);
  };

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (parsed.length === 0) return [];
          return parsed;
        }
      }
      return INITIAL_SEED_ORDERS;
    } catch {
      return INITIAL_SEED_ORDERS;
    }
  });

  // Flag to know if orders are loaded from Firestore yet
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  // Ref to track if we should skip the first local save to prevent overwriting cloud
  const isFirstLoad = React.useRef(true);

  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'orders', 'parailaf_all_orders_v1'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.orders)) {
            setAllOrders(data.orders);
          }
        } else {
           // Document doesn't exist, we can push local state to it
           if (allOrders.length > 0) {
              setDoc(doc(db, 'orders', 'parailaf_all_orders_v1'), { orders: allOrders }).catch(console.error);
           }
        }
        setOrdersLoaded(true);
      });
      return () => unsub();
    } catch (e) {
      console.error("Firebase orders sync error:", e);
      setOrdersLoaded(true);
    }
  }, []);

  // Persist all orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders));
    } catch (e) {
      console.error("Failed to save orders", e);
    }
  }, [allOrders]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'orders' | 'email' | 'analytics' | 'new-order' | 'media' | 'employees' | 'products'>('orders');

  const openAdmin = (tab: 'orders' | 'email' | 'analytics' | 'new-order' | 'media' | 'employees' | 'products' = 'orders') => {
    setAdminActiveTab(tab);
    setIsAdminOpen(true);
  };
  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Product Custom Images (Admin Managed)
  const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
    'pack-4-fsl2-plus': imgPack4Custom,
    'dexcom-g6-kit-complet': imgDexcomG6Pack,
    'dexcom-g7-capteur': imgDexcomG7,
    'trousse-isotherme-diabete': imgTrousseIsotherme,
  };

  const [productCustomImages, setProductCustomImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('parailaf_product_images');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PRODUCT_IMAGES, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PRODUCT_IMAGES;
  });

  // Sync custom product images from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'images', 'parailaf_product_images_custom'), (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Record<string, string>;
          const merged = { ...DEFAULT_PRODUCT_IMAGES, ...(data || {}) };
          setProductCustomImages(merged);
          try {
            localStorage.setItem('parailaf_product_images', JSON.stringify(merged));
          } catch {}
        }
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getProductImage = (product: Product): string => {
    if (productCustomImages && productCustomImages[product.id]) {
      return productCustomImages[product.id];
    }
    return product.image;
  };

  const updateProductImage = async (productId: string, base64Image: string | null) => {
    const updated = { ...productCustomImages };
    if (base64Image) {
      updated[productId] = base64Image;
    } else {
      delete updated[productId];
    }
    setProductCustomImages(updated);
    try {
      localStorage.setItem('parailaf_product_images', JSON.stringify(updated));
      await setDoc(doc(db, 'images', 'parailaf_product_images_custom'), updated);
    } catch (err) {
      console.error("Erreur mise à jour image produit:", err);
    }
  };

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product: Product, quantity: number = 1, selectedOption?: string) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id && item.selectedOption === selectedOption);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedOption }];
      }
    });

    showToast(`✓ "${product.name}" ajouté au panier !`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const savingsTotal = cart.reduce((sum, item) => {
    if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
      return sum + ((item.product.originalPrice - item.product.price) * item.quantity);
    }
    return sum;
  }, 0);

  const isFreeShipping = false; // La livraison est payante quel que soit le montant
  const shippingFee = cart.length === 0 ? 0 : 40; // 40 DH fixe partout au Maroc
  const amountNeededForFreeShipping = 0;
  const totalAmount = subtotal + shippingFee;

  const updateCloudOrders = (newOrders: Order[]) => {
    if (ordersLoaded) {
      setDoc(doc(db, 'orders', 'parailaf_all_orders_v1'), {
        orders: newOrders
      }).catch(err => console.error("Firebase save orders error:", err));
    }
  };

  const createOrder = (customer: OrderCustomerInfo, orderSource?: Order['source'], userId?: string | null): Order => {
    const itemsToOrder = quickBuyProduct 
      ? [{ product: quickBuyProduct, quantity: 1 }] 
      : [...cart];
    
    const orderSubtotal = itemsToOrder.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const orderShipping = itemsToOrder.length === 0 ? 0 : 40; // Frais fixe 40 DH
    const orderDiscount = itemsToOrder.reduce((sum, item) => {
      if (item.product.originalPrice) {
        return sum + ((item.product.originalPrice - item.product.price) * item.quantity);
      }
      return sum;
    }, 0);

    const now = new Date();
    const formattedDate = `Aujourd'hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id: `DC-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: formattedDate,
      customer,
      items: itemsToOrder,
      subtotal: orderSubtotal,
      shippingFee: orderShipping,
      discountTotal: orderDiscount,
      total: orderSubtotal + orderShipping,
      status: 'pending',
      source: orderSource || (quickBuyProduct ? 'Achat Express 1-Clic' : 'Panier'),
      emailNotified: true,
    };

    if (userId) {
      newOrder.userId = userId;
    }

    // 1. Save locally to all orders array and sync to cloud
    setAllOrders(prev => {
      const updated = [newOrder, ...prev];
      updateCloudOrders(updated);
      return updated;
    });
    setLastOrder(newOrder);

    // 2. Dispatch Email Notification to admin
    sendOrderEmailNotification(newOrder);

    if (!quickBuyProduct) {
      clearCart();
    }
    setQuickBuyProduct(null);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], adminNotes?: string) => {
    setAllOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          const updatedOrder = {
            ...order,
            status
          };
          if (adminNotes !== undefined) {
            updatedOrder.adminNotes = adminNotes;
          }
          return updatedOrder;
        }
        return order;
      });
      updateCloudOrders(updated);
      return updated;
    });
    showToast(`✓ Statut de la commande #${orderId} mis à jour : ${status}`);
  };

  const deleteOrder = (orderId: string) => {
    setAllOrders(prev => {
      const updated = prev.filter(order => order.id !== orderId);
      updateCloudOrders(updated);
      return updated;
    });
    showToast(`✓ Commande #${orderId} supprimée.`);
  };

  const addManualOrder = (order: Order) => {
    setAllOrders(prev => {
      const updated = [order, ...prev];
      updateCloudOrders(updated);
      return updated;
    });
    showToast(`✓ Commande manuelle #${order.id} ajoutée.`);
  };

  const generateWhatsAppOrderUrl = (
    customer?: OrderCustomerInfo, 
    singleProduct?: { product: Product, quantity: number }
  ) => {
    const itemsList = singleProduct 
      ? [`- 1x ${singleProduct.product.name} (${singleProduct.product.price} DH)`]
      : (cart.length > 0 ? cart.map(i => `- ${i.quantity}x ${i.product.name} (${i.product.price * i.quantity} DH)`) : ['- Demande d’information générale FreeStyle Libre']);

    const itemsSubtotal = singleProduct 
      ? singleProduct.product.price 
      : subtotal;

    const orderShipping = itemsSubtotal > 0 ? 40 : 0;
    const calcTotal = itemsSubtotal + orderShipping;

    let text = `*NOUVELLE COMMANDE FREESTYLE LIBRE - ${BRAND_CONFIG.name}*\n\n`;
    text += `*Produits souhaités :*\n${itemsList.join('\n')}\n\n`;
    text += `*Sous-total :* ${itemsSubtotal} DH\n`;
    text += `*Frais de livraison :* 40 DH (Partout au Maroc)\n`;
    text += `*Total à payer :* ${calcTotal} DH\n\n`;

    if (customer) {
      text += `*Coordonnées du client :*\n`;
      text += `👤 *Nom :* ${customer.fullName}\n`;
      text += `📞 *Téléphone :* ${customer.phone}\n`;
      text += `📍 *Ville :* ${customer.city}\n`;
      text += `🏠 *Adresse :* ${customer.address}\n`;
      text += `💵 *Paiement :* Paiement à la livraison (Espèces)\n`;
      if (customer.notes) {
        text += `📝 *Remarques :* ${customer.notes}\n`;
      }
    } else {
      text += `Bonjour, je souhaite commander ces articles et confirmer la disponibilité et le délai de livraison à ma ville. Merci !`;
    }

    return `https://wa.me/${BRAND_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        savingsTotal,
        shippingFee,
        isFreeShipping,
        amountNeededForFreeShipping,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        adminActiveTab,
        setAdminActiveTab,
        openAdmin,
        quickBuyProduct,
        setQuickBuyProduct,
        selectedProductForModal,
        setSelectedProductForModal,
        toastMessage,
        showToast,
        allProducts,
        updateProduct,
        addProduct,
        deleteProduct,
        reorderProducts,
        lastOrder,
        allOrders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        addManualOrder,
        generateWhatsAppOrderUrl,
        productCustomImages,
        getProductImage,
        updateProductImage,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        scrollToSection
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
