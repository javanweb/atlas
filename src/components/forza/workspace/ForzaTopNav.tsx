import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Search,
  Share2,
  Plus,
  Check,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';

interface ForzaTopNavProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  onOpenSearch: () => void;
  onShareThread: () => void;
  onNewThread: () => void;
}

export const AI_MODELS = [
  {
    id: 'forza-3.8-industrial',
    name: 'FORZA 3.8 Industrial Engine',
    desc: 'تحلیل عمیق مکانیک، کاتالوگ ۱۴۰۴ و فرمول‌های مهندسی',
    badge: 'پیش‌فرض',
    icon: Sparkles,
  },
  {
    id: 'forza-speed-inquiry',
    name: 'FORZA Speed Inquiry',
    desc: 'استعلام سریع موجودی انبار مرکزی و قیمت همکار',
    badge: 'سریع',
    icon: Zap,
  },
  {
    id: 'forza-vision-lab',
    name: 'FORZA Vision & Metrology Lab',
    desc: 'تشخیص عیوب سطحی، پارت نامبر و سایش از روی عکس',
    badge: 'بینایی ماشین',
    icon: Layers,
  },
];

export const ForzaTopNav: React.FC<ForzaTopNavProps> = ({
  selectedModel,
  onSelectModel,
  onOpenSearch,
  onShareThread,
  onNewThread,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeModelObj = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  return (
    <header className="h-16 px-4 md:px-8 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Model Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(prev => !prev)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-bold shadow-sm transition active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>{activeModelObj.name}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 border-b border-slate-100">
                انتخاب موتور هوش مصنوعی فورزا
              </div>
              <div className="space-y-1 mt-1">
                {AI_MODELS.map(model => {
                  const Icon = model.icon;
                  const isSelected = selectedModel === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => {
                        onSelectModel(model.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition flex items-start gap-2.5 ${
                        isSelected ? 'bg-orange-50 border border-orange-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-orange-950' : 'text-slate-800'}`}>
                            {model.name}
                          </span>
                          <span className="text-[10px] text-orange-600 bg-orange-100/70 px-1.5 py-0.5 rounded font-medium">
                            {model.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{model.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right: Actions (Search, Share, New Thread) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Thread */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-medium shadow-sm transition"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">جستجو در گفتگوها</span>
        </button>

        {/* Share / Invite */}
        <button
          onClick={onShareThread}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-medium shadow-sm transition"
          title="اشتراک‌گذاری گزارش و استعلام"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">اشتراک استعلام</span>
        </button>

        {/* New Thread Button (Dark High-Contrast as in screenshot) */}
        <button
          onClick={onNewThread}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/15 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-orange-400" />
          <span>گفتگوی جدید</span>
        </button>
      </div>
    </header>
  );
};
