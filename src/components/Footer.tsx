import React, { useState } from 'react';
import { CrownLogo } from './CrownLogo';
import { ShieldCheck, Truck, RotateCcw, Award, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      {/* Guarantees Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-900 text-rose-500 rounded-xl shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-1">Royal Courier Fleet</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Same-day white-glove direct delivery inside our metropolitan radius.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-900 text-amber-400 rounded-xl shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-1">Savile Row Heritage</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Super 150s worsted wool and Inner Mongolian cashmere verified yarns.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-900 text-sky-400 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-1">Secured Payments</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Encrypted card processing & Cash on Delivery (COD) with verification.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-1">Complimentary Returns</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              30-day doorstep courier collection with tamper-proof return seals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
        <div className="md:col-span-4 space-y-4">
          <CrownLogo size="md" lightMode={true} />
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-4">
            Founded with uncompromising reverence for bespoke craftsmanship and timeless silhouettes. Dedicated to dressing monarchs, leaders, and connoisseurs of fine garments since 1924.
          </p>
          <div className="pt-2">
            <span className="text-xs text-slate-500 uppercase tracking-widest block font-medium">Flagship Atelier</span>
            <span className="text-xs text-slate-300">42 Regent Street & 18 Grosvenor Terrace</span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Collections</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors cursor-pointer">
                Outerwear & Coats
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors cursor-pointer">
                Bespoke Tailoring
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors cursor-pointer">
                Cashmere & Knitwear
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors cursor-pointer">
                Silk Eveningwear
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors cursor-pointer">
                Royal Accessories
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Operations</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <button onClick={() => onNavigate('tracking')} className="hover:text-white transition-colors cursor-pointer">
                Live Courier Tracking
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('radius')} className="hover:text-white transition-colors cursor-pointer">
                Delivery Radius Engine
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('bespoke')} className="hover:text-white transition-colors cursor-pointer">
                VIP Bespoke Booking
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors cursor-pointer">
                Admin Console
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Royal Dispatch Gazette</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Receive private invitations to seasonal private viewings, bespoke capsule releases, and tailored fittings.
          </p>

          <form onSubmit={handleSubscribe} className="relative">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your private email..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Enrolled</span>
                  </>
                ) : (
                  <>
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            {subscribed && (
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3 h-3" /> Welcome to the Crown Royal Circle. Your private invitation is en route.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © 2026 Crown Clothing Guild Ltd. All rights reserved. Sovereign Royal Warrant holder.
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Heritage</span>
          <span className="hover:text-slate-400 cursor-pointer">Bespoke Protocol</span>
        </div>
      </div>
    </footer>
  );
};
