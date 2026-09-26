import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Truck, RotateCcw, Ruler, Check, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { resolveImageUrl, handleImageError } from '../utils/imageResolver';
import { formatINR, getMonthlyEMI } from '../utils/currency';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  onDirectCheckout: (product: Product, color: string, size: string, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'fabric' | 'sizing' | 'delivery'>('fabric');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const resolvedMainImage = resolveImageUrl(product.image, product.id);
  const resolvedSecondaryImage = product.secondaryImage
    ? resolveImageUrl(product.secondaryImage, product.id, true)
    : undefined;

  const [currentImage, setCurrentImage] = useState(resolvedMainImage);

  useEffect(() => {
    setCurrentImage(resolvedMainImage);
  }, [product?.id, resolvedMainImage]);

  const images = [resolvedMainImage, ...(resolvedSecondaryImage ? [resolvedSecondaryImage] : [])];

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    onDirectCheckout(product, selectedColor, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 my-8">
        {/* Header Close */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Crown Atelier</span>
            <span>/</span>
            <span>{product.gender}</span>
            <span>/</span>
            <span>{product.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-6 bg-slate-50/60 flex flex-col gap-4">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
              <img
                src={currentImage}
                alt={product.name}
                onError={(e) => handleImageError(e, resolvedMainImage)}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-slate-900">
                Savile Row Standard
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(img)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      currentImage === img ? 'border-rose-600 ring-2 ring-rose-200' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      onError={(e) => handleImageError(e, resolvedMainImage)}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Side */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-amber-600 font-semibold">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} connoisseur reviews)</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 font-serif-luxury leading-tight">
                  {product.name}
                </h2>

                <div className="flex flex-wrap items-baseline gap-3 mt-2">
                  <span className="text-2xl font-bold text-slate-950 tabular-nums font-sans">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through tabular-nums font-sans">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Complimentary White-Glove Courier Across India
                  </span>
                </div>

                {product.price >= 30000 && (
                  <div className="text-xs text-amber-800 bg-amber-50/70 border border-amber-200/80 rounded-lg px-3 py-1.5 mt-2 flex items-center justify-between">
                    <span>No-Cost EMI available from <strong className="font-semibold">{getMonthlyEMI(product.price, 6)}</strong></span>
                    <span className="text-[11px] text-amber-700 underline cursor-pointer">View Plans</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    Fabric Color: <span className="font-normal text-slate-600">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-400 text-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-white/50" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">Select Tailored Size:</span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Sizing Metric Guide</span>
                  </button>
                </div>

                {showSizeGuide && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 animate-in fade-in">
                    <div className="font-bold text-slate-800">Standard Royal Fitting:</div>
                    <div className="grid grid-cols-4 gap-1 text-[11px] text-slate-600 text-center font-mono">
                      <div className="p-1 bg-white rounded">Size</div>
                      <div className="p-1 bg-white rounded">Chest</div>
                      <div className="p-1 bg-white rounded">Waist</div>
                      <div className="p-1 bg-white rounded">Shoulder</div>
                      <div className="p-1 bg-white rounded font-bold">38R</div>
                      <div className="p-1 bg-white rounded">38-40"</div>
                      <div className="p-1 bg-white rounded">31-33"</div>
                      <div className="p-1 bg-white rounded">17.8"</div>
                      <div className="p-1 bg-white rounded font-bold">40R</div>
                      <div className="p-1 bg-white rounded">40-42"</div>
                      <div className="p-1 bg-white rounded">33-35"</div>
                      <div className="p-1 bg-white rounded">18.5"</div>
                      <div className="p-1 bg-white rounded font-bold">42R</div>
                      <div className="p-1 bg-white rounded">42-44"</div>
                      <div className="p-1 bg-white rounded">35-37"</div>
                      <div className="p-1 bg-white rounded">19.2"</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Added to Wardrobe Bag</span>
                    </>
                  ) : (
                    <span>Add to Wardrobe Bag</span>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Tabbed Specs */}
            <div className="pt-6 border-t border-slate-200 mt-6">
              <div className="flex gap-4 border-b border-slate-200 pb-2 text-xs">
                <button
                  onClick={() => setActiveTab('fabric')}
                  className={`font-semibold pb-1 cursor-pointer transition-colors ${
                    activeTab === 'fabric' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Fabric & Craft
                </button>
                <button
                  onClick={() => setActiveTab('sizing')}
                  className={`font-semibold pb-1 cursor-pointer transition-colors ${
                    activeTab === 'sizing' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Drape & Fit
                </button>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className={`font-semibold pb-1 cursor-pointer transition-colors ${
                    activeTab === 'delivery' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Royal Courier
                </button>
              </div>

              <div className="pt-3 text-xs text-slate-600 leading-relaxed">
                {activeTab === 'fabric' && (
                  <div className="space-y-1">
                    <p><strong>Composition:</strong> {product.composition}</p>
                    <p className="text-slate-500">Milled in heritage bi-centennial European looms under eco-responsible OEKO-TEX certification.</p>
                  </div>
                )}
                {activeTab === 'sizing' && (
                  <div className="space-y-1">
                    <p><strong>Fit Guide:</strong> {product.fit}</p>
                    <p className="text-slate-500">Complimentary tailor alteration consultation available with our Regent Atelier.</p>
                  </div>
                )}
                {activeTab === 'delivery' && (
                  <div className="space-y-1">
                    <p><strong>Courier Service:</strong> Same-day white glove delivery inside central metropolitan radius. Tamper-evident royal seal.</p>
                    <p className="text-slate-500">Doorstep return service included with 30-day window.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
