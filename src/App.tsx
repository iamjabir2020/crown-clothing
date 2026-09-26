import React, { useState, useEffect } from 'react';
import { PRODUCTS, INITIAL_ORDERS, INITIAL_LEADS } from './data/mockData';
import { Product, CartItem, OrderTelemetry, BespokeLead, OrderStatus } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { TrackingPage } from './pages/TrackingPage';
import { RadiusCheckerPage } from './pages/RadiusCheckerPage';
import { BespokeLeadsPage } from './pages/BespokeLeadsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Search, X, ArrowRight } from 'lucide-react';
import { resolveImageUrl, handleImageError } from './utils/imageResolver';
import {
  ensureAuth,
  subscribeProducts,
  subscribeOrders,
  subscribeLeads,
  saveOrderToDb,
  updateOrderStatusInDb,
  updateProductStockInDb,
  updateProductPriceInDb,
  saveLeadToDb,
  updateLeadStatusInDb,
} from './services/firestoreSync';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<OrderTelemetry[]>(INITIAL_ORDERS);
  const [leads, setLeads] = useState<BespokeLead[]>(INITIAL_LEADS);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      selectedColor: 'Royal Navy',
      selectedSize: '40R',
      quantity: 1,
    },
  ]);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalQuery, setSearchModalQuery] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [trackingTargetOrderId, setTrackingTargetOrderId] = useState<string>('CRW-88219');

  // Real-time Firestore sync
  useEffect(() => {
    ensureAuth();
    const unsubProducts = subscribeProducts((data) => setProducts(data));
    const unsubOrders = subscribeOrders((data) => setOrders(data));
    const unsubLeads = subscribeLeads((data) => setLeads(data));

    return () => {
      unsubProducts();
      unsubOrders();
      unsubLeads();
    };
  }, []);

  // Navigation Helper
  const navigateTo = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const handleAddToCart = (product: Product, color: string, size: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedColor: color, selectedSize: size, quantity }];
      }
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CROWN10') {
      setDiscountPercent(10);
      return true;
    }
    if (clean === 'SOVEREIGN') {
      setDiscountPercent(15);
      return true;
    }
    if (clean === 'ROYAL20') {
      setDiscountPercent(20);
      return true;
    }
    return false;
  };

  // Order Placement
  const handleOrderCreated = (newOrder: OrderTelemetry) => {
    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToDb(newOrder);
    setTrackingTargetOrderId(newOrder.orderId);
    setCheckoutModalOpen(false);
    setActivePage('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct PDP Buy Now
  const handleDirectCheckout = (product: Product, color: string, size: string, quantity: number) => {
    handleAddToCart(product, color, size, quantity);
    setCartDrawerOpen(false);
    setCheckoutModalOpen(true);
  };

  // Admin Operations
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = o.timeline.map((step) => {
            if (step.status === newStatus) {
              return { ...step, completed: true, time: 'Just now' };
            }
            return step;
          });
          return { ...o, status: newStatus, timeline: updatedTimeline };
        }
        return o;
      })
    );
    updateOrderStatusInDb(orderId, newStatus);
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p
      )
    );
    updateProductStockInDb(productId, newStock);
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
    updateProductPriceInDb(productId, newPrice);
  };

  const handleAddLead = (lead: BespokeLead) => {
    setLeads((prev) => [lead, ...prev]);
    saveLeadToDb(lead);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: BespokeLead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    updateLeadStatusInDb(leadId, newStatus);
  };

  const handleNavigateToTrackingFromAdmin = (orderId: string) => {
    setTrackingTargetOrderId(orderId);
    setActivePage('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulateNewOrder = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newSimOrder: OrderTelemetry = {
      orderId: `CRW-${randomNum}`,
      customerName: 'Duchess Beatrice of Cambridge',
      customerPhone: '+1 (555) 723-9901',
      deliveryAddress: '24 Carlton House Terrace, Penthouse Suite',
      deliveryCity: 'Metropolis',
      postalCode: '10021',
      status: 'Order Placed',
      estimatedDelivery: '90 mins (by 4:15 PM)',
      courierName: 'Julian Croft',
      courierId: 'RC-018',
      courierPhone: '+1 (555) 431-7721',
      courierVehicle: 'Porsche Taycan Royal Escort #03',
      courierCoords: { lat: 40.760, lng: -73.970 },
      destinationCoords: { lat: 40.772, lng: -73.960 },
      routeProgressPercent: 10,
      items: [
        {
          product: products[1] || products[0],
          selectedColor: 'Royal Sapphire',
          selectedSize: 'S',
          quantity: 1,
        },
        {
          product: products[2] || products[0],
          selectedColor: 'Ivory Cream',
          selectedSize: 'M',
          quantity: 2,
        },
      ],
      subtotal: 1180,
      shippingFee: 0,
      total: 1180,
      paymentMethod: 'Credit Card',
      createdAt: 'Just now',
      timeline: [
        {
          status: 'Order Placed',
          time: 'Just now',
          description: 'VIP Royal order registered via Sovereign Concierge line.',
          completed: true,
        },
        {
          status: 'Quality Check',
          time: 'In 10 mins',
          description: 'Garment steam and silk-tissue wrapping in cedar wardrobe box.',
          completed: false,
        },
        {
          status: 'Dispatched',
          time: 'In 25 mins',
          description: 'Fleet priority dispatch.',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          time: 'In 45 mins',
          description: 'Direct courier handoff approaching address.',
          completed: false,
        },
        {
          status: 'Delivered',
          time: 'Estimated 4:15 PM',
          description: 'White-glove doorstep delivery.',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newSimOrder, ...prev]);
    saveOrderToDb(newSimOrder);
  };

  // Global search matching
  const searchResults = searchModalQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchModalQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        cart={cart}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Multi-Page Content Outlet */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            products={products}
            onNavigate={navigateTo}
            onQuickView={(p) => setSelectedProductModal(p)}
            onAddToCart={handleAddToCart}
          />
        )}

        {activePage === 'shop' && (
          <ShopPage
            products={products}
            onQuickView={(p) => setSelectedProductModal(p)}
            onAddToCart={handleAddToCart}
          />
        )}

        {activePage === 'tracking' && (
          <TrackingPage
            orders={orders}
            selectedOrderId={trackingTargetOrderId}
            onSelectOrder={(id) => setTrackingTargetOrderId(id)}
          />
        )}

        {activePage === 'radius' && <RadiusCheckerPage />}

        {activePage === 'bespoke' && (
          <BespokeLeadsPage onAddLead={handleAddLead} onNavigate={navigateTo} />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            products={products}
            onUpdateProductStock={handleUpdateProductStock}
            onUpdateProductPrice={handleUpdateProductPrice}
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onNavigateToTracking={handleNavigateToTrackingFromAdmin}
            onSimulateNewOrder={handleSimulateNewOrder}
          />
        )}
      </main>

      {/* Global Brand Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setCheckoutModalOpen(true);
        }}
        discountPercent={discountPercent}
        onApplyPromoCode={handleApplyPromoCode}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cart={cart}
        discountPercent={discountPercent}
        onOrderCreated={handleOrderCreated}
        onClearCart={() => setCart([])}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={(product, color, size, qty) => {
          handleAddToCart(product, color, size, qty);
          setSelectedProductModal(null);
        }}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* Global Search Overlay Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchModalQuery}
                onChange={(e) => setSearchModalQuery(e.target.value)}
                placeholder="Search cashmere coats, silk dresses, tailoring, accessories..."
                className="w-full text-sm bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  setSearchModalOpen(false);
                  setSearchModalQuery('');
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {searchModalQuery.trim() === '' ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Type to search across Crown Clothing sovereign capsules.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No matching garments found for "{searchModalQuery}".
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2">
                    Found {searchResults.length} Garments
                  </div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProductModal(product);
                        setSearchModalOpen(false);
                        setSearchModalQuery('');
                      }}
                      className="p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(product.image, product.id)}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => handleImageError(e, resolveImageUrl(undefined, product.id))}
                          className="w-10 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{product.name}</h4>
                          <span className="text-[11px] text-slate-500">
                            {product.gender} · {product.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-slate-950">
                          ${product.price.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-rose-600 font-medium flex items-center gap-0.5 justify-end">
                          <span>Examine</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
