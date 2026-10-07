import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronLeft,
  RotateCcw,
  ExternalLink,
  Layers,
  Cpu,
} from 'lucide-react';
import { renderEngineeringMarkdown } from '../../../utils/engineeringMarkdown';
import { CATALOGUE_ITEMS } from '../../../data/catalogueProducts';
import { STORE_ASSETS } from '../../../assets/images';
import { WorkspaceMessage } from '../ForzaAiWorkspace';

interface ForzaMessageThreadProps {
  messages: WorkspaceMessage[];
  isPlayingAudioId: string | null;
  onPlayAudio: (msgId: string, audioBase64?: string) => void;
  onSelectProduct: (productCode: string) => void;
  onRetryLast: () => void;
}

function formatToman(amount?: number): string {
  if (!amount) return 'استعلامی';
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}

export const ForzaMessageThread: React.FC<ForzaMessageThreadProps> = ({
  messages,
  isPlayingAudioId,
  onPlayAudio,
  onSelectProduct,
  onRetryLast,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 select-none">
      {messages.map(msg => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {/* AI Avatar */}
            {!isUser && (
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20 text-xs font-black mt-1">
                FZ
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`space-y-3 max-w-[90%] sm:max-w-[80%] ${
                isUser
                  ? 'bg-[#1E293B] text-white rounded-3xl rounded-tr-md p-4 shadow-sm'
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-3xl rounded-tl-md p-5 shadow-sm'
              }`}
            >
              {/* Attached Image Thumbnail */}
              {msg.attachedImage && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-56 mb-2">
                  <img src={msg.attachedImage} alt="قطعه ارسالی" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Attached Document Pill */}
              {msg.attachedFile && (
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 mb-2">
                  <Layers className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-medium truncate">{msg.attachedFile.name}</span>
                  <span className="text-[10px] text-slate-400">({msg.attachedFile.size})</span>
                </div>
              )}

              {/* Reasoning / Standard Audit Badges */}
              {!isUser && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                <div className="pb-3 border-b border-slate-100">
                  <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>مراحل تحلیل و تطبیق استاندارد:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.reasoningSteps.map((step, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg"
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Text Content */}
              <div className="text-xs sm:text-[13px] leading-relaxed break-words font-normal">
                {isUser ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : msg.isStreaming && !msg.content ? (
                  <div className="flex items-center gap-2 text-slate-500 py-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    <span>در حال فراخوانی کاتالوگ و استعلام انبار مرکزی...</span>
                  </div>
                ) : (
                  renderEngineeringMarkdown(msg.content, false)
                )}
              </div>

              {/* Embedded Product Cards */}
              {!isUser && msg.recommendedProductCodes && msg.recommendedProductCodes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
                    <span>قطعات منطبق در انبار مرکزی اطلس:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.recommendedProductCodes.map(code => {
                      const item = CATALOGUE_ITEMS.find(c => c.code === code || c.forzaCode === code);
                      if (!item) return null;
                      return (
                        <div
                          key={item.code}
                          onClick={() => onSelectProduct(item.code)}
                          className="p-2.5 rounded-2xl bg-slate-50/80 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 cursor-pointer transition flex items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <img
                              src={STORE_ASSETS.products.forzaBelt || STORE_ASSETS.categories.belts}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="overflow-hidden flex-1">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-orange-600 font-mono font-bold mt-0.5">{item.forzaCode}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{formatToman(item.retailPrice)}</div>
                          </div>
                          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Message Bottom Action Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span>{new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>

                {!isUser && (
                  <div className="flex items-center gap-3">
                    {/* TTS Voice Readout */}
                    <button
                      onClick={() => onPlayAudio(msg.id, msg.audioBase64)}
                      className={`flex items-center gap-1 transition ${
                        isPlayingAudioId === msg.id ? 'text-orange-600 font-bold' : 'hover:text-slate-700'
                      }`}
                      title="شنیدن صوتی پاسخ (فارسی روان)"
                    >
                      {isPlayingAudioId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                          <span>توقف</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>روخوانی</span>
                        </>
                      )}
                    </button>

                    {/* Copy text */}
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.content)}
                      className="hover:text-slate-700 transition"
                      title="کپی پاسخ"
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
    </div>
  );
};
