import React from 'react';
import {
  Compass,
  Layers,
  ShoppingBag,
  Activity,
  ArrowUpLeft,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ForzaWelcomeHeroProps {
  onSelectPrompt: (prompt: string) => void;
}

export const STARTER_EXAMPLES = [
  {
    id: 'belt-calc',
    title: 'محاسبه گام و طول تسمه V-Belt',
    desc: 'فاصله محوری ۵۰۰mm و قطر پولی‌های ۱۶۰mm و ۳۱۵mm',
    prompt: 'طول و پروفیل استاندارد تسمه V-Belt مناسب برای فاصله محوری ۵۰۰ میلی‌متر و قطر پولی‌های ۱۶۰ و ۳۱۵ میلی‌متر را بر اساس DIN 2215 محاسبه کن.',
    icon: Compass,
  },
  {
    id: 'bearing-c3',
    title: 'معادل‌یابی بلبرینگ دور بالا C3',
    desc: 'لقی استاندارد شعاعی و برندهای معادل اروپایی/ژاپنی',
    prompt: 'مشخصات فنی و گزینه‌های معادل بلبرینگ ۶۲۰۵ با لقی C3 دور بالا را برای موتور فن کوره کاشی بررسی و از کاتالوگ اطلس پیشنهاد بده.',
    icon: Layers,
  },
  {
    id: 'hrc-coupling',
    title: 'استعلام موجودی پولی و کوپلینگ',
    desc: 'سایز شفت ۳۸mm و گشتاور نامی ۳۵۰Nm',
    prompt: 'برای شفت موتور با قطر ۳۸ میلی‌متر و گشتاور ۳۵۰ نیوتن‌متر، کوپلینگ انعطاف‌پذیر HRC مناسب با موجودی انبار مرکزی پیشنهاد بده.',
    icon: ShoppingBag,
  },
  {
    id: 'wear-analysis',
    title: 'عیب‌یابی سایش و لغزش تسمه',
    desc: 'علت صدای سوت ممتد و افت کشش در خط تولید',
    prompt: 'علت صدای سوت ممتد و داغ شدن تسمه‌های انتقال قدرت در فن‌های مکنده چیست و راهکار تنظیم کشش و هم‌راستایی پولی‌ها را بگو.',
    icon: Activity,
  },
];

export const ForzaWelcomeHero: React.FC<ForzaWelcomeHeroProps> = ({ onSelectPrompt }) => {
  const { currentUser } = useAuth();

  // Time-based greeting in Persian
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'صبح به‌خیر';
    if (hour >= 12 && hour < 17) return 'ظهر به‌خیر';
    if (hour >= 17 && hour < 21) return 'عصر به‌خیر';
    return 'شب به‌خیر';
  };

  const displayName = currentUser?.fullName || (currentUser as any)?.name || 'مهندس گرامی';

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-6 sm:pt-10 pb-4 px-4 select-none">
      {/* 3D Glowing Energy Orb (Signature FORZA Orange & Amber) */}
      <div className="relative mb-6 group cursor-pointer">
        {/* Soft Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/25 via-amber-500/20 to-orange-600/25 rounded-full blur-2xl animate-pulse" />

        {/* 3D Industrial Sphere Orb */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ffedd5 0%, #fb923c 30%, #ea580c 65%, #9a3412 100%)',
            boxShadow: 'inset -6px -6px 14px rgba(0,0,0,0.35), inset 6px 6px 14px rgba(255,255,255,0.7), 0 15px 35px rgba(234,88,12,0.35)',
          }}
        >
          {/* Subtle Inner Reflection Specular Highlight */}
          <div className="absolute top-2 left-3 w-7 h-4 rounded-full bg-white/60 blur-[1px] rotate-[-25deg]" />
          <div className="absolute bottom-2 right-3 w-4 h-2 rounded-full bg-amber-300/40 blur-[2px]" />
        </div>
      </div>

      {/* Main Hero Typography */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug">
        {getGreeting()}، {displayName}
      </h1>
      <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 mt-1">
        چه کمکی برای <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">خطوط صنعتی</span> شما از دست من برمی‌آید؟
      </p>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-500 max-w-lg mt-3 leading-relaxed">
        مشاور جامع سیستم‌های انتقال قدرت، محاسبات گام و طول تسمه، استعلام موجودی انبار مرکزی و تحلیل تصاویر قطعات.
      </p>

      {/* Starter Examples Section */}
      <div className="w-full mt-10 text-right">
        <div className="text-[11px] font-bold text-slate-400 tracking-wider mb-3 px-1 uppercase">
          شروع سریع با نمونه‌های پیشنهادی (GET STARTED WITH AN EXAMPLE BELOW)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STARTER_EXAMPLES.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onSelectPrompt(item.prompt)}
                className="group relative bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-orange-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between min-h-[130px] text-right"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-slate-400 group-hover:text-orange-500 transition-colors">
                  <Icon className="w-4 h-4" />
                  <ArrowUpLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
