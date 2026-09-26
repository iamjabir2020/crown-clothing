import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, Lock, QrCode, Smartphone, Building } from 'lucide-react';
import { CartItem, OrderTelemetry } from '../types';
import {
  formatINR,
  FREE_SHIPPING_THRESHOLD_INR,
  EXPRESS_SAME_DAY_FEE_INR,
  WHITE_GLOVE_SLOT_FEE_INR,
  getMonthlyEMI
} from '../utils/currency';

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
    fullName: 'Gayatri Devi Singhania',
    phone: '+91 98200 45890',
    email: 'gayatri.singhania@heritage.in',
    address: 'Flat 14A, Sea Face Towers, Worli Sea Face',
    city: 'Mumbai',
    postalCode: '400018',
    deliveryMethod: 'royal-sameday' as 'royal-sameday' | 'white-glove' | 'standard',
    paymentMethod: 'UPI (GPay / PhonePe / Paytm)' as
      | 'UPI (GPay / PhonePe / Paytm)'
      | 'Cash on Delivery'
      | 'Credit / Debit Card'
      | 'NetBanking',
    upiId: 'gayatri@okhdfcbank',
    selectedBank: 'HDFC Bank',
    notes: 'Please announce arrival at gate security. Deliver in breathable garment bags on wooden hangers.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderTelemetry | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;

  const shippingFee =
    formData.deliveryMethod === 'royal-sameday'
      ? discountedSubtotal >= FREE_SHIPPING_THRESHOLD_INR
        ? 0
        : EXPRESS_SAME_DAY_FEE_INR
      : formData.deliveryMethod === 'white-glove'
      ? WHITE_GLOVE_SLOT_FEE_INR
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
        estimatedDelivery: 'Today within 90 minutes',
        courierName: 'Vikram Rathore',
        courierId: 'RC-042',
        courierPhone: '+91 98201 88412',
        courierVehicle: 'Mercedes EQE Royal Fleet #09',
        courierCoords: { lat: 18.998, lng: 72.815 },
        destinationCoords: { lat: 19.014, lng: 72.817 },
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
            description: `Order registered via ${formData.paymentMethod}. Preparing bespoke atelier packaging with royal seal.`,
            completed: true,
          },
          {
            status: 'Quality Check',
            time: 'In 15 mins',
            description: 'Master tailor garment steam and pick-stitch certification.',
            completed: false,
          },
          {
            status: 'Dispatched',
            time: 'In 35 mins',
            description: 'Assigned to Royal Electric Courier Fleet #09.',
            completed: false,
          },
          {
            status: 'Out for Delivery',
            time: 'In 60 mins',
            description: `Courier Vikram Rathore en route to ${formData.city} address.`,
            completed: false,
          },
          {
            status: 'Delivered',
            time: 'Today within 90 mins',
            description:
              formData.paymentMethod === 'Cash on Delivery'
                ? `Pay on Delivery (${formatINR(grandTotal)} cash or doorstep UPI QR scan upon courier handoff).`
                : 'Direct doorstep white-glove handoff.',
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
              Royal Concierge Dispatch
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
                Thank you, <strong className="text-slate-900">{confirmedOrder.customerName}</strong>. Your sovereign order has been placed with Order ID{' '}
                <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  {confirmedOrder.orderId}
                </span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-medium text-slate-900 text-right">{confirmedOrder.deliveryAddress}, {confirmedOrder.deliveryCity} ({confirmedOrder.postalCode})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Protocol:</span>
                <span className="font-medium text-slate-900">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Due:</span>
                <span className="font-bold text-slate-950 font-sans text-sm">{formatINR(confirmedOrder.total)}</span>
              </div>
              {confirmedOrder.paymentMethod === 'Cash on Delivery' && (
                <div className="pt-2 border-t border-slate-200 text-amber-800 font-medium">
                  * Please prepare exact cash of {formatINR(confirmedOrder.total)} or scan courier's official UPI QR upon handoff.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Track Live Order in Mumbai / Delhi Fleet
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Customer Details */}
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
                  Phone (for Courier WhatsApp & Live Updates)
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Address (Residence / Apartment / Bungalow)
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
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit Indian Pincode
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
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
                  <span className="text-[11px] text-slate-500 mt-1">90 Mins · Electric Fleet</span>
                  <span className="text-xs font-bold mt-2 font-sans">
                    {discountedSubtotal >= FREE_SHIPPING_THRESHOLD_INR ? 'Free' : formatINR(EXPRESS_SAME_DAY_FEE_INR)}
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
                  <span className="text-xs font-bold mt-2 font-sans">{formatINR(WHITE_GLOVE_SLOT_FEE_INR)}</span>
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
                    <span>Express Air Courier</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">1-2 Days Pan-India</span>
                  <span className="text-xs font-bold mt-2">Free</span>
                </label>
              </div>
            </div>

            {/* Indian Payment Methods */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Payment Option (INR)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* UPI Option */}
                <label
                  className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                    formData.paymentMethod === 'UPI (GPay / PhonePe / Paytm)'
                      ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI (GPay / PhonePe / Paytm)"
                    checked={formData.paymentMethod === 'UPI (GPay / PhonePe / Paytm)'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'UPI (GPay / PhonePe / Paytm)' })}
                    className="sr-only"
                  />
                  <Smartphone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>UPI (GPay / PhonePe / Paytm)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">Instant</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Scan QR or enter UPI VPA</div>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
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
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold">Pay on Delivery (COD)</div>
                    <div className="text-[11px] text-slate-500">Inspect & pay via Cash or UPI at door</div>
                  </div>
                </label>

                {/* Card Option */}
                <label
                  className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                    formData.paymentMethod === 'Credit / Debit Card'
                      ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit / Debit Card"
                    checked={formData.paymentMethod === 'Credit / Debit Card'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Credit / Debit Card' })}
                    className="sr-only"
                  />
                  <CreditCard className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold">Cards & No-Cost EMI</div>
                    <div className="text-[11px] text-slate-500">RuPay, Visa, Mastercard, Amex</div>
                  </div>
                </label>

                {/* NetBanking Option */}
                <label
                  className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                    formData.paymentMethod === 'NetBanking'
                      ? 'border-rose-600 bg-rose-50/40 text-slate-900 ring-1 ring-rose-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NetBanking"
                    checked={formData.paymentMethod === 'NetBanking'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'NetBanking' })}
                    className="sr-only"
                  />
                  <Building className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold">Indian NetBanking</div>
                    <div className="text-[11px] text-slate-500">HDFC, ICICI, SBI, Axis & all banks</div>
                  </div>
                </label>
              </div>

              {/* UPI Sub-card details */}
              {formData.paymentMethod === 'UPI (GPay / PhonePe / Paytm)' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Your UPI VPA / Handle:</span>
                    <span className="text-[11px] text-slate-500">GPay · PhonePe · Paytm · BHIM</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      placeholder="e.g. mobile@upi or name@okhdfcbank"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-rose-500"
                    />
                    <div className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan QR at door</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary & Submit */}
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal ({cart.length} items)</span>
                <span className="tabular-nums font-medium font-sans">{formatINR(discountedSubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Royal Courier Service</span>
                <span className="tabular-nums font-medium font-sans">
                  {shippingFee === 0 ? 'Complimentary' : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-slate-200">
                <span>Grand Total Due (INR)</span>
                <span className="tabular-nums text-lg font-sans">{formatINR(grandTotal)}</span>
              </div>
              {grandTotal >= 30000 && (
                <div className="text-[11px] text-amber-800 flex justify-between pt-1">
                  <span>Qualifies for No-Cost EMI:</span>
                  <span className="font-semibold">{getMonthlyEMI(grandTotal, 6)}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>{isSubmitting ? 'Securing Royal Dispatch...' : `Confirm Order — ${formatINR(grandTotal)}`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
