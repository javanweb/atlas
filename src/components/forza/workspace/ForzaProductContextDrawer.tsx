import React from 'react';
import {
  ShoppingBag,
  X,
  ExternalLink,
  CheckCircle2,
  PhoneCall,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { Product } from '../../../types';
import { STORE_ASSETS } from '../../../assets/images';
import { useCart } from '../../../context/CartContext';

interface ForzaProductContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  similarProducts: Product[];
  onSelectSimilar: (code: string) => void;
}

function formatToman(amount?: number): string {
  if (!amount) return 'استعلامی';
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}

export const ForzaProductContextDrawer: React.FC<ForzaProductContextDrawerProps> = ({
  isOpen,
  onClose,
  product,
  similarProducts,
  onSelectSimilar,
}) => {
  const { addToCart, submitInquiry } = useCart();

  if (!isOpen || !product) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-slate-800 text-sm">جزئیات و سفارش قطعه</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Image & Brand */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 aspect-video flex items-center justify-center p-3">
            <img
              src={product.images?.[0] || STORE_ASSETS.products.forzaBelt || STORE_ASSETS.categories.belts}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {product.brand}
            </div>
            {product.stock > 0 && (
              <div className="absolute bottom-2 right-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                موجود در انبار مرکزی ({product.stock} {product.unit || 'عدد'})
              </div>
            )}
          </div>

          {/* Titles & Codes */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{product.name}</h3>
            {product.nameEn && <div className="text-[11px] text-slate-400 font-mono">{product.nameEn}</div>}
            {product.forzaCode && (
              <div className="text-[11px] text-orange-700 font-bold bg-orange-50 border border-orange-200 p-2 rounded-xl flex items-center justify-between">
                <span>کد رسمی کاتالوگ اطلس:</span>
                <span className="font-mono">{product.forzaCode}</span>
              </div>
            )}
          </div>

          {/* Pricing & Add to Cart Action */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">قیمت مصرف‌کننده:</span>
              <span className="text-sm font-black text-slate-900">{formatToman(product.prices?.retail)}</span>
            </div>
            {product.prices?.wholesale && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-2">
                <span>قیمت همکار / پخش:</span>
                <span className="text-emerald-700 font-bold">{formatToman(product.prices?.wholesale)}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  addToCart(product, 1);
                  alert(`«${product.name}» به سبد خرید اضافه شد.`);
                }}
                className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                افزودن به سبد
              </button>

              <button
                onClick={() => {
                  submitInquiry(product, 1, 'استعلام رسمی قیمت و زمان تحویل پروژه');
                  alert('درخواست استعلام رسمی قیمت و پیش‌فاکتور با موفقیت ثبت شد.');
                }}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200 transition"
              >
                درخواست استعلام
              </button>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">مشخصات فنی و استانداردها:</div>
            <div className="rounded-2xl border border-slate-200 overflow-hidden text-[11px]">
              {product.technicalSpecs && product.technicalSpecs.length > 0 ? (
                product.technicalSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                    }`}
                  >
                    <span className="text-slate-500">{spec.key}</span>
                    <span className="text-slate-800 font-medium">{spec.value}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-slate-400 text-center">مشخصات فنی در کاتالوگ رسمی ۱۴۰۴ درج شده است.</div>
              )}
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-800">محصولات جایگزین و معادل:</div>
              <div className="space-y-1.5">
                {similarProducts.map(sim => (
                  <div
                    key={sim.code}
                    onClick={() => onSelectSimilar(sim.code)}
                    className="p-2.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl cursor-pointer transition flex items-center justify-between"
                  >
                    <span className="truncate text-slate-700 font-medium">{sim.name}</span>
                    <span className="text-orange-600 font-bold shrink-0">{formatToman(sim.prices?.retail)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
