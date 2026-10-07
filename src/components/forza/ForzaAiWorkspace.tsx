import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getOfficialCatalogueProducts, CATALOGUE_ITEMS } from '../../data/catalogueProducts';
import { Product } from '../../types';
import { STORE_ASSETS } from '../../assets/images';
import { AiForzaCallExperience } from './AiForzaCallExperience';

// Modular Workspace Components
import { ForzaIconRail } from './workspace/ForzaIconRail';
import { ForzaTopNav } from './workspace/ForzaTopNav';
import { ForzaWelcomeHero } from './workspace/ForzaWelcomeHero';
import { ForzaPromptBox } from './workspace/ForzaPromptBox';
import { ForzaMessageThread } from './workspace/ForzaMessageThread';
import { ForzaHistoryDrawer } from './workspace/ForzaHistoryDrawer';
import { ForzaToolsDrawer } from './workspace/ForzaToolsDrawer';
import { ForzaProductContextDrawer } from './workspace/ForzaProductContextDrawer';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export interface WorkspaceMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isPinned?: boolean;
  attachedImage?: string;
  attachedFile?: { name: string; size: string; type: string };
  reasoningSteps?: string[];
  recommendedProductCodes?: string[];
  audioBase64?: string;
  isStreaming?: boolean;
}

export interface WorkspaceSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
  messages: WorkspaceMessage[];
  activeProductCode?: string;
}

export const ForzaAiWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Master product database
  const catalogProducts = useMemo(() => getOfficialCatalogueProducts(), []);

  // ---------------------------------------------------------------------------
  // Workspace State
  // ---------------------------------------------------------------------------
  const [sessions, setSessions] = useState<WorkspaceSession[]>(() => {
    try {
      const saved = localStorage.getItem('forza_ai_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not load saved sessions', e);
    }
    return [
      {
        id: 'session-default-1',
        title: 'مشاوره فنی خطوط صنعتی و انتقال قدرت',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || 'session-default-1');
  const [selectedModel, setSelectedModel] = useState<string>('forza-3.8-industrial');
  const [activeRailTab, setActiveRailTab] = useState<string>('chat');

  // Input & Message states
  const [inputText, setInputText] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [attachedImagePreview, setAttachedImagePreview] = useState<string | null>(null);
  const [attachedFileMeta, setAttachedFileMeta] = useState<{ name: string; size: string; type: string } | null>(null);
  const [analysisStyle, setAnalysisStyle] = useState<'deep' | 'fast' | 'formula'>('deep');
  const [isCitationEnabled, setIsCitationEnabled] = useState(true);

  // Drawers & Modals
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isToolsDrawerOpen, setIsToolsDrawerOpen] = useState(false);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isLiveForzaOpen, setIsLiveForzaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Product for Drawer
  const [selectedProductCode, setSelectedProductCode] = useState<string>('1000-0-1');

  // Audio / Persian TTS
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Active session
  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  // Selected Product for Context Drawer
  const selectedProduct = useMemo(() => {
    const found = catalogProducts.find(p => p.code === selectedProductCode || p.forzaCode === selectedProductCode);
    if (found) return found;
    const catItem = CATALOGUE_ITEMS.find(c => c.code === selectedProductCode || c.forzaCode === selectedProductCode);
    if (catItem) {
      return {
        code: catItem.code,
        name: catItem.name,
        nameEn: catItem.nameEn,
        brand: catItem.brand,
        categorySlug: catItem.categorySlug,
        categoryName: catItem.categoryName,
        subcategory: catItem.subcategory,
        technicalSpecs: catItem.specs,
        prices: {
          base: catItem.basePrice,
          retail: catItem.retailPrice,
          wholesale: catItem.wholesalePrice,
          dealer: catItem.dealerPrice,
        },
        stock: catItem.stock,
        inquiryOnly: catItem.inquiryOnly,
        images: [STORE_ASSETS.products.forzaBelt || ''],
        tags: catItem.tags || [],
        unit: catItem.unit,
        description: catItem.description,
        forzaCode: catItem.forzaCode,
      } as Product;
    }
    return catalogProducts[0] || null;
  }, [catalogProducts, selectedProductCode]);

  const similarProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return catalogProducts
      .filter(p => p.code !== selectedProduct.code && p.categorySlug === selectedProduct.categorySlug)
      .slice(0, 3);
  }, [catalogProducts, selectedProduct]);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('forza_ai_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save sessions to localStorage', e);
    }
  }, [sessions]);

  // Handle URL query parameters
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('query');
    const p = searchParams.get('product') || searchParams.get('code');
    if (p) {
      setSelectedProductCode(p);
      setIsProductDrawerOpen(true);
    }
    if (q) {
      setInputText(q);
    }
  }, [searchParams]);

  // Scroll to bottom
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeSessionId]);

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------
  const handleSelectRailTab = (tab: string) => {
    setActiveRailTab(tab);
    if (tab === 'history') setIsHistoryDrawerOpen(true);
    if (tab === 'tools') setIsToolsDrawerOpen(true);
    if (tab === 'products') {
      setIsProductDrawerOpen(true);
    }
    if (tab === 'files') {
      setIsHistoryDrawerOpen(true);
    }
  };

  const handleCreateNewThread = () => {
    const newId = `session-${Date.now()}`;
    const newSession: WorkspaceSession = {
      id: newId,
      title: 'گفتگوی فنی جدید',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setInputText('');
    setAttachedImagePreview(null);
    setAttachedFileMeta(null);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const remaining = sessions.filter(s => s.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleTogglePinSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  // ---------------------------------------------------------------------------
  // Send Message
  // ---------------------------------------------------------------------------
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query && !attachedImagePreview && !attachedFileMeta) return;

    const userMessageId = `u-${Date.now()}`;
    const aiMessageId = `ai-${Date.now() + 1}`;

    const newUserMessage: WorkspaceMessage = {
      id: userMessageId,
      role: 'user',
      content: query || 'بررسی تصویر/فایل ضمیمه‌شده',
      timestamp: Date.now(),
      attachedImage: attachedImagePreview || undefined,
      attachedFile: attachedFileMeta || undefined,
    };

    let updatedTitle = activeSession.title;
    if (activeSession.messages.length === 0 && query) {
      updatedTitle = query.slice(0, 32) + (query.length > 32 ? '...' : '');
    }

    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: updatedTitle,
            updatedAt: Date.now(),
            messages: [...s.messages, newUserMessage],
          };
        }
        return s;
      })
    );

    setInputText('');
    const tempImage = attachedImagePreview;
    const tempFile = attachedFileMeta;
    setAttachedImagePreview(null);
    setAttachedFileMeta(null);
    setIsAiGenerating(true);
    setTimeout(() => scrollToBottom(true), 50);

    const placeholderAiMessage: WorkspaceMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
      reasoningSteps: [
        'دریافت ورودی و پردازش پارامترهای صنعتی',
        'تطبیق با کاتالوگ رسمی ۱۴۰۴ بازرگانی اطلس',
        'استعلام آنلاین موجودی انبار مرکزی تهران',
      ],
    };

    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, placeholderAiMessage],
          };
        }
        return s;
      })
    );

    try {
      // 1. If image was attached, call part analysis
      let matchedCode: string | undefined;
      if (tempImage) {
        try {
          const imgRes = await fetch('/api/ai/analyze-part', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: tempImage.replace(/^data:image\/\w+;base64,/, ''),
              mimeType: 'image/jpeg',
              application: query,
              stage: 'quick',
            }),
          });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            if (imgData.matchedProduct?.code) {
              matchedCode = String(imgData.matchedProduct.code);
              setSelectedProductCode(matchedCode);
            }
          }
        } catch (e) {
          console.warn('Image analysis error', e);
        }
      }

      // 2. Call AI Consult Endpoint
      const historyPayload = activeSession.messages
        .filter(m => m.role !== 'system')
        .slice(-6)
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.content,
        }));

      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query + (tempFile ? ` (فایل ضمیمه: ${tempFile.name})` : ''),
          history: historyPayload,
          includeSpeech: false,
        }),
      });

      if (!res.ok) throw new Error('Failed to consult AI');

      const data = await res.json();
      const aiReplyText = data.reply || 'توصیه فنی: با توجه به استانداردهای صنعتی و مشخصات کاربری، استفاده از قطعات اورجینال با مقاومت کششی و حرارتی بالا توصیه می‌شود.';

      const recommendedCodes: string[] = [];
      CATALOGUE_ITEMS.forEach(item => {
        if (aiReplyText.includes(item.code) || aiReplyText.includes(item.forzaCode) || (item.nameEn && aiReplyText.includes(item.nameEn))) {
          if (!recommendedCodes.includes(item.code)) recommendedCodes.push(item.code);
        }
      });
      if (matchedCode && !recommendedCodes.includes(matchedCode)) {
        recommendedCodes.unshift(matchedCode);
      }
      if (recommendedCodes.length === 0) {
        recommendedCodes.push('1000-0-1', '1000-0-2');
      }

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.map(m =>
                m.id === aiMessageId
                  ? {
                      ...m,
                      content: aiReplyText,
                      isStreaming: false,
                      audioBase64: data.audioBase64,
                      recommendedProductCodes: recommendedCodes,
                      reasoningSteps: [
                        'تحلیل شرایط کاری و تنش‌های مکانیکی',
                        'بررسی استانداردهای ISO 1813 و DIN 2215',
                        'استعلام موجودی قطعات منطبق در انبار مرکزی',
                      ],
                    }
                  : m
              ),
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error('AI consultation failed', err);
      const fallbackText = `### پاسخ کارشناسی فورزا (FORZA Industrial AI)

با بررسی پرسش شما، پارامترهای کلیدی زیر در محاسبات انتقال قدرت و انبار مرکزی اولویت دارند:

1. **طول و گام استاندارد**: مطابق استاندارد **DIN 2215 / ISO 4184**، تسمه یا بیرینگ باید متناسب با دور کاری و گشتاور موتور انتخاب شود.
2. **لقی شعاعی (Internal Clearance)**: برای دورهای بالاتر از ۱۴۰۰ RPM، استفاده از کلاس **C3** جهت جلوگیری از گیرپاژ حرارتی الزامی است.
3. **موجودی انبار مرکزی**: قطعات مرتبط با برند **FORZA** در انبار مرکزی موجود و با ضمانت اصالت فیزیکی آماده ارسال است.`;

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.map(m =>
                m.id === aiMessageId
                  ? {
                      ...m,
                      content: fallbackText,
                      isStreaming: false,
                      recommendedProductCodes: ['1000-0-1'],
                    }
                  : m
              ),
            };
          }
          return s;
        })
      );
    } finally {
      setIsAiGenerating(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  // ---------------------------------------------------------------------------
  // Persian TTS Audio Playback
  // ---------------------------------------------------------------------------
  const handlePlayAudio = async (msgId: string, audioBase64?: string) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    if (isPlayingAudioId === msgId) {
      setIsPlayingAudioId(null);
      return;
    }

    try {
      let base64 = audioBase64;
      if (!base64) {
        const msg = activeSession.messages.find(m => m.id === msgId);
        if (!msg) return;

        const res = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: msg.content.slice(0, 350) }),
        });
        if (res.ok) {
          const ttsData = await res.json();
          base64 = ttsData.audioBase64;
        }
      }

      if (base64) {
        const audio = new Audio(`data:audio/mp3;base64,${base64}`);
        currentAudioRef.current = audio;
        setIsPlayingAudioId(msgId);
        audio.play();
        audio.onended = () => {
          setIsPlayingAudioId(null);
          currentAudioRef.current = null;
        };
        audio.onerror = () => {
          setIsPlayingAudioId(null);
          currentAudioRef.current = null;
        };
      }
    } catch (err) {
      console.warn('TTS playback error', err);
      setIsPlayingAudioId(null);
    }
  };

  // File & Image Attachments
  const handleSelectDocFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setAttachedFileMeta({
      name: file.name,
      size: sizeStr,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
    });
  };

  const handleSelectImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Voice recording toggle
  const handleToggleVoice = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('مرورگر شما از ورودی صوتی پشتیبانی نمی‌کند. می‌توانید مستقیماً تایپ فرمایید.');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'fa-IR';
      rec.interimResults = true;
      rec.continuous = false;

      setIsRecordingVoice(true);

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText(transcript);
        }
      };

      rec.onerror = () => setIsRecordingVoice(false);
      rec.onend = () => setIsRecordingVoice(false);
      rec.start();
    } catch (err) {
      console.warn('Speech recognition start error', err);
      setIsRecordingVoice(false);
    }
  };

  const isThreadEmpty = activeSession.messages.length === 0;

  return (
    <div
      className="relative w-screen h-screen min-h-[100svh] max-h-[100dvh] overflow-hidden bg-[#F8F9FB] text-slate-800 font-sans flex select-none"
      dir="rtl"
    >
      {/* 1. Left Vertical Icon Rail (Dock) */}
      <ForzaIconRail
        activeTab={activeRailTab}
        onSelectTab={handleSelectRailTab}
        onOpenLive={() => setIsLiveForzaOpen(true)}
        onReturnToStore={() => navigate('/')}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar with Model Dropdown & Actions */}
        <ForzaTopNav
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onOpenSearch={() => setIsHistoryDrawerOpen(true)}
          onShareThread={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('لینک استعلام و گفتگوی مهندسی کپی شد.');
            }
          }}
          onNewThread={handleCreateNewThread}
        />

        {/* Scrollable Center Area (Welcome Hero or Active Message Thread) */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">
            {isThreadEmpty ? (
              <ForzaWelcomeHero onSelectPrompt={prompt => handleSendMessage(prompt)} />
            ) : (
              <ForzaMessageThread
                messages={activeSession.messages}
                isPlayingAudioId={isPlayingAudioId}
                onPlayAudio={handlePlayAudio}
                onSelectProduct={code => {
                  setSelectedProductCode(code);
                  setIsProductDrawerOpen(true);
                }}
                onRetryLast={() => {
                  const lastUserMsg = [...activeSession.messages].reverse().find(m => m.role === 'user');
                  if (lastUserMsg) handleSendMessage(lastUserMsg.content);
                }}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Floating Elevated Command Center Input Box */}
          <div className="py-4 bg-gradient-to-t from-[#F8F9FB] via-[#F8F9FB]/90 to-transparent shrink-0">
            <ForzaPromptBox
              inputText={inputText}
              onChangeInput={setInputText}
              onSubmit={() => handleSendMessage()}
              isGenerating={isAiGenerating}
              attachedImagePreview={attachedImagePreview}
              attachedFileMeta={attachedFileMeta}
              onClearImage={() => setAttachedImagePreview(null)}
              onClearFile={() => setAttachedFileMeta(null)}
              onSelectImageFile={handleSelectImageFile}
              onSelectDocFile={handleSelectDocFile}
              isRecordingVoice={isRecordingVoice}
              onToggleVoice={handleToggleVoice}
              analysisStyle={analysisStyle}
              onChangeAnalysisStyle={setAnalysisStyle}
              isCitationEnabled={isCitationEnabled}
              onToggleCitation={() => setIsCitationEnabled(prev => !prev)}
            />
          </div>
        </div>
      </div>

      {/* 3. Slide-in Drawers (Connected to Site & Database) */}
      <ForzaHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleCreateNewThread}
        onTogglePinSession={handleTogglePinSession}
        onDeleteSession={handleDeleteSession}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
      />

      <ForzaToolsDrawer
        isOpen={isToolsDrawerOpen}
        onClose={() => setIsToolsDrawerOpen(false)}
        onSendCalcToChat={prompt => handleSendMessage(prompt)}
      />

      <ForzaProductContextDrawer
        isOpen={isProductDrawerOpen}
        onClose={() => setIsProductDrawerOpen(false)}
        product={selectedProduct}
        similarProducts={similarProducts}
        onSelectSimilar={code => setSelectedProductCode(code)}
      />

      {/* 4. FORZA Live 3D Experience Modal */}
      {isLiveForzaOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={() => setIsLiveForzaOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
            >
              <X className="w-4 h-4" />
              <span>بازگشت به میزکار</span>
            </button>
          </div>
          <div className="flex-1 w-full h-full">
            <AiForzaCallExperience onClose={() => setIsLiveForzaOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
