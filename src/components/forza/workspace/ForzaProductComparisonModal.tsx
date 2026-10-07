import React from 'react';
import { Product } from '../../../types';
import { ComparisonData } from '../../../types/forzaWorkspace';
import { X, Check, Scale, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ForzaProductComparisonModalProps {
  comparisonData: ComparisonData | null;
  onClose: () => void;
  onRequestQuote: (product: Product) => void;
}

export const ForzaProductComparisonModal: React.FC<ForzaProductComparisonModalProps> = ({
  comparisonData,
  onClose,
  onRequestQuote,
}) => {
  if (!comparisonData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#E06518] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {comparisonData.title || 'مقایسه جامع فنی محصولات'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                بررسی متالوژی، راندمان کاری، ظرفیت بار و قیمت محصولات انتخابی
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Products Row Header */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="hidden sm:flex flex-col justify-end p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400">شاخص‌های مقایسه‌ای</span>
              <span className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1">ویژگی‌های فنی و متالوژی</span>
            </div>

            {comparisonData.products.map((product) => (
              <div
                key={product.code}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#E06518] bg-orange-500/10 px-2 py-0.5 rounded-full inline-block">
                    {product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {product.prices?.retail
                      ? new Intl.NumberFormat('fa-IR').format(product.prices.retail) + ' تومان'
                      : 'استعلام قیمت'}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onRequestQuote(product);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 bg-[#E06518] hover:bg-[#C95210] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    استعلام سریع
                  </button>
                  <Link
                    to={`/product/${product.code}`}
                    className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 font-bold text-xs text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              جدول تطبیقی مشخصات فنی
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {comparisonData.comparisonPoints?.map((point, idx) => (
                <div key={idx} className="grid grid-cols-2 sm:grid-cols-3 p-4 items-center gap-4 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300 col-span-2 sm:col-span-1">
                    {point.feature}
                  </div>
                  {comparisonData.products.map((p) => (
                    <div key={p.code} className="text-slate-600 dark:text-slate-300">
                      {point.values?.[p.code] || 'استاندارد کارخانه'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
