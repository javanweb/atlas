import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { Product } from '../../../types';
import { STORE_ASSETS } from '../../../assets/images';

interface WorkspaceContextPanelProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onSubmitInquiry: (product: Product) => void;
}

function formatToman(amount?: number): string {
  if (!amount) return 'استعلامی';
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}

export const WorkspaceContextPanel: React.FC<WorkspaceContextPanelProps> = ({
  product,
  onClose,
  onAddToCart,
  onSubmitInquiry,
}) => {
  if (!product) return null;

  return (
    <aside className="w-80 lg:w-96 bg-[#FAFAFC] border-r border-slate-200/90 flex flex-col shrink-0 z-20 animate-slide-left select-none">
      {/* ------------------------------------------------------------------- */}
      {/* HEADER                                                              */}
      {/* ------------------------------------------------------------------- */}
      <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-bold text-slate-900">مشخصات و کاتالوگ قطعه</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* PRODUCT BODY                                                        */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Product Photo */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3 aspect-video flex items-center justify-center relative shadow-xs">
          <img
            src={product.images?.[0] || STORE_ASSETS.products.forzaBelt || STORE_ASSETS.categories.belts}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
          <span className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {product.brand}
          </span>
          {product.stock > 0 && (
            <span className="absolute bottom-2 right-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
              موجود در انبار مرکزی ({product.stock} {product.unit || 'عدد'})
            </span>
          )}
        </div>

        {/* Title & Codes */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">{product.name}</h3>
          {product.nameEn && <p className="text-[11px] text-slate-400 font-mono">{product.nameEn}</p>}
          {product.forzaCode && (
            <div className="p-2 bg-orange-50 border border-orange-200/80 rounded-xl text-orange-800 text-xs font-mono font-bold flex justify-between">
              <span>کد رسمی کاتالوگ:</span>
              <span>{product.forzaCode}</span>
            </div>
          )}
        </div>

        {/* Price & Cart Actions (Connected to Site Store!) */}
        <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">قیمت مصرف‌کننده:</span>
            <span className="text-sm font-black text-slate-900">{formatToman(product.prices?.retail)}</span>
          </div>
          {product.prices?.wholesale && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
              <span>قیمت همکار / پخش:</span>
              <span className="text-emerald-700 font-bold">{formatToman(product.prices?.wholesale)}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onAddToCart(product)}
              className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              افزودن به سبد
            </button>

            <button
              onClick={() => onSubmitInquiry(product)}
              className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
            >
              استعلام پیش‌فاکتور
            </button>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-800">مشخصات فنی قطعه:</div>
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white text-[11px]">
            {product.technicalSpecs && product.technicalSpecs.length > 0 ? (
              product.technicalSpecs.map((spec, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2.5 ${
                    i % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                  }`}
                >
                  <span className="text-slate-500">{spec.key}</span>
                  <span className="text-slate-800 font-medium">{spec.value}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-slate-400">اطلاعات تکمیلی در کاتالوگ ۱۴۰۴ درج شده است.</div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
