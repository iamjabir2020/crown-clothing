import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, ChevronRight, Award, Compass, MapPin } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { heroFashionImg, courierFleetImg, craftsmanshipImg } from '../data/mockData';
import { resolveImageUrl, handleImageError } from '../utils/imageResolver';

interface HomePageProps {
  products: Product[];
  onNavigate: (page: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onNavigate,
  onQuickView,
  onAddToCart,
}) => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Campaign Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-slate-950 text-white overflow-hidden">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0">
          <img
            src={heroFashionImg}
            alt="Crown Clothing Autumn Sovereign Campaign"
            onError={(e) => handleImageError(e, heroFashionImg)}
            className="w-full h-full object-cover object-center opacity-65 scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Subtle text kicker - zero-pill discipline */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-400">
              <span>Sovereign Capsule</span>
              <span aria-hidden="true">·</span>
              <span>Royal Wedding & Festive 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1] text-balance">
              Elegance Woven with Royal Heritage.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
              Architectural tailoring, pure Scottish cashmere, and handcrafted mulberry silk designed for royalty, industrialists, and discerning connoisseurs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore Sovereign Catalog</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('tracking')}
                className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs tracking-wider uppercase rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-rose-400" />
                <span>Live Courier Telemetry</span>
              </button>
            </div>

            {/* Quiet trust markers */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6 text-xs text-slate-400 max-w-lg">
              <div>
                <span className="block font-bold text-white text-sm font-mono tabular-nums">100%</span>
                <span>Pure Natural Fibres</span>
              </div>
              <div>
                <span className="block font-bold text-white text-sm font-mono tabular-nums">90-Minute</span>
                <span>Electric Courier in Metros</span>
              </div>
              <div>
                <span className="block font-bold text-white text-sm font-mono tabular-nums">Imperial</span>
                <span>Atelier Standard</span>
              </div>
            </div>

            {/* Quick Delivery Radius Checker Inline Widget */}
            <div className="pt-2 max-w-lg">
              <div className="p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-[11px]">Check 90-Min Courier in Mumbai, Delhi & Metros:</span>
                </div>
                <button
                  onClick={() => onNavigate('radius')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Verify Pincode
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collection Pathways */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-600 block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Heritage Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-slate-700 hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View Full 2026 Lookbook</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Outerwear & Overcoats',
              desc: 'Dense 620gsm Scottish wool & cashmere',
              filter: 'Outerwear',
              image: resolveImageUrl(products[0]?.image, 'crw-01'),
              productId: 'crw-01',
            },
            {
              title: 'Bespoke Tailoring',
              desc: 'Half-canvas Super 150s Italian worsted suits',
              filter: 'Tailoring',
              image: resolveImageUrl(products[3]?.image, 'crw-04'),
              productId: 'crw-04',
            },
            {
              title: 'Pure Silk Eveningwear',
              desc: 'Grade 6A Mulberry silk charmeuse gowns',
              filter: 'Dresses',
              image: resolveImageUrl(products[1]?.image, 'crw-02'),
              productId: 'crw-02',
            },
            {
              title: 'Heritage Knitwear',
              desc: '19.5-micron fine-gauge merino wool',
              filter: 'Knitwear',
              image: resolveImageUrl(products[2]?.image, 'crw-03'),
              productId: 'crw-03',
            },
          ].map((cat) => (
            <div
              key={cat.title}
              onClick={() => onNavigate('shop')}
              className="group relative rounded-xl overflow-hidden bg-slate-900 aspect-[4/5] cursor-pointer shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                onError={(e) => handleImageError(e, resolveImageUrl(undefined, cat.productId))}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-white">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-rose-400 block mb-1">
                  Atelier Craft
                </span>
                <h3 className="text-lg font-bold font-serif-luxury leading-snug">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {cat.desc}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-rose-300 group-hover:text-white transition-colors">
                  <span>Explore pieces</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Masterpieces Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-600 block mb-1">
              Crown Signatures
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Featured Sovereign Garments
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span>Direct Atelier Dispatch</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">Immediate Delivery Eligible</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Operational Spotlight: Royal Electric Courier Fleet & Same-Day Radius */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 grid grid-cols-1 lg:grid-cols-12 shadow-xl">
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-400">
                <Truck className="w-4 h-4 text-rose-500" />
                <span>Proprietary Logistics Engine</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white text-balance leading-tight">
                White-Glove Doorstep Delivery in Under 90 Minutes.
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Crown Clothing maintains an exclusive zero-emission electric luxury courier fleet across Mumbai, Delhi NCR, and Bengaluru. Every garment travels in breathable cedar-infused wardrobe bags on velvet hangers, delivered by uniformed royal couriers with live GPS telemetry.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-4 border-y border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Metro Radius Perimeter</span>
                <span className="text-base font-bold text-white font-mono tabular-nums">18.0 Km</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Average Dispatch</span>
                <span className="text-base font-bold text-white font-mono tabular-nums">22 Minutes</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">On-Time Accuracy</span>
                <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">99.2%</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('tracking')}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Order #CRW-88219 (Mumbai Fleet)</span>
              </button>

              <button
                onClick={() => onNavigate('radius')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Check Your Pincode Zone</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-auto">
            <img
              src={courierFleetImg}
              alt="Crown Clothing Electric Courier Van"
              loading="lazy"
              onError={(e) => handleImageError(e, courierFleetImg)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2 animate-ping" />
              <span>Royal Electric Fleet Active · 8 Vans En Route in Mumbai & Delhi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Savile Row Craftsmanship & Heritage Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-600">
              <Award className="w-4 h-4" />
              <span>Century of Sovereignty</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 text-balance leading-tight">
              Honoring Century-Old Royal Darbar & Tailoring Traditions.
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Every Crown garment begins with natural fibres harvested from heritage mills in Biella, Como, Scotland, and Himalayan valleys. Our master cutters draft patterns by hand to celebrate anatomical poise, creating bandhgala and tuxedo silhouettes that mold to their wearer over decades.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'Half-Canvas & Full-Canvas Architecture', desc: 'Natural horsehair chest canvassing that breathes and drapes effortlessly in tropical and temperate climates.' },
                { title: 'Hand-Rolled Lapels & Pick-Stitch Detailing', desc: 'Over 2,000 delicate manual needle passes per jacket for soft roll contours and crisp imperial structure.' },
                { title: 'Bespoke Monogramming & Palace Suite Fittings', desc: 'Private fittings in your penthouse, heritage residence, or our Colaba & Mehrauli flagship salons.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('bespoke')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book VIP Tailoring Consultation</span>
                <ArrowRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>

          <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src={craftsmanshipImg}
              alt="Master Tailor at Work"
              loading="lazy"
              onError={(e) => handleImageError(e, craftsmanshipImg)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700">
              <span className="text-xs font-bold block">The Sovereign Crest Certificate</span>
              <p className="text-[11px] text-slate-300 mt-1">
                Each overcoat, bandhgala, and bespoke suit is individually numbered and logged in our Atelier ledger with certified pedigree and provenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connoisseur Testimonials & Press Accolades */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-600 block mb-1">
              Royal Patrons
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Endorsed by Connoisseurs
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The cashmere double-breasted overcoat and bespoke bandhgala are extraordinary. The drape is immaculate, and the white-glove courier delivery to our Worli residence in 45 minutes was exceptional.",
                author: "Gayatri Devi Singhania",
                title: "Industrialist & Arts Patron",
                location: "Worli Sea Face, Mumbai",
              },
              {
                quote: "Crown Clothing represents the highest pinnacle of tailoring in India today. The Super 150s half-canvas suit feels weightless, and the live GPS tracking gave our security staff seamless arrival coordinates.",
                author: "Maharaj Samarjit Singh",
                title: "Heritage Foundation Trustee",
                location: "Golf Links, New Delhi",
              },
              {
                quote: "The Grade 6A mulberry silk slip dress and pure silk twill stoles are essential for royal festive season evenings. Uncompromising elegance, peerless finish, and prompt doorstep delivery.",
                author: "Rani Priyadarshini Scindia",
                title: "Palace Cultural Archive",
                location: "C-Scheme, Jaipur",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                  "{t.quote}"
                </p>
                <div className="border-t border-slate-100 pt-3">
                  <div className="text-xs font-bold text-slate-900">{t.author}</div>
                  <div className="text-[11px] text-slate-500">{t.title}</div>
                  <div className="text-[10px] text-rose-600 font-medium mt-0.5">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
