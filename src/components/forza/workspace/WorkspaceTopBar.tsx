import React, { useState } from 'react';
import { Sparkles, ChevronDown, Search, Share2, Plus, Check } from 'lucide-react';

interface WorkspaceTopBarProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onSearchClick: () => void;
  onNewThread: () => void;
  onShareClick?: () => void;
}

export const WorkspaceTopBar: React.FC<WorkspaceTopBarProps> = ({
  selectedModel,
  onSelectModel,
  onSearchClick,
  onNewThread,
  onShareClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-[#FFFFFF] select-none">
      {/* ------------------------------------------------------------------- */}
      {/* LEFT (IN LTR / RIGHT IN RTL): MODEL SELECTOR DROPDOWN (ChatGPT 4o ⌄) */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(prev => !prev)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs transition"
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>{selectedModel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
        </button>

        {/* Model Menu Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-11 right-0 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-30 space-y-1 text-xs">
            <div
              onClick={() => {
                onSelectModel('FORZA AI 3.8 Industrial');
                setIsDropdownOpen(false);
              }}
              className="p-2.5 rounded-xl hover:bg-orange-50 cursor-pointer flex items-center justify-between text-slate-800 font-medium transition"
            >
              <div>
                <div className="font-bold text-slate-900">FORZA AI 3.8 Industrial</div>
                <div className="text-[10px] text-slate-500">تحلیل عمیق متالورژی و استانداردهای DIN / ISO</div>
              </div>
              {selectedModel.includes('3.8') && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
            </div>

            <div
              onClick={() => {
                onSelectModel('FORZA Fast Quote (تجاری سریع)');
                setIsDropdownOpen(false);
              }}
              className="p-2.5 rounded-xl hover:bg-orange-50 cursor-pointer flex items-center justify-between text-slate-800 font-medium transition"
            >
              <div>
                <div className="font-bold text-slate-900">FORZA Fast Quote</div>
                <div className="text-[10px] text-slate-500">استعلام سریع موجودی انبار مرکزی و قیمت همکار</div>
              </div>
              {selectedModel.includes('Fast') && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* RIGHT: SEARCH THREAD, INVITE/SHARE, AND + NEW THREAD BUTTON         */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Thread Button */}
        <button
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>جستجو در گفتگوها</span>
        </button>

        {/* Invite / Share Button */}
        <button
          onClick={onShareClick || (() => {
            navigator.clipboard.writeText(window.location.href);
            alert('لینک میزکار کپی شد.');
          })}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>اشتراک</span>
        </button>

        {/* + New Thread (Black / Dark Solid Button as in reference) */}
        <button
          onClick={onNewThread}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181F2A] hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>چت جدید</span>
        </button>
      </div>
    </header>
  );
};
