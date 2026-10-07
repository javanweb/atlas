import React, { useState } from 'react';
import { Product } from '../../../types';
import { X, FileText, CheckCircle2, ShieldCheck, Building2, Phone, User, Send } from 'lucide-react';

interface ForzaRfqModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmit: (product: Product, quantity: number, notes: string) => void;
}

export const ForzaRfqModal: React.FC<ForzaRfqModalProps> = ({
  product,
  onClose,
  onSubmit,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSubmit(product, quantity, notes);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#E06518] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                درخواست استعلام قیمت و پیش‌فاکتور (RFQ)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                صدور مستقیم از انبار مرکزی FORZA و اعمال تخفیف همکاری
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              استعلام قیمت با موفقیت در مکالمه ثبت شد
            </h4>
            <p className="text-xs text-slate-500">
              شماره پیگیری و پیش‌فاکتور رسمی در جریان مکالمه قابل مشاهده است.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Selected Product Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
              <img
                src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200'}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover bg-white dark:bg-slate-900 border"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#E06518]">{product.brand}</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <span className="text-[11px] font-mono text-slate-400">کد: {product.code}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                تعداد مورد نیاز ({product.unit || 'عدد'}):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                />
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span>موجودی فوری: {product.stock} {product.unit || 'عدد'}</span>
                </div>
              </div>
            </div>

            {/* Company / Factory Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                نام کارخانه / مجتمع صنعتی (اختیاری):
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="مثال: کاشی و سرامیک میبد یزد"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                توضیحات و نیازمندی فنی:
              </label>
              <textarea
                rows={2}
                placeholder="درخواست تحویل فوری، سرتیفیکیت متالوژی و شرایط پرداخت..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-hidden resize-none"
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#E06518] hover:bg-[#C95210] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'در حال ثبت...' : 'ثبت و صدور در مکالمه'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
