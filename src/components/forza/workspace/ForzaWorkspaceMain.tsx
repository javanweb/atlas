import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, ComparisonData } from '../../../types/forzaWorkspace';
import { Product } from '../../../types';
import { forzaWorkspaceService } from '../../../services/forzaWorkspaceService';
import { ForzaWorkspaceSidebar } from './ForzaWorkspaceSidebar';
import { ForzaWorkspaceHeader } from './ForzaWorkspaceHeader';
import { ForzaWorkspaceEmptyState } from './ForzaWorkspaceEmptyState';
import { ForzaMessageList } from './ForzaMessageList';
import { ForzaProductComparisonModal } from './ForzaProductComparisonModal';
import { ForzaRfqModal } from './ForzaRfqModal';
import { ForzaFaceToFaceOverlay } from './ForzaFaceToFaceOverlay';
import {
  Camera,
  Paperclip,
  Mic,
  Video,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Search,
  MessageSquare,
  Package,
  FileText,
  User,
  Home,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const ForzaWorkspaceMain: React.FC = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  // Modals & Overlays state
  const [isFaceToFaceOpen, setIsFaceToFaceOpen] = useState(false);
  const [comparisonModalData, setComparisonModalData] = useState<ComparisonData | null>(null);
  const [rfqModalProduct, setRfqModalProduct] = useState<Product | null>(null);

  // Active chat input state
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    refreshConversations();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (activeConversation?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages, isThinking]);

  const refreshConversations = () => {
    const list = forzaWorkspaceService.getConversations();
    setConversations(list);
    const active = forzaWorkspaceService.getActiveConversation();
    setActiveConversation(active);
  };

  const handleSelectConversation = (id: string) => {
    const selected = forzaWorkspaceService.setActiveConversation(id);
    setActiveConversation(selected);
  };

  const handleNewConversation = () => {
    const newConv = forzaWorkspaceService.createConversation();
    refreshConversations();
    setActiveConversation(newConv);
  };

  const handleTogglePin = (id: string) => {
    forzaWorkspaceService.togglePin(id);
    refreshConversations();
  };

  const handleRename = (id: string, newTitle: string) => {
    forzaWorkspaceService.renameConversation(id, newTitle);
    refreshConversations();
  };

  const handleDelete = (id: string) => {
    forzaWorkspaceService.deleteConversation(id);
    refreshConversations();
  };

  // Main Message Sending Flow
  const handleSendMessage = async (text: string, files: File[] = []) => {
    if (!text.trim() && files.length === 0) return;

    let conv = activeConversation;
    if (!conv) {
      conv = forzaWorkspaceService.createConversation();
      setActiveConversation(conv);
    }

    const currentConvId = conv.id;

    // 1. Add User Message
    const hasImage = files.some((f) => f.type.startsWith('image/'));
    const attachments = files.map((f, i) => ({
      id: 'att-' + Date.now() + '-' + i,
      type: (f.type.startsWith('image/') ? 'image' : 'file') as 'image' | 'file',
      name: f.name,
      url: URL.createObjectURL(f),
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));

    forzaWorkspaceService.addMessage(currentConvId, {
      sender: 'user',
      type: hasImage ? 'IMAGE' : files.length > 0 ? 'FILE' : 'TEXT',
      content: text,
      attachments,
    });

    refreshConversations();
    setIsThinking(true);

    // 2. Process AI Response
    try {
      if (hasImage) {
        const imageUrl = attachments.find((a) => a.type === 'image')?.url || '';
        const { identification, products, aiText } = await forzaWorkspaceService.analyzeImageAndMatch(
          currentConvId,
          imageUrl,
          text
        );

        forzaWorkspaceService.addMessage(currentConvId, {
          sender: 'assistant',
          type: 'PRODUCT_IDENTIFICATION',
          content: aiText,
          identificationResult: identification,
          products,
        });
      } else {
        const result = await forzaWorkspaceService.processUserQuery(currentConvId, text);
        forzaWorkspaceService.addMessage(currentConvId, {
          sender: 'assistant',
          type: result.responseType,
          content: result.content,
          products: result.products,
          comparisonData: result.comparisonData,
          rfqData: result.rfqData,
        });
      }
    } catch (err) {
      console.error('Error processing query:', err);
      forzaWorkspaceService.addMessage(currentConvId, {
        sender: 'assistant',
        type: 'AI_RESPONSE',
        content: 'متاسفانه در پردازش خطایی رخ داد، لطفاً مجدداً امتحان کنید.',
      });
    } finally {
      setIsThinking(false);
      refreshConversations();
    }
  };

  // Face-to-Face Session Integration into Conversation
  const handleFaceToFaceComplete = (sessionData: {
    capturedImage?: string;
    transcript: string;
    identifiedProducts: Product[];
    durationSeconds: number;
  }) => {
    let conv = activeConversation;
    if (!conv) {
      conv = forzaWorkspaceService.createConversation('جلسه تصویری Face-to-Face');
      setActiveConversation(conv);
    }

    const convId = conv.id;

    // Add Voice / Snapshot from Face-to-Face
    forzaWorkspaceService.addMessage(convId, {
      sender: 'user',
      type: 'VOICE',
      content: sessionData.transcript,
      voiceData: {
        duration: sessionData.durationSeconds,
        transcript: sessionData.transcript,
      },
      attachments: sessionData.capturedImage
        ? [
            {
              id: 'f2f-snap-' + Date.now(),
              type: 'image',
              name: 'face-to-face-snapshot.jpg',
              url: sessionData.capturedImage,
            },
          ]
        : [],
    });

    // Add AI Finding & Products
    forzaWorkspaceService.addMessage(convId, {
      sender: 'assistant',
      type: 'PRODUCT_RESULT',
      content: `خلاصه جلسه Face-to-Face:\n\nقطعه مورد نظر با موفقیت در جریان مکالمه تصویری ارزیابی شد. محصولات منطبق در انبار مرکزی FORZA به این شرح هستند:`,
      products: sessionData.identifiedProducts,
    });

    // Add System Milestone
    forzaWorkspaceService.addMessage(convId, {
      sender: 'system',
      type: 'SYSTEM_ACTION',
      content: `جلسه Face-to-Face به مدت ${sessionData.durationSeconds} ثانیه با موفقیت در تاریخچه مکالمه ثبت گردید.`,
    });

    refreshConversations();
  };

  // Submit RFQ from modal
  const handleRfqSubmit = (product: Product, quantity: number, notes: string) => {
    if (!activeConversation) return;
    forzaWorkspaceService.createRfqForProduct(activeConversation.id, product, quantity);
    refreshConversations();
  };

  const hasMessages = activeConversation && activeConversation.messages && activeConversation.messages.length > 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white antialiased">
      
      {/* 1. DESKTOP/TABLET MINIMAL SIDEBAR + HISTORY */}
      <div className="hidden md:flex h-full shrink-0">
        <ForzaWorkspaceSidebar
          conversations={conversations}
          activeConversationId={activeConversation?.id || null}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onTogglePin={handleTogglePin}
          onRenameConversation={handleRename}
          onDeleteConversation={handleDelete}
          isHistoryOpen={isHistoryOpen}
          onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        />
      </div>

      {/* 2. MAIN WORKSPACE VIEWPORT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
        
        {/* Workspace Top Header */}
        <ForzaWorkspaceHeader
          conversation={activeConversation}
          onNewConversation={handleNewConversation}
          onOpenFaceToFace={() => setIsFaceToFaceOpen(true)}
        />

        {/* Content Body: Empty State OR Message Stream */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {!hasMessages ? (
            <ForzaWorkspaceEmptyState
              onSendMessage={handleSendMessage}
              onOpenFaceToFace={() => setIsFaceToFaceOpen(true)}
              onTriggerImageSearch={() => imageInputRef.current?.click()}
              onTriggerFileAnalysis={() => fileInputRef.current?.click()}
              onTriggerVoice={() => setIsFaceToFaceOpen(true)}
            />
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Message List */}
              <ForzaMessageList
                messages={activeConversation.messages}
                isThinking={isThinking}
                onCompareProducts={(prod) => {
                  setComparisonModalData({
                    title: `مقایسه ${prod.name} با سایر مدل‌ها`,
                    productCodes: [prod.code],
                    products: [prod, ...conversations[0]?.messages[1]?.products || []].slice(0, 2),
                    comparisonPoints: [
                      { feature: 'کلاس کاری', values: { [prod.code]: 'استاندارد صنعتی DIN' } },
                      { feature: 'گارانتی', values: { [prod.code]: '۲۴ ماه ضمانت اطلس' } },
                    ],
                  });
                }}
                onRequestQuote={(prod) => setRfqModalProduct(prod)}
                onOpenComparisonModal={(data) => setComparisonModalData(data)}
              />

              <div ref={messagesEndRef} />

              {/* Bottom Sticky Input Bar for Active Chat */}
              <div className="p-4 sm:p-6 border-t border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shrink-0">
                <div className="max-w-4xl mx-auto">
                  {/* File Chips */}
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {attachedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 border"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#E06518]" />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-500 font-bold ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) setAttachedFiles((p) => [...p, ...Array.from(e.target.files!)]);
                      }}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) setAttachedFiles((p) => [...p, ...Array.from(e.target.files!)]);
                      }}
                    />

                    {/* Left Icon Buttons */}
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="p-2 rounded-xl text-slate-500 hover:text-[#E06518] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="ارسال تصویر قطعه"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl text-slate-500 hover:text-[#E06518] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="آپلود فایل کاتالوگ"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFaceToFaceOpen(true)}
                      className="p-2 rounded-xl text-slate-500 hover:text-[#E06518] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="مکالمه ویدیویی Face-to-Face"
                    >
                      <Video className="w-4 h-4" />
                    </button>

                    {/* Main Input Text */}
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage(inputText, attachedFiles);
                          setInputText('');
                          setAttachedFiles([]);
                        }
                      }}
                      placeholder="پیام خود را بنویسید یا سوال فنی بپرسید..."
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden text-right"
                    />

                    {/* Send Button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleSendMessage(inputText, attachedFiles);
                        setInputText('');
                        setAttachedFiles([]);
                      }}
                      disabled={!inputText.trim() && attachedFiles.length === 0}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#C95210] to-[#E06518] text-white disabled:opacity-40 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. MOBILE BOTTOM NAVIGATION (Matches requirement) */}
        <div className="md:hidden h-14 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 z-30 shrink-0">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-slate-500 text-[10px]">
            <Home className="w-4 h-4" />
            <span>خانه</span>
          </Link>
          <button
            type="button"
            onClick={handleNewConversation}
            className="flex flex-col items-center gap-0.5 text-[#E06518] font-bold text-[10px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>گفتگوها</span>
          </button>
          <Link to="/products" className="flex flex-col items-center gap-0.5 text-slate-500 text-[10px]">
            <Package className="w-4 h-4" />
            <span>محصولات</span>
          </Link>
          <Link to="/account/rfq" className="flex flex-col items-center gap-0.5 text-slate-500 text-[10px]">
            <FileText className="w-4 h-4" />
            <span>درخواست‌ها</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsFaceToFaceOpen(true)}
            className="flex flex-col items-center gap-0.5 text-purple-500 text-[10px]"
          >
            <Video className="w-4 h-4" />
            <span>Face-to-Face</span>
          </button>
        </div>

      </div>

      {/* 4. OVERLAYS & MODALS */}
      {/* Face-to-Face Immersive Overlay */}
      <ForzaFaceToFaceOverlay
        isOpen={isFaceToFaceOpen}
        onClose={() => setIsFaceToFaceOpen(false)}
        onSessionComplete={handleFaceToFaceComplete}
        catalogProducts={forzaWorkspaceService.getConversations()[0]?.messages[1]?.products || []}
      />

      {/* Comparison Modal */}
      <ForzaProductComparisonModal
        comparisonData={comparisonModalData}
        onClose={() => setComparisonModalData(null)}
        onRequestQuote={(prod) => setRfqModalProduct(prod)}
      />

      {/* RFQ Creation Modal */}
      <ForzaRfqModal
        product={rfqModalProduct}
        onClose={() => setRfqModalProduct(null)}
        onSubmit={handleRfqSubmit}
      />

    </div>
  );
};
