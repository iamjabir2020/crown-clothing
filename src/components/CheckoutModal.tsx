import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, Lock } from 'lucide-react';
import { CartItem, OrderTelemetry, OrderStatus } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discountPercent: number;
  onOrderCreated: (newOrder: OrderTelemetry) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discountPercent,
  onOrderCreated,
  onClearCart,
}) => {
  const [formData, setFormData] = useState({
    fullName: 'Lady Elizabeth Sterling',
    phone: '+1 (555) 349-8800',
    email: 'elizabeth.sterling@heritage.org',
    address: '104 Kensington Palace Gardens, Apt 4',
    city: 'Metropolis',
    postalCode: '10021',
    deliveryMethod: 'royal-sameday' as 'royal-sameday' | 'white-glove' | 'standard',
    paymentMethod: 'Cash on Delivery' as 'Credit Card' | 'Apple Pay' | 'Cash on Delivery',
    notes: 'Please ring bell 4B upon arrival. White-glove hangar delivery preferred.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderTelemetry | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const shippingFee =
    formData.deliveryMethod === 'royal-sameday'
      ? discountedSubtotal >= 150
        ? 0
        : 25
      : formData.deliveryMethod === 'white-glove'
      ? 15
      : 0;
  const grandTotal = discountedSubtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const randomOrderId = `CRW-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder: OrderTelemetry = {
        orderId: randomOrderId,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        deliveryCity: formData.city,
        postalCode: formData.postalCode,
        status: 'Order Placed',
        estimatedDelivery: 'Today within 2 hours',
        courierName: 'Julian Croft',
        courierId: 'RC-018',
        courierPhone: '+1 (555) 431-7721',
        courierVehicle: 'Mercedes eVito Royal Fleet #09',
        courierCoords: { lat: 40.762, lng: -73.968 },
        destinationCoords: { lat: 40.778, lng: -73.955 },
        routeProgressPercent: 15,
        items: [...cart],
        subtotal: discountedSubtotal,
        shippingFee,
        total: grandTotal,
        paymentMethod: formData.paymentMethod,
        createdAt: 'Just now',
        timeline: [
          {
            status: 'Order Placed',
            time: 'Just now',
            description: `Order registered via ${formData.paymentMethod}. Preparing bespoke garment packaging.`,
            completed: true,
          },
          {
            status: 'Quality Check',
            time: 'In 15 mins',
            description: 'Master tailor garment steam and pick-stitch inspection.',
            completed: false,
          },
          {
            status: 'Dispatched',
            time: 'In 35 mins',
            description: 'Assigned to Royal Electric Courier Fleet.',
            completed: false,
          },
          {
            status: 'Out for Delivery',
            time: 'In 1 hour',
            description: 'Courier en route to delivery address.',
            completed: false,
          },
          {
            status: 'Delivered',
            time: 'Today within 2 hrs',
            description: formData.paymentMethod === 'Cash on Delivery' ? 'Cash collected upon delivery with royal seal receipt.' : 'Direct doorstep white-glove handoff.',
            completed: false,
          },
        ],
      };

      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
      onOrderCreated(newOrder);
      onClearCart();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-rose-600 block">
              Royal Concierge Checkout
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-serif-luxury">
              Confirm Your Sovereign Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-slate-900 font-serif-luxury">
                Order Confirmed & Logged
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong className="text-slate-900">{confirmedOrder.customerName}</strong>. Your order has been placed with Order ID{' '}
                <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  {confirmedOrder.orderId}
                </span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-medium text-slate-900 text-right">{confirmedOrder.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Protocol:</span>
                <span className="font-medium text-slate-900">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Due:</span>
                <span className="font-bold text-slate-950">${confirmedOrder.total.toLocaleString()}</span>
              </div>
              {confirmedOrder.paymentMethod === 'Cash on Delivery' && (
                <div className="pt-2 border-t border-slate-200 text-amber-700 font-medium">
                  * Please prepare exact cash of ${confirmedOrder.total.toLocaleString()} upon courier handoff.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Track Live Order Now
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Postal / Zip Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            {/* Delivery Option */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Delivery Experience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label
                  className={`p-3 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                    formData.deliveryMethod === 'royal-sameday'
                      ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="royal-sameday"
                    checked={formData.deliveryMethod === 'royal-sameday'}
                    onChange={() => setFormData({ ...formData, deliveryMethod: 'royal-sameday' })}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Royal Same-Day</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">2 Hours · Electric Fleet</span>
                  <span className="text-xs font-bold mt-2">
                    {discountedSubtotal >= 150 ? 'Free' : '$25'}
                  </span>
                </label>

                <label
                  className={`p-3 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                    formData.deliveryMethod === 'white-glove'
                      ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="white-glove"
                    checked={formData.deliveryMethod === 'white-glove'}
                    onChange={() => setFormData({ ...formData, deliveryMethod: 'white-glove' })}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>White-Glove Slot</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">Scheduled by appointment</span>
                  <span className="text-xs font-bold mt-2">$15</span>
                </label>

                <label
                  className={`p-3 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                    formData.deliveryMethod === 'standard'
                      ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="standard"
                    checked={formData.deliveryMethod === 'standard'}
                    onChange={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Truck className="w-3.5 h-3.5 text-slate-600" />
                    <span>Ground Courier</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">2-3 Business Days</span>
                  <span className="text-xs font-bold mt-2">Free</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Payment Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                    formData.paymentMethod === 'Cash on Delivery'
                      ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                    className="sr-only"
                  />
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Cash on Delivery (COD)</div>
                    <div className="text-[11px] text-slate-500">Pay cash upon courier arrival</div>
                  </div>
                </label>

                <label
                  className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                    formData.paymentMethod === 'Credit Card'
                      ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card"
                    checked={formData.paymentMethod === 'Credit Card'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Credit Card' })}
                    className="sr-only"
                  />
                  <CreditCard className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Credit Card / Apple Pay</div>
                    <div className="text-[11px] text-slate-500">Encrypted tokenization</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal ({cart.length} items)</span>
                <span className="tabular-nums font-medium">${discountedSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Courier Service</span>
                <span className="tabular-nums font-medium">
                  {shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-slate-200">
                <span>Grand Total Due</span>
                <span className="tabular-nums text-lg">${grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>{isSubmitting ? 'Securing Royal Dispatch...' : `Confirm Order — $${grandTotal.toLocaleString()}`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
