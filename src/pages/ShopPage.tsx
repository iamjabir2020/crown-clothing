import React, { useState, useMemo } from 'react';
import { Filter, Search, SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Product, ProductCategory, GenderCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatINR } from '../utils/currency';

interface ShopPageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  initialSearchQuery?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onQuickView,
  onAddToCart,
  initialSearchQuery = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedGender, setSelectedGender] = useState<GenderCategory>('All');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: ProductCategory[] = ['All', 'Outerwear', 'Tailoring', 'Knitwear', 'Dresses', 'Accessories'];
  const genders: GenderCategory[] = ['All', 'Men', 'Women', 'Unisex'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (selectedGender !== 'All' && p.gender !== selectedGender && p.gender !== 'Unisex') return false;
        if (p.price > maxPrice) return false;
        if (onlyInStock && !p.inStock) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchComp = p.composition.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchComp && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedGender, maxPrice, onlyInStock, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedGender('All');
    setSearchQuery('');
    setMaxPrice(150000);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-600 block mb-1">
            Crown Atelier 2026
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
            The Sovereign Wardrobe Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Bespoke tailoring, royal bandhgalas, Scottish cashmere outerwear, and pure mulberry silk apparel crafted to imperial specifications.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900 tabular-nums">{filteredProducts.length}</span> of{' '}
          <span className="tabular-nums">{products.length}</span> garments
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Interactive Segmented Control for Categories (Buttons with click handlers) */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Refine</span>
            </button>
          </div>
        </div>

        {/* Search, Gender Segment, Price, and Sort Controls */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs ${mobileFilterOpen ? 'block' : 'hidden md:grid'}`}>
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cashmere, silk, bandhgala, suits..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Gender Segmented */}
          <div className="md:col-span-3 flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedGender === g
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="md:col-span-3 flex items-center gap-2 px-2">
            <span className="text-[11px] text-slate-500 whitespace-nowrap">Max:</span>
            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-900 whitespace-nowrap text-right tabular-nums">
              {formatINR(maxPrice)}
            </span>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-rose-500"
            >
              <option value="featured">Featured Pieces</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Connoisseur Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching garments located</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, widening the price threshold, or selecting a broader category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
