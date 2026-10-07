import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Camera,
  Paperclip,
  Mic,
  Video,
  ArrowLeft,
  ArrowUp,
  Search,
  Scan,
  FileText,
  Radio,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface ForzaWorkspaceEmptyStateProps {
  onSendMessage: (text: string, attachments?: File[]) => void;
  onOpenFaceToFace: () => void;
  onTriggerImageSearch: () => void;
  onTriggerFileAnalysis: () => void;
  onTriggerVoice: () => void;
}

export const ForzaWorkspaceEmptyState: React.FC<ForzaWorkspaceEmptyStateProps> = ({
  onSendMessage,
  onOpenFaceToFace,
  onTriggerImageSearch,
  onTriggerFileAnalysis,
  onTriggerVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && attachedFiles.length === 0) return;

    onSendMessage(inputText, attachedFiles);
    setInputText('');
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const quickActionCards = [
    {
      id: 'identify',
      icon: Scan,
      title: 'شناسایی هوشمند قطعه',
      desc: 'تشخیص قطعه مستهلک و تطابق با کاتالوگ FORZA',
      action: onTriggerImageSearch,
      accent: 'from-orange-500/10 to-amber-500/10 border-orange-500/20 text-[#E06518]',
    },
    {
      id: 'visual-search',
      icon: Camera,
      title: 'جستجو با تصویر محصول',
      desc: 'آپلود عکس پلاک ماشین‌آلات یا نمونه فابریک',
      action: onTriggerImageSearch,
      accent: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-500',
    },
    {
      id: 'file-analysis',
      icon: FileText,
      title: 'تحلیل کاتالوگ و لیست BOM',
      desc: 'بررسی فایل‌های PDF فنی و استخراج مشخصات',
      action: onTriggerFileAnalysis,
      accent: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-500',
    },
    {
      id: 'voice-facetoface',
      icon: Video,
      title: 'مکالمه زنده Face-to-Face',
      desc: 'ارتباط مستقیم صوتی و تصویری با هوش مصنوعی',
      action: onOpenFaceToFace,
      accent: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-500',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full text-center select-none animate-in fade-in duration-500">
      
      {/* 1. Glowing 3D Holographic AI Orb (Inspired by design reference) */}
      <div className="relative mb-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-[#C95210] via-[#E06518] to-amber-400 p-[2px] shadow-[0_0_50px_rgba(249,115,22,0.4)] animate-pulse">
          <div className="w-full h-full rounded-full bg-[#12203C] flex items-center justify-center overflow-hidden relative">
            {/* Luminous Core Reflection */}
            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-amber-300 to-transparent blur-md opacity-80 animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_60%)]" />
            <Sparkles className="w-8 h-8 text-white relative z-10 drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* 2. Main Greeting & Header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          روز بخیر، متخصص صنعتی
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
          چه قطعه‌ای را می‌خواهید در کاتالوگ FORZA پیدا یا بررسی کنید؟
        </p>
      </div>

      {/* 3. Floating Main Prompt Box (Matches Design Reference) */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 text-right mb-8 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
        
        {/* Attached Files Chips (if any) */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#E06518]" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-rose-500 text-sm font-bold ml-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="پیام خود را بنویسید، تصویر محصول را ارسال کنید یا با FORZA صحبت کنید..."
          className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none outline-hidden leading-relaxed"
        />

        {/* Action Controls Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          {/* Left Buttons: Attachments, Camera, Voice, Face-to-Face */}
          <div className="flex items-center gap-1.5">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileSelected}
            />

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              title="افزودن تصویر قطعه"
            >
              <Camera className="w-3.5 h-3.5 text-[#E06518]" />
              <span className="hidden sm:inline">افزودن تصویر</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              title="آپلود کاتالوگ یا فایل فنی"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">فایل</span>
            </button>

            <button
              type="button"
              onClick={onOpenFaceToFace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#E06518] text-xs font-bold transition-colors cursor-pointer"
              title="جلسه رو در رو Face-to-Face"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Face-to-Face</span>
            </button>
          </div>

          {/* Right Button: Send */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!inputText.trim() && attachedFiles.length === 0}
            className="w-9 h-9 rounded-2xl bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Quick Action Cards (4 Shortcuts matching brief) */}
      <div className="w-full max-w-2xl space-y-2 text-right">
        <div className="text-[11px] font-bold text-slate-400 px-1">
          شروع سریع با نمونه‌های پرکاربرد:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={card.action}
                className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 flex items-start gap-3.5 text-right group cursor-pointer active:scale-98`}
              >
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.accent} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#E06518] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
