import React, { useState } from 'react';
import { Conversation } from '../../../types/forzaWorkspace';
import {
  Sparkles,
  Search,
  Plus,
  Video,
  Share2,
  MoreVertical,
  ChevronDown,
  Layers,
  Zap,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ForzaWorkspaceHeaderProps {
  conversation: Conversation | null;
  onNewConversation: () => void;
  onOpenFaceToFace: () => void;
  onSearchThread?: () => void;
}

export const ForzaWorkspaceHeader: React.FC<ForzaWorkspaceHeaderProps> = ({
  conversation,
  onNewConversation,
  onOpenFaceToFace,
}) => {
  const { currentUser } = useAuth();
  const [selectedModel, setSelectedModel] = useState('FORZA Atlas Pro 2.5');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const models = [
    { id: 'pro', name: 'FORZA Atlas Pro 2.5', desc: 'تحلیل چندوجهی تصاویر، کاتالوگ و متالوژی' },
    { id: 'fast', name: 'FORZA Fast Vision', desc: 'شناسایی و انطباق آنی پارت‌نامبر کالا' },
    { id: 'rfq', name: 'FORZA RFQ & Pricing', desc: 'صدور خودکار پیش‌فاکتور و استعلام قیمت' },
  ];

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Right Side (RTL Start): Model Switcher & Title */}
      <div className="flex items-center gap-3">
        {/* Model Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E06518]" />
            <span>{selectedModel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isModelDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-right animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1">انتخاب موتور هوش مصنوعی:</div>
              {models.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedModel(m.name);
                    setIsModelDropdownOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-right transition-colors cursor-pointer ${
                    selectedModel === m.name
                      ? 'bg-orange-500/10 text-[#E06518]'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{m.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Title (if active) */}
        {conversation && (
          <div className="hidden md:flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[280px]">
              {conversation.title}
            </span>
          </div>
        )}
      </div>

      {/* Left Side (RTL End): Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Face-to-Face Quick Trigger Button */}
        <button
          type="button"
          onClick={onOpenFaceToFace}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Face-to-Face AI</span>
        </button>

        {/* New Thread Button */}
        <button
          type="button"
          onClick={onNewConversation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">گفتگوی جدید</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center font-bold text-xs">
            {currentUser?.fullName ? currentUser.fullName[0] : <User className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};
