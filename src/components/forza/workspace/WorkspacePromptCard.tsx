import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Paperclip,
  Camera,
  Mic,
  ChevronDown,
  ArrowUp,
  X,
  FileText,
} from 'lucide-react';

export type WritingStyleType = 'engineering' | 'commercial' | 'specs';

interface WorkspacePromptCardProps {
  inputText: string;
  onChangeInput: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  attachedImage: string | null;
  onAttachImage: (base64: string | null) => void;
  attachedFile: { name: string; size: string } | null;
  onAttachFile: (file: { name: string; size: string } | null) => void;
  writingStyle: WritingStyleType;
  onChangeWritingStyle: (style: WritingStyleType) => void;
  isCitationActive: boolean;
  onToggleCitation: () => void;
  isRecordingVoice?: boolean;
  onToggleVoice?: () => void;
  placeholder?: string;
}

export const WorkspacePromptCard: React.FC<WorkspacePromptCardProps> = ({
  inputText,
  onChangeInput,
  onSubmit,
  isLoading = false,
  attachedImage,
  onAttachImage,
  attachedFile,
  onAttachFile,
  writingStyle,
  onChangeWritingStyle,
  isCitationActive,
  onToggleCitation,
  isRecordingVoice = false,
  onToggleVoice,
  placeholder = 'از هوش مصنوعی FORZA بپرسید یا استعلام قطعه ثبت کنید...',
}) => {
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 p-4 sm:p-5 text-right transition focus-within:border-orange-500/80 focus-within:shadow-orange-500/10">
      {/* ------------------------------------------------------------------- */}
      {/* TOP ROW: SPARKLE ICON + TEXTAREA                                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-slate-400 mt-2 shrink-0" />
        <textarea
          value={inputText}
          onChange={e => onChangeInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* ATTACHMENT PREVIEW TRAY                                              */}
      {/* ------------------------------------------------------------------- */}
      {(attachedImage || attachedFile) && (
        <div className="flex items-center gap-2 pt-2 pb-1 border-t border-slate-100 mt-2">
          {attachedImage && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-orange-500">
              <img src={attachedImage} alt="قطعه ارسالی" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onAttachImage(null)}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center transition hover:bg-black/70"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {attachedFile && (
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs">
              <FileText className="w-3.5 h-3.5 text-orange-600" />
              <span className="truncate max-w-[150px]">{attachedFile.name}</span>
              <button
                type="button"
                onClick={() => onAttachFile(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* BOTTOM TOOLBAR: ATTACH, STYLES, CITATION TOGGLE & SEND BUTTON       */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
        {/* Left: Attach & Writing Styles Dropdown */}
        <div className="flex items-center gap-2">
          {/* 📎 Attach Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Paperclip className="w-3.5 h-3.5 text-slate-500" />
            <span>ضمیمه</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                onAttachFile({
                  name: file.name,
                  size: `${Math.round(file.size / 1024)} KB`,
                });
              }
            }}
            className="hidden"
          />

          {/* Camera Photo Upload */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="ارسال عکس قطعه جهت بینایی ماشین و عیب‌یابی"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => onAttachImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />

          {/* Voice Mic Input */}
          {onToggleVoice && (
            <button
              type="button"
              onClick={onToggleVoice}
              className={`p-1.5 rounded-xl border transition ${
                isRecordingVoice
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
              title="ورودی صوتی فارسی"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {/* Writing Styles ⌄ Dropdown */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setIsStyleDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <span>
                {writingStyle === 'engineering'
                  ? 'تحلیل مهندسی'
                  : writingStyle === 'commercial'
                  ? 'استعلام قیمت'
                  : 'جدول مشخصات'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isStyleDropdownOpen && (
              <div className="absolute top-10 right-0 w-44 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5 z-30 text-xs space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onChangeWritingStyle('engineering');
                    setIsStyleDropdownOpen(false);
                  }}
                  className="w-full text-right p-2 rounded-lg hover:bg-orange-50 font-medium text-slate-800 transition"
                >
                  تحلیل مهندسی دقیق
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeWritingStyle('commercial');
                    setIsStyleDropdownOpen(false);
                  }}
                  className="w-full text-right p-2 rounded-lg hover:bg-orange-50 font-medium text-slate-800 transition"
                >
                  استعلام تجاری و انبار
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeWritingStyle('specs');
                    setIsStyleDropdownOpen(false);
                  }}
                  className="w-full text-right p-2 rounded-lg hover:bg-orange-50 font-medium text-slate-800 transition"
                >
                  خروجی جدول مشخصات
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Citation Toggle & Send Arrow Button */}
        <div className="flex items-center gap-3">
          {/* Citation / Catalog 1404 Toggle Switch */}
          <button
            type="button"
            onClick={onToggleCitation}
            className={`hidden sm:flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full transition ${
              isCitationActive
                ? 'text-slate-800 bg-orange-50 border border-orange-200'
                : 'text-slate-400 bg-slate-100'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full transition ${
                isCitationActive ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            />
            <span>استناد به کاتالوگ</span>
          </button>

          {/* Send Button (Dark circle with up arrow as in reference) */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || (!inputText.trim() && !attachedImage && !attachedFile)}
            className="w-9 h-9 rounded-full bg-[#181F2A] hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs active:scale-95 shrink-0"
            title="ارسال پیام"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
