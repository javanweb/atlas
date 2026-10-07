import React from 'react';
import { User, Mail, MessageSquare, Code } from 'lucide-react';

interface ExampleCardItem {
  title: string;
  desc: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WORKSPACE_EXAMPLES: ExampleCardItem[] = [
  {
    title: 'محاسبه طول و مقطع تسمه V-Belt',
    desc: 'محاسبه فاصله محوری و قطر پولی‌ها بر اساس استاندارد DIN 2215',
    prompt: 'لطفاً طول و پروفیل تسمه V-Belt مناسب برای فاصله محوری ۵۰۰ میلی‌متر و قطر پولی‌های ۱۶۰ و ۳۱۵ میلی‌متر را بر اساس استاندارد DIN 2215 محاسبه کنید.',
    icon: User,
  },
  {
    title: 'معادل‌یابی بلبرینگ دور بالای C3',
    desc: 'استعلام کلاس لقی و برندهای اروپایی/ژاپنی برای فن کوره',
    prompt: 'مشخصات فنی و گزینه‌های معادل بلبرینگ ۶۲۰۵ با لقی C3 دور بالا را برای موتور فن کوره کاشی بررسی و از کاتالوگ پیشنهاد بده.',
    icon: Mail,
  },
  {
    title: 'استعلام موجودی پولی و کوپلینگ HRC',
    desc: 'سایز شفت ۳۸mm و گشتاور نامی ۳۵۰Nm از انبار مرکزی',
    prompt: 'برای شفت موتور با قطر ۳۸ میلی‌متر و گشتاور ۳۵۰ نیوتن‌متر، کوپلینگ انعطاف‌پذیر HRC مناسب با موجودی انبار مرکزی پیشنهاد بده.',
    icon: MessageSquare,
  },
  {
    title: 'عیب‌یابی سایش و لغزش تسمه در خط',
    desc: 'بررسی علائم خوردگی و راهکار تنظیم کشش و هم‌راستایی',
    prompt: 'علت صدای سوت ممتد و داغ شدن تسمه‌های انتقال قدرت در فن‌های مکنده چیست و راهکار تنظیم کشش و هم‌راستایی پولی‌ها را بگو.',
    icon: Code,
  },
];

interface WorkspaceExampleCardsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const WorkspaceExampleCards: React.FC<WorkspaceExampleCardsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="w-full space-y-3 pt-2 select-none">
      {/* Kicker label matching reference screenshot */}
      <div className="text-[11px] font-bold text-slate-400 tracking-wider text-right uppercase">
        شروع سریع با نمونه‌های پیشنهادی
      </div>

      {/* 4 Cards in 1 Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-right">
        {WORKSPACE_EXAMPLES.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectPrompt(card.prompt)}
              className="bg-[#FAFAFC] hover:bg-white border border-slate-200/80 hover:border-orange-500/50 rounded-2xl p-4 flex flex-col justify-between h-36 cursor-pointer transition shadow-2xs hover:shadow-md group active:scale-[0.99]"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition leading-snug">
                  {card.title}
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {card.desc}
                </div>
              </div>

              {/* Icon at Bottom Left (matching screenshot) */}
              <div className="flex justify-end pt-2">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
