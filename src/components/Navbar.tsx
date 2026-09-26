import React, { useState } from 'react';
import { CrownLogo } from './CrownLogo';
import { ShoppingBag, Search, Menu, X, ShieldCheck, MapPin, Truck, Compass, UserCheck } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  cart,
  onOpenCart,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Collection' },
    { id: 'tracking', label: 'Live Tracking' },
    { id: 'radius', label: 'Delivery Radius' },
    { id: 'bespoke', label: 'VIP Bespoke' },
    { id: 'admin', label: 'Admin Console' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Editorial Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              Royal Wedding & Festive Capsule 2026 Live
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-400">
              Complimentary White-Glove Courier across India on orders over ₹9,999
            </span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-amber-400 font-medium">
              UPI & Cash on Delivery Accepted
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => handleLinkClick('tracking')}
              className="hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-rose-500" />
              <span>Track Courier</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => handleLinkClick('radius')}
              className="hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>Coverage Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark & Emblem */}
        <button
          onClick={() => handleLinkClick('home')}
          className="cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1"
          aria-label="Crown Clothing Home"
        >
          <CrownLogo size="md" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-sm font-medium transition-colors cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-slate-950 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Search Collection"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleLinkClick('bespoke')}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wider uppercase text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>VIP Bespoke</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold tabular-nums">
              {totalCartCount}
            </span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activePage === link.id
                  ? 'bg-rose-50 text-rose-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('tracking')}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-rose-600" />
              <span>Track Live Orders</span>
            </button>
            <button
              onClick={() => handleLinkClick('radius')}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Check Delivery Radius</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
