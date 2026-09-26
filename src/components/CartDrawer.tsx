import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  discountPercent: number;
  onApplyPromoCode: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discountPercent,
  onApplyPromoCode,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - discountedSubtotal);
  const shippingFee = discountedSubtotal >= freeShippingThreshold || cart.length === 0 ? 0 : 25;
  const grandTotal = discountedSubtotal + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const success = onApplyPromoCode(promoCodeInput.trim());
    if (success) {
      setPromoMessage({ type: 'success', text: `Royal code applied: ${discountPercent}% privilege granted!` });
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid invitation code. Try "CROWN10" or "SOVEREIGN"' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif-luxury">
                Your Royal Wardrobe
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {cart.length} {cart.length === 1 ? 'curated piece' : 'curated pieces'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-rose-50/50 border-b border-rose-100/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-rose-950 font-medium">
                {remainingForFreeShipping === 0 ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Complimentary White-Glove Courier Unlocked
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-rose-700">${remainingForFreeShipping.toFixed(0)}</strong> more for complimentary courier
                  </span>
                )}
              </span>
              <span className="text-[11px] font-mono text-rose-800">
                ${discountedSubtotal.toFixed(0)} / ${freeShippingThreshold}
              </span>
            </div>
            <div className="w-full h-1.5 bg-rose-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, (discountedSubtotal / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Tag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Explore our Sovereign Autumn collection to begin your bespoke wardrobe.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                  className="flex gap-4 pb-5 border-b border-slate-100 group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{item.selectedColor}</span>
                        <span>·</span>
                        <span>Size {item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-l transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-r transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50/70 space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Privilege code (e.g. CROWN10)"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 uppercase placeholder-normal placeholder-slate-400 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] ${
                      promoMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-slate-900">${subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Privilege Discount ({discountPercent}%)</span>
                    <span className="tabular-nums font-medium">-${discountAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Royal Courier Delivery</span>
                  <span className="tabular-nums font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-semibold">Complimentary</span>
                    ) : (
                      `$${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="tabular-nums text-base">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-rose-400" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Supports Cash on Delivery & Encrypted Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
