import React from 'react';
import {
  MessageSquare,
  Clock,
  Wrench,
  Layers,
  Database,
  Radio,
  Settings,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  User,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ForzaIconRailProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLive: () => void;
  onReturnToStore: () => void;
}

export const ForzaIconRail: React.FC<ForzaIconRailProps> = ({
  activeTab,
  onSelectTab,
  onOpenLive,
  onReturnToStore,
}) => {
  const { currentUser } = useAuth();

  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'میزکار چت و پرسش' },
    { id: 'history', icon: Clock, label: 'تاریخچه گفتگوها' },
    { id: 'tools', icon: Wrench, label: 'ابزارها و محاسبات مهندسی' },
    { id: 'products', icon: Database, label: 'کاتالوگ و انبار مرکزی' },
    { id: 'files', icon: Layers, label: 'اسناد و تحلیل تصاویر' },
  ];

  return (
    <aside className="w-16 md:w-[68px] bg-white border-l border-slate-200/90 flex flex-col items-center justify-between py-4 shrink-0 select-none z-30 shadow-[0_0_15px_rgba(0,0,0,0.03)]">
      {/* Top: Brand Logo */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onReturnToStore}
          className="group relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 hover:scale-105 transition-all duration-200 cursor-pointer"
          title="بازگشت به هایپر صنعت اطلس"
        >
          <div className="font-black text-sm tracking-tighter">FZ</div>
          <span className="absolute right-full mr-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg z-50">
            بازگشت به فروشگاه
          </span>
        </button>

        {/* Vertical Nav Icons */}
        <nav className="flex flex-col items-center gap-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onSelectTab(item.id)}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/80'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  {/* Left Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-orange-600 rounded-r-full shadow-sm" />
                  )}
                </button>

                {/* Hover Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg z-50">
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: FORZA Live, Settings, User Profile */}
      <div className="flex flex-col items-center gap-2 pt-4 border-t border-slate-100 w-full px-2">
        {/* 🎙 FORZA Live Button */}
        <div className="relative group">
          <button
            onClick={onOpenLive}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 hover:from-orange-500 hover:to-amber-500 text-orange-600 hover:text-white border border-orange-200/80 flex items-center justify-center transition-all duration-200"
            title="مکالمه زنده تصویری FORZA LIVE"
          >
            <Radio className="w-5 h-5 animate-pulse" />
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg z-50">
            تماس چهره‌به‌چهره زنده (FORZA Live)
          </div>
        </div>

        {/* Settings Button */}
        <div className="relative group">
          <button
            onClick={() => onSelectTab('settings')}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
              activeTab === 'settings'
                ? 'bg-orange-50 text-orange-600'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/80'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg z-50">
            تنظیمات هوش مصنوعی
          </div>
        </div>

        {/* User Avatar */}
        <div className="relative group pt-1">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500 transition">
            {currentUser?.fullName || (currentUser as any)?.name ? (
              <span className="text-orange-600">{(currentUser?.fullName || (currentUser as any)?.name).slice(0, 1)}</span>
            ) : (
              <User className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg z-50">
            {currentUser?.fullName || (currentUser as any)?.name || 'حساب کاربری صنعت‌پیش'}
          </div>
        </div>
      </div>
    </aside>
  );
};
