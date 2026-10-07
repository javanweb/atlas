import React from 'react';
import { Message } from '../../../types/forzaWorkspace';
import { Product } from '../../../types';
import { ForzaProductCard } from './ForzaProductCard';
import {
  User,
  Bot,
  Sparkles,
  CheckCircle2,
  Scan,
  Scale,
  FileText,
  Volume2,
  Image as ImageIcon,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface ForzaMessageListProps {
  messages: Message[];
  isThinking: boolean;
  onCompareProducts?: (product: Product) => void;
  onRequestQuote?: (product: Product) => void;
  onOpenComparisonModal?: (data: any) => void;
}

export const ForzaMessageList: React.FC<ForzaMessageListProps> = ({
  messages,
  isThinking,
  onCompareProducts,
  onRequestQuote,
  onOpenComparisonModal,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-text text-right">
      {messages.map((message) => {
        const isUser = message.sender === 'user';
        const isSystem = message.sender === 'system';

        if (isSystem) {
          return (
            <div key={message.id} className="flex justify-center my-3">
              <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Clock className="w-3 h-3 text-[#E06518]" />
                <span>{message.content}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={`flex items-start gap-3.5 max-w-3xl ${
              isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'
            } animate-in fade-in duration-300`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-2xl shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                isUser
                  ? 'bg-slate-900 dark:bg-slate-700 text-white'
                  : 'bg-gradient-to-tr from-[#C95210] to-[#E06518] text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Message Bubble Container */}
            <div className={`space-y-3 flex-1 min-w-0 ${isUser ? 'text-left' : 'text-right'}`}>
              
              {/* User Attachments (Images or Files) */}
              {message.attachments && message.attachments.length > 0 && (
                <div className={`flex flex-wrap gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {message.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm max-w-xs"
                    >
                      {att.type === 'image' ? (
                        <div className="relative group">
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-full max-h-64 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <span>مشاهده تصویر اصلی</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-[#E06518]" />
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[160px]">
                              {att.name}
                            </div>
                            <div className="text-[10px] text-slate-400">{att.size || 'فایل ضمیمه'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Voice Message Player (if Voice note) */}
              {message.voiceData && (
                <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#E06518] text-xs font-bold">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>پیام صوتی Face-to-Face ({message.voiceData.duration} ثانیه)</span>
                </div>
              )}

              {/* Text Bubble */}
              {message.content && (
                <div
                  className={`inline-block p-4 rounded-3xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tl-xs shadow-md text-right'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tr-xs shadow-sm text-right whitespace-pre-line'
                  }`}
                >
                  {message.content}
                </div>
              )}

              {/* PRODUCT IDENTIFICATION HUD CARD */}
              {message.identificationResult && (
                <div className="p-4 rounded-3xl bg-slate-900 text-white border border-orange-500/40 shadow-xl space-y-3 text-right">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Scan className="w-4 h-4 text-[#E06518]" />
                      <span className="text-xs font-black text-white">نتایج شناسایی تصویری قطعه</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                      ضریب اطمینان: {message.identificationResult.confidence}٪
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs text-slate-300">
                      <span className="font-bold text-[#E06518]">نوع و استاندارد: </span>
                      {message.identificationResult.partType}
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="font-bold text-[#E06518]">برند و مدل: </span>
                      {message.identificationResult.brand} ({message.identificationResult.model})
                    </div>
                  </div>

                  {/* Specs Pill List */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] font-bold text-slate-400">مشخصات قابل تشخیص:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {message.identificationResult.specs.map((sp, i) => (
                        <div
                          key={i}
                          className="text-[11px] bg-white/5 px-2.5 py-1 rounded-lg text-slate-200 border border-white/10 truncate"
                        >
                          • {sp}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EMBEDDED PRODUCT CARDS GRID */}
              {message.products && message.products.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                    <span>محصولات پیدا شده در کاتالوگ FORZA:</span>
                    <span className="text-[11px] font-mono">{message.products.length} محصول</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {message.products.map((prod) => (
                      <ForzaProductCard
                        key={prod.code}
                        product={prod}
                        onCompare={onCompareProducts}
                        onRequestQuote={onRequestQuote}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* EMBEDDED COMPARISON MATRIX */}
              {message.comparisonData && (
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3 text-right">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#E06518]" />
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {message.comparisonData.title}
                      </span>
                    </div>
                    {onOpenComparisonModal && (
                      <button
                        type="button"
                        onClick={() => onOpenComparisonModal(message.comparisonData)}
                        className="text-xs text-[#E06518] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>نمایش کامل</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {message.comparisonData.comparisonPoints.slice(0, 3).map((cp, idx) => (
                      <div key={idx} className="py-2 grid grid-cols-2 gap-2">
                        <span className="font-bold text-slate-500">{cp.feature}:</span>
                        <span className="text-slate-800 dark:text-slate-200 truncate">
                          {Object.values(cp.values).join(' / ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EMBEDDED RFQ QUOTE CARD */}
              {message.rfqData && (
                <div className="p-4 rounded-3xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 shadow-md space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E06518] text-white font-mono text-[10px] font-bold">
                      {message.rfqData.rfqNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تایید و صادر شد</span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-bold">کالا: </span>
                    {message.rfqData.productName} ({message.rfqData.quantity} عدد)
                  </div>

                  {message.rfqData.estimatedPrice && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-orange-500/20">
                      <span className="text-slate-500 font-medium">مبلغ تخمینی کل:</span>
                      <span className="text-sm font-black text-[#E06518] font-mono">
                        {new Intl.NumberFormat('fa-IR').format(message.rfqData.estimatedPrice)} تومان
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div className="text-[10px] font-mono text-slate-400 px-1">
                {new Date(message.timestamp).toLocaleTimeString('fa-IR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Thinking / Processing AI Indicator */}
      {isThinking && (
        <div className="flex items-start gap-3 max-w-md ml-auto animate-in fade-in">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#C95210] to-[#E06518] text-white flex items-center justify-center font-bold text-xs animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs shadow-sm flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#E06518] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#E06518] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#E06518] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-medium">FORZA در حال پردازش و استخراج مشخصات از کاتالوگ...</span>
          </div>
        </div>
      )}
    </div>
  );
};
