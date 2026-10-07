import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../../types';
import { ExternalLink, CheckCircle2, FileText, Scale, Eye, Sparkles } from 'lucide-react';

interface ForzaProductCardProps {
  product: Product;
  onCompare?: (product: Product) => void;
  onRequestQuote?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ForzaProductCard: React.FC<ForzaProductCardProps> = ({
  product,
  onCompare,
  onRequestQuote,
  onQuickView,
}) => {
  const formattedPrice =
    product.prices && product.prices.retail
      ? new Intl.NumberFormat('fa-IR').format(product.prices.retail) + ' تومان'
      : 'استعلام قیمت روز';

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-orange-500/50 flex flex-col justify-between text-right overflow-hidden">
      {/* Top Brand & Stock Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/10 text-[#E06518] border border-orange-500/20">
          {product.brand || 'FORZA'}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{product.stock > 0 ? `موجود در انبار (${product.stock} ${product.unit || 'عدد'})` : 'تحویل ۲۴ ساعته'}</span>
        </div>
      </div>

      {/* Main Image & Content */}
      <div className="flex gap-3.5 items-start">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700/60">
          <img
            src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.cataloguePage && (
            <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-[9px] text-white px-1.5 py-0.5 rounded font-mono">
              p.{product.cataloguePage}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#E06518] transition-colors">
            {product.name}
          </h4>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
            کد محصول: {product.code} {product.forzaCode ? `| ${product.forzaCode}` : ''}
          </p>

          {/* Specs Mini Badges */}
          <div className="mt-2 flex flex-wrap gap-1">
            {product.technicalSpecs?.slice(0, 2).map((spec, i) => (
              <span
                key={i}
                className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md truncate max-w-[150px]"
              >
                {spec.key}: {spec.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 block">قیمت تخمینی:</span>
          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
            {formattedPrice}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onCompare && (
            <button
              type="button"
              onClick={() => onCompare(product)}
              title="افزودن به مقایسه"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          {onRequestQuote && (
            <button
              type="button"
              onClick={() => onRequestQuote(product)}
              className="px-3 py-1.5 rounded-xl bg-[#E06518] hover:bg-[#C95210] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>استعلام قیمت</span>
            </button>
          )}

          <Link
            to={`/product/${product.code}`}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="مشاهده صفحه محصول"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
