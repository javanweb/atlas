import React, { useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Copy,
  ShoppingBag,
  FileText,
  Paperclip,
  Camera,
  Mic,
  ArrowUp,
} from 'lucide-react';
import { CATALOGUE_ITEMS } from '../../../data/catalogueProducts';
import { STORE_ASSETS } from '../../../assets/images';
import { renderEngineeringMarkdown } from '../../../utils/engineeringMarkdown';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachedImage?: string;
  attachedFile?: { name: string; size: string };
  reasoningSteps?: string[];
  recommendedProductCodes?: string[];
  audioBase64?: string;
  isStreaming?: boolean;
}

interface WorkspaceChatStreamProps {
  messages: ChatMessage[];
  isPlayingAudioId: string | null;
  onPlayAudio: (msgId: string, audioBase64?: string) => void;
  onSelectProductCode: (code: string) => void;
  inputText: string;
  onChangeInput: (text: string) => void;
  onSendMessage: () => void;
  isAiGenerating: boolean;
  onAttachFileClick: () => void;
  onAttachImageClick: () => void;
  isRecordingVoice: boolean;
  onToggleVoice: () => void;
}

function formatToman(amount?: number): string {
  if (!amount) return 'استعلامی';
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}

export const WorkspaceChatStream: React.FC<WorkspaceChatStreamProps> = ({
  messages,
  isPlayingAudioId,
  onPlayAudio,
  onSelectProductCode,
  inputText,
  onChangeInput,
  onSendMessage,
  isAiGenerating,
  onAttachFileClick,
  onAttachImageClick,
  isRecordingVoice,
  onToggleVoice,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden">
      {/* ------------------------------------------------------------------- */}
      {/* MESSAGES CONTAINER                                                  */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto space-y-5 px-1 py-4 max-w-4xl w-full mx-auto">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isUser ? 'mr-auto justify-end' : 'ml-auto justify-start'}`}
            >
              {!isUser && (
                <div className="w-9 h-9 rounded-xl bg-[#181F2A] text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs mt-1">
                  FZ
                </div>
              )}

              <div
                className={`space-y-2.5 max-w-[88%] sm:max-w-[80%] ${
                  isUser
                    ? 'bg-slate-100 text-slate-900 rounded-2xl rounded-tr-sm p-4 text-sm'
                    : 'bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-5 text-slate-800 shadow-sm'
                }`}
              >
                {/* Attached Image Preview */}
                {msg.attachedImage && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56 mb-2">
                    <img src={msg.attachedImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Attached File Preview */}
                {msg.attachedFile && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-orange-600 mb-2">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="font-medium truncate">{msg.attachedFile.name}</span>
                  </div>
                )}

                {/* Message Text Content */}
                <div className="text-xs sm:text-sm leading-relaxed">
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : msg.isStreaming && !msg.content ? (
                    <div className="flex items-center gap-2 text-slate-500 py-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                      <span>در حال پردازش معادلات و استعلام انبار...</span>
                    </div>
                  ) : (
                    renderEngineeringMarkdown(msg.content, false)
                  )}
                </div>

                {/* Inline Recommended Product Cards */}
                {!isUser && msg.recommendedProductCodes && msg.recommendedProductCodes.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
                      <span>قطعات پیشنهادی کاتالوگ:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.recommendedProductCodes.map(code => {
                        const item = CATALOGUE_ITEMS.find(c => c.code === code || c.forzaCode === code);
                        if (!item) return null;
                        return (
                          <div
                            key={item.code}
                            onClick={() => onSelectProductCode(item.code)}
                            className="p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 cursor-pointer transition flex items-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                              <img
                                src={STORE_ASSETS.products.forzaBelt || STORE_ASSETS.categories.belts}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="overflow-hidden flex-1">
                              <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                              <div className="text-[10px] text-orange-600 font-mono">{item.forzaCode}</div>
                              <div className="text-[11px] text-slate-600 font-semibold">{formatToman(item.retailPrice)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Message Actions */}
                <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                  <span>{new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>

                  {!isUser && (
                    <div className="flex items-center gap-3">
                      {/* Persian TTS voice readout */}
                      <button
                        onClick={() => onPlayAudio(msg.id, msg.audioBase64)}
                        className={`flex items-center gap-1 hover:text-orange-600 transition ${
                          isPlayingAudioId === msg.id ? 'text-orange-600 font-bold' : ''
                        }`}
                        title="شنیدن روخوانی فارسی"
                      >
                        {isPlayingAudioId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                            <span>توقف</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>روخوانی</span>
                          </>
                        )}
                      </button>

                      {/* Copy Text */}
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                        className="hover:text-slate-700 transition"
                        title="کپی متن"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* FLOATING BOTTOM INPUT DOCK                                          */}
      {/* ------------------------------------------------------------------- */}
      <div className="max-w-4xl w-full mx-auto pt-3 shrink-0">
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-lg p-3 text-right">
          <div className="flex items-center gap-2">
            <textarea
              value={inputText}
              onChange={e => onChangeInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="از FORZA بپرسید..."
              className="w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 text-sm focus:outline-none resize-none leading-relaxed"
            />

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onAttachFileClick}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="ضمیمه فایل"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onAttachImageClick}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="ارسال عکس قطعه"
              >
                <Camera className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onToggleVoice}
                className={`p-1.5 rounded-lg transition ${
                  isRecordingVoice ? 'bg-rose-50 text-rose-600 animate-pulse' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="ورودی صوتی"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Up Arrow Send button */}
              <button
                type="button"
                onClick={onSendMessage}
                disabled={isAiGenerating || !inputText.trim()}
                className="w-8 h-8 rounded-full bg-[#181F2A] hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition shadow-2xs shrink-0"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
