import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderCustomerInfo } from '../types';
import { BRAND_CONFIG } from '../data/config';
import { INITIAL_SEED_ORDERS } from '../data/seedOrders';
import { sendOrderEmailNotification } from '../utils/notificationService';

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
  quickBuyProduct: Product | null;
  setQuickBuyProduct: (product: Product | null) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  
  // Toasts
  toastMessage: string | null;
  showToast: (message: string) => void;
  
  // Orders Management & Dashboard
  lastOrder: Order | null;
  allOrders: Order[];
  createOrder: (customer: OrderCustomerInfo, source?: Order['source']) => Order;
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_SEED_ORDERS;
    } catch {
      return INITIAL_SEED_ORDERS;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // Persist all orders
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders));
    } catch (e) {
      console.error("Failed to save orders to localStorage", e);
    }
  }, [allOrders]);

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

  const isFreeShipping = subtotal >= BRAND_CONFIG.freeShippingThreshold;
  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : BRAND_CONFIG.defaultShippingFee);
  const amountNeededForFreeShipping = Math.max(0, BRAND_CONFIG.freeShippingThreshold - subtotal);
  const totalAmount = subtotal + shippingFee;

  const createOrder = (customer: OrderCustomerInfo, orderSource?: Order['source']): Order => {
    const itemsToOrder = quickBuyProduct 
      ? [{ product: quickBuyProduct, quantity: 1 }] 
      : [...cart];
    
    const orderSubtotal = itemsToOrder.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const orderShipping = orderSubtotal >= BRAND_CONFIG.freeShippingThreshold ? 0 : BRAND_CONFIG.defaultShippingFee;
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
      emailNotified: true
    };

    // 1. Save locally to all orders array
    setAllOrders(prev => [newOrder, ...prev]);
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
    setAllOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes
        };
      }
      return order;
    }));
    showToast(`✓ Statut de la commande #${orderId} mis à jour : ${status}`);
  };

  const deleteOrder = (orderId: string) => {
    setAllOrders(prev => prev.filter(order => order.id !== orderId));
    showToast(`✓ Commande #${orderId} supprimée.`);
  };

  const addManualOrder = (order: Order) => {
    setAllOrders(prev => [order, ...prev]);
    showToast(`✓ Commande manuelle #${order.id} ajoutée.`);
  };

  const generateWhatsAppOrderUrl = (
    customer?: OrderCustomerInfo, 
    singleProduct?: { product: Product, quantity: number }
  ) => {
    const itemsList = singleProduct 
      ? [`- 1x ${singleProduct.product.name} (${singleProduct.product.price} DH)`]
      : (cart.length > 0 ? cart.map(i => `- ${i.quantity}x ${i.product.name} (${i.product.price * i.quantity} DH)`) : ['- Demande d’information générale FreeStyle Libre']);

    const calcTotal = singleProduct 
      ? singleProduct.product.price 
      : totalAmount;

    let text = `*NOUVELLE COMMANDE FREESTYLE LIBRE - ${BRAND_CONFIG.name}*\n\n`;
    text += `*Produits souhaités :*\n${itemsList.join('\n')}\n\n`;
    text += `*Montant estimé :* ${calcTotal} DH ${singleProduct && calcTotal < BRAND_CONFIG.freeShippingThreshold ? '(+ Livraison standard)' : ''}\n\n`;

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
        quickBuyProduct,
        setQuickBuyProduct,
        selectedProductForModal,
        setSelectedProductForModal,
        toastMessage,
        showToast,
        lastOrder,
        allOrders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        addManualOrder,
        generateWhatsAppOrderUrl,
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
