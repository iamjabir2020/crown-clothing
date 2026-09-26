import React, { useState } from 'react';
import { Eye, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { resolveImageUrl, handleImageError } from '../utils/imageResolver';
import { formatINR, getMonthlyEMI } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedColor, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-slate-200/80 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
        <img
          src={resolveImageUrl(
            isHovered && product.secondaryImage ? product.secondaryImage : product.image,
            product.id,
            Boolean(isHovered && product.secondaryImage)
          )}
          alt={product.name}
          loading="lazy"
          onError={(e) => handleImageError(e, resolveImageUrl(undefined, product.id))}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Quiet editorial text tag (no pill badges!) */}
        <div className="absolute top-3 left-3 text-[11px] uppercase tracking-widest font-semibold text-slate-800 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded shadow-xs">
          {product.isBestseller ? 'Bestseller' : product.isNew ? 'New Season' : product.category}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-semibold rounded-lg shadow-md hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Examine</span>
          </button>

          <button
            onClick={handleQuickAdd}
            className="py-2 px-3.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            aria-label="Quick add to bag"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-rose-400" />
                <span>Bag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          {/* Unboxed metadata line with typographic bullet */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{product.gender}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700">{product.stockCount} available</span>
          </div>

          <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-rose-700 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          {/* Swatches */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  selectedColor === c.name
                    ? 'ring-2 ring-rose-500 ring-offset-1 border-white scale-110'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Select ${c.name}`}
              />
            ))}
          </div>

          {/* Price & EMI */}
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through tabular-nums font-sans">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              <span className="text-sm font-bold text-slate-950 tabular-nums font-sans">
                {formatINR(product.price)}
              </span>
            </div>
            {product.price >= 30000 && (
              <span className="text-[10px] text-amber-700 font-medium tracking-tight">
                EMI from {getMonthlyEMI(product.price, 6)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
