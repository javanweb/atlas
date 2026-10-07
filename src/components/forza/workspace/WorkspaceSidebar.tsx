import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Clock,
  MessageSquare,
  FileText,
  GitBranch,
  Layers,
  Headphones,
  Settings,
  Compass,
} from 'lucide-react';

export type WorkspaceNavTab = 'home' | 'history' | 'tools' | 'files' | 'settings' | 'context';

interface WorkspaceSidebarProps {
  activeTab: WorkspaceNavTab;
  onSelectTab: (tab: WorkspaceNavTab) => void;
  hasUnreadOrSessions?: boolean;
  onOpenLiveForza: () => void;
  userName?: string;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  activeTab,
  onSelectTab,
  hasUnreadOrSessions = false,
  onOpenLiveForza,
  userName = 'کاربر',
}) => {
  const navigate = useNavigate();

  return (
    <aside className="w-16 sm:w-20 bg-[#FAFAFC] border-l border-slate-100 flex flex-col items-center justify-between py-5 shrink-0 z-20 select-none">
      {/* ------------------------------------------------------------------- */}
      {/* TOP SECTION: BRAND LOGO + VERTICAL NAVIGATION ICON STACK            */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Top Brand Logo Button (Gear / Sunburst Icon from reference) */}
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl bg-[#181F2A] hover:bg-orange-600 flex items-center justify-center text-white shadow-xs transition active:scale-95 group relative"
          title="بازگشت به فروشگاه هایپر صنعت"
        >
          <div className="relative flex items-center justify-center">
            {/* Spinning industrial gear ring */}
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-orange-400 group-hover:border-white transition animate-spin-slow" />
            {/* Center Orange Core */}
            <div className="w-2 h-2 rounded-full bg-orange-500 absolute" />
          </div>
        </button>

        {/* Vertical Icon Navigation Stack (Matching Screenshot) */}
        <nav className="flex flex-col items-center gap-3 w-full px-2">
          {/* 1. Home / New Chat */}
          <button
            onClick={() => onSelectTab('home')}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeTab === 'home'
                ? 'bg-orange-50 text-orange-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="صفحه اصلی و چت جدید"
          >
            <Home className="w-5 h-5" />
            {activeTab === 'home' && (
              <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-orange-600" />
            )}
          </button>

          {/* 2. Search Icon */}
          <button
            onClick={() => onSelectTab('history')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="جستجو در گفتگوها"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* 3. Clock / History */}
          <button
            onClick={() => onSelectTab('history')}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeTab === 'history'
                ? 'bg-orange-50 text-orange-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="تاریخچه گفتگوها"
          >
            <Clock className="w-5 h-5" />
            {hasUnreadOrSessions && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500" />
            )}
          </button>

          {/* 4. Chat Messages */}
          <button
            onClick={() => onSelectTab('home')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="پیام‌ها و مشاوره مهندسی"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* 5. Documents / Catalogs */}
          <button
            onClick={() => onSelectTab('files')}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeTab === 'files'
                ? 'bg-orange-50 text-orange-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="کاتالوگ‌ها و اسناد مهندسی"
          >
            <FileText className="w-5 h-5" />
          </button>

          {/* 6. Git Branch / Engineering Tools & Calculations */}
          <button
            onClick={() => onSelectTab('tools')}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeTab === 'tools'
                ? 'bg-orange-50 text-orange-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="ابزارها و محاسبات مهندسی (DIN 2215)"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* 7. Central Warehouse Catalog & Stock */}
          <button
            onClick={() => onSelectTab('context')}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeTab === 'context'
                ? 'bg-orange-50 text-orange-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="مشخصات کاتالوگ و موجودی انبار مرکزی"
          >
            <Layers className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* BOTTOM SECTION: HEADPHONES, SETTINGS, USER PROFILE AVATAR          */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* Headphone / FORZA Live Voice Mode */}
        <button
          onClick={onOpenLiveForza}
          className="w-10 h-10 rounded-xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 flex items-center justify-center transition relative group"
          title="مکالمه زنده و چهره سه‌بعدی FORZA Live"
        >
          <Headphones className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 animate-ping" />
        </button>

        {/* Settings */}
        <button
          onClick={() => onSelectTab('settings')}
          className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
          title="تنظیمات هوش مصنوعی"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar Circle */}
        <div
          onClick={() => navigate('/account')}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-black shadow-xs cursor-pointer hover:ring-2 hover:ring-orange-300 transition"
          title={userName}
        >
          {userName.charAt(0)}
        </div>
      </div>
    </aside>
  );
};
