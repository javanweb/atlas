import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Paperclip,
  ChevronDown,
  ArrowUp,
  Mic,
  Camera,
  FileText,
  X,
  Database,
  Check,
} from 'lucide-react';

interface ForzaPromptBoxProps {
  inputText: string;
  onChangeInput: (text: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  attachedImagePreview: string | null;
  attachedFileMeta: { name: string; size: string; type: string } | null;
  onClearImage: () => void;
  onClearFile: () => void;
  onSelectImageFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectDocFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRecordingVoice: boolean;
  onToggleVoice: () => void;
  analysisStyle: 'deep' | 'fast' | 'formula';
  onChangeAnalysisStyle: (style: 'deep' | 'fast' | 'formula') => void;
  isCitationEnabled: boolean;
  onToggleCitation: () => void;
}

export const ForzaPromptBox: React.FC<ForzaPromptBoxProps> = ({
  inputText,
  onChangeInput,
  onSubmit,
  isGenerating,
  attachedImagePreview,
  attachedFileMeta,
  onClearImage,
  onClearFile,
  onSelectImageFile,
  onSelectDocFile,
  isRecordingVoice,
  onToggleVoice,
  analysisStyle,
  onChangeAnalysisStyle,
  isCitationEnabled,
  onToggleCitation,
}) => {
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const styleLabels: Record<string, string> = {
    deep: 'تحلیل عمیق مهندسی',
    fast: 'استعلام تجاری سریع',
    formula: 'فرمول و محاسبات دقیق',
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 select-none">
      {/* Floating Command Center Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-3.5 sm:p-4 transition-all focus-within:border-orange-400 focus-within:shadow-[0_12px_35px_rgba(234,88,12,0.1)]">
        {/* Attachment preview trays inside card */}
        {(attachedImagePreview || attachedFileMeta) && (
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100">
            {attachedImagePreview && (
              <div className="relative group w-14 h-14 rounded-xl overflow-hidden border border-orange-300">
                <img src={attachedImagePreview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={onClearImage}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {attachedFileMeta && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700">
                <FileText className="w-4 h-4 text-orange-500" />
                <span className="truncate max-w-[180px] font-medium">{attachedFileMeta.name}</span>
                <span className="text-[10px] text-slate-400">({attachedFileMeta.size})</span>
                <button type="button" onClick={onClearFile} className="text-slate-400 hover:text-slate-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Text Input Area */}
        <div className="relative flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-orange-400 mt-2 shrink-0 hidden sm:block" />
          <textarea
            value={inputText}
            onChange={e => onChangeInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            rows={2}
            placeholder="از هوش مصنوعی فورزا بپرسید یا مشخصات قطعه را وارد کنید..."
            className="w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none resize-none min-h-[48px] max-h-36 py-1 leading-relaxed"
          />
        </div>

        {/* Bottom Toolbar within Card */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-1 border-t border-slate-100">
          {/* Left Actions: Attachments & Style Dropdown */}
          <div className="flex items-center gap-2">
            {/* Attach Button with Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAttachMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition"
              >
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>ضمیمه</span>
              </button>

              {isAttachMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsAttachMenuOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 text-xs space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachMenuOpen(false);
                        imageInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-right transition"
                    >
                      <Camera className="w-4 h-4 text-orange-500" />
                      <span>عکس قطعه (بینایی ماشین)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-right transition"
                    >
                      <FileText className="w-4 h-4 text-orange-500" />
                      <span>دیتاشیت یا کاتالوگ (PDF)</span>
                    </button>
                  </div>
                </>
              )}
            </div>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={onSelectImageFile} className="hidden" />
            <input ref={fileInputRef} type="file" onChange={onSelectDocFile} className="hidden" />

            {/* Writing Styles Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStyleDropdownOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition"
              >
                <span>سطح تحلیل: {styleLabels[analysisStyle]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isStyleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsStyleDropdownOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-2 w-52 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 text-xs space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        onChangeAnalysisStyle('deep');
                        setIsStyleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-right transition ${
                        analysisStyle === 'deep' ? 'bg-orange-50 text-orange-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>تحلیل عمیق مهندسی (ISO/DIN)</span>
                      {analysisStyle === 'deep' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeAnalysisStyle('fast');
                        setIsStyleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-right transition ${
                        analysisStyle === 'fast' ? 'bg-orange-50 text-orange-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>استعلام تجاری و انبار</span>
                      {analysisStyle === 'fast' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeAnalysisStyle('formula');
                        setIsStyleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-right transition ${
                        analysisStyle === 'formula' ? 'bg-orange-50 text-orange-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>فرمول و روابط مکانیکی</span>
                      {analysisStyle === 'formula' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Actions: Citation Switch, Voice Mic, and Send Button */}
          <div className="flex items-center gap-2.5">
            {/* Citation / Live Catalog Search Switch */}
            <button
              type="button"
              onClick={onToggleCitation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                isCitationEnabled
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'bg-slate-100 text-slate-500 border border-transparent'
              }`}
              title="اتصال زنده به پایگاه داده و کاتالوگ انبار مرکزی"
            >
              <span className={`w-2 h-2 rounded-full ${isCitationEnabled ? 'bg-orange-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>استعلام انبار</span>
            </button>

            {/* Mic / Voice STT */}
            <button
              type="button"
              onClick={onToggleVoice}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                isRecordingVoice
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title="ضبط صوت مستقیم و تبدیل به متن"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Dark Circular Send Button (Matching screenshot) */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isGenerating || (!inputText.trim() && !attachedImagePreview && !attachedFileMeta)}
              className="w-9 h-9 rounded-full bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-30 text-white flex items-center justify-center shadow-md shadow-slate-900/20 transition active:scale-90 cursor-pointer"
              title="ارسال درخواست"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
