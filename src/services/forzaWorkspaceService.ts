import { Conversation, Message, IdentificationResult, RfqRecord, ComparisonData } from '../types/forzaWorkspace';
import { CATALOGUE_ITEMS } from '../data/catalogueProducts';
import { Product } from '../types';

const STORAGE_KEY = 'forza_ai_workspace_conversations_v2';
const ACTIVE_CONV_KEY = 'forza_ai_workspace_active_id';

// Convert CATALOGUE_ITEMS to Product format
function getCatalogProducts(): Product[] {
  return CATALOGUE_ITEMS.slice(0, 30).map((item) => ({
    code: item.code,
    name: item.name,
    nameEn: item.nameEn,
    brand: item.brand,
    categorySlug: item.categorySlug,
    categoryName: item.categoryName,
    subcategory: item.subcategory,
    technicalSpecs: item.specs,
    prices: {
      base: item.basePrice,
      retail: item.retailPrice,
      wholesale: item.wholesalePrice,
      dealer: item.dealerPrice,
    },
    stock: item.stock,
    inquiryOnly: item.inquiryOnly,
    unit: item.unit,
    description: item.description,
    images: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    ],
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    tags: item.tags,
    forzaCode: item.forzaCode,
    cataloguePage: item.cataloguePage,
  }));
}

// Initial realistic industrial conversations
const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    title: 'شناسایی و استعلام شیر صنعتی Ball Valve',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastMessage: 'پیش‌فاکتور رسمی و استعلام قیمت به همراه برگه سرتیفیکیت صادر شد.',
    messageCount: 5,
    status: 'active',
    isPinned: true,
    activeContext: {
      lastReferencedProductCode: '1000-0-1',
      identifiedCategory: 'industrial-valves',
      identifiedPartType: 'شیر صنعتی Ball Valve فولادی',
    },
    metadata: {
      tags: ['شیر صنعتی', 'استعلام قیمت', 'شناسایی با تصویر'],
      interactionMode: 'visual_search',
    },
    messages: [
      {
        id: 'msg-101-1',
        conversationId: 'conv-101',
        sender: 'user',
        type: 'IMAGE',
        content: 'سلام FORZA، این قطعه روی خط لعاب‌کاری کارخانه ترک خورده، میشه مدل فابریک و مشخصاتش رو پیدا کنی؟',
        attachments: [
          {
            id: 'att-1',
            type: 'image',
            name: 'industrial-ball-valve-damaged.jpg',
            url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
            size: '2.4 MB',
          },
        ],
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'msg-101-2',
        conversationId: 'conv-101',
        sender: 'assistant',
        type: 'PRODUCT_IDENTIFICATION',
        content:
          'بر اساس تحلیل چندوجهی تصویر ارسالی و دیتابیس کاتالوگ‌های صنعتی FORZA، قطعه مورد نظر با ضریب اطمینان ۹۴٪ شناسایی شد:\n\nاین قطعه یک **Ball Valve (شیر توپی صنعتی کلاس فشاری PN40)** با بدنه فولادی و استاندارد اتصال فلنجی DIN است که عموماً در خطوط انتقال دوغاب و مایعات پرفشار کاشی و سرامیک به کار می‌رود.',
        identificationResult: {
          partType: 'شیر توپی فولادی پرفشار (Heavy Duty Ball Valve)',
          brand: 'FORZA / SWR Heavy Ind.',
          model: 'BV-PN40-DN50 Flanged',
          confidence: 94,
          specs: [
            'سایز اتصال: DN50 (۲ اینچ فلنجی)',
            'کلاس فشاری: PN40 (۴۰ بار کاری)',
            'جنس بدنه: استنلس استیل ۳۱۶ / فولاد کربنی WCB',
            'دمای کاری: -۲۰ الی +۱۸۰ درجه سانتی‌گراد',
            'استاندارد تست: API 598 / EN 12266',
          ],
          visualFeatures: [
            'اهرم دستی با روکش عایق پلیمری',
            'سوراخ‌های پیچ فلنج ۸ عددی استاندارد DIN 2501',
            'آب‌بند تفلون PTFE تقویت شده با کربن',
          ],
          summary: 'قطعه فابریک استاندارد با قابلیت جایگزینی آنی در انبار مرکزی تهران و یزد موجود است.',
        },
        products: getCatalogProducts().slice(0, 3),
        timestamp: new Date(Date.now() - 3600000 * 3.8).toISOString(),
      },
      {
        id: 'msg-101-3',
        conversationId: 'conv-101',
        sender: 'user',
        type: 'TEXT',
        content: 'مشخصات فنی مدل اول رو دقیق بگو و بگو آیا برای خط لعاب حرارت بالا مناسبه؟',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'msg-101-4',
        conversationId: 'conv-101',
        sender: 'assistant',
        type: 'AI_RESPONSE',
        content:
          'بله مهندس گرامی، مدل **تسمه و اتصالات V-Belt هایپاور کلاسیک FORZA (کد 1000 0 1)** با آب‌بندهای تقویت شده کربن-تفلون کاملاً برای شرایط خطوط حرارتی و کوره مناسب است:\n\n۱. **تحمل حرارتی**: تا ۱۸۰+ درجه سانتی‌گراد مداوم\n۲. **مقاومت سایشی**: ضد سایش در برابر ذرات ساینده سیلیس و فلدسپات\n۳. **گارانتی اصالت**: دارای هولوگرام امنیتی و ضمانت‌نامه ۲۴ ماهه کتبی اطلس\n\nآیا مایلید استعلام قیمت رسمی (RFQ) با تخفیف همکاری برای شما ثبت شود؟',
        timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      },
      {
        id: 'msg-101-5',
        conversationId: 'conv-101',
        sender: 'assistant',
        type: 'RFQ',
        content: 'استعلام قیمت سریع برای ۴ عدد قطعه ثبت گردید.',
        rfqData: {
          rfqNumber: 'RFQ-88421-FZ',
          productCode: '1000-0-1',
          productName: 'شیر توپی و اتصالات خط لعاب فورزا مدل BV-PN40',
          quantity: 4,
          status: 'priced',
          estimatedPrice: 2240000,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          note: 'درخواست تحویل فوری در شهرک صنعتی جهان‌آباد میبد',
        },
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'conv-102',
    title: 'جایگزینی تسمه تایمینگ SWR و اپتی‌بلت',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    lastMessage: 'تسمه معادل اروپایی با مشخصات گام 8M و عرض 50mm پیشنهاد شد.',
    messageCount: 3,
    status: 'active',
    isPinned: false,
    activeContext: {
      lastReferencedProductCode: '1000-0-2',
      identifiedCategory: 'industrial-belts',
      identifiedPartType: 'تسمه تایمینگ صنعتی',
    },
    metadata: {
      tags: ['تسمه صنعتی', 'SWR', 'مقایسه فنی'],
      interactionMode: 'standard',
    },
    messages: [
      {
        id: 'msg-102-1',
        conversationId: 'conv-102',
        sender: 'user',
        type: 'TEXT',
        content: 'ما در خط پرس هیدرولیک تسمه 8M-1200 عرض 50 میلیمتر داریم. برند FORZA یا SWR چه گزینه‌ای پیشنهاد میده؟',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'msg-102-2',
        conversationId: 'conv-102',
        sender: 'assistant',
        type: 'PRODUCT_RESULT',
        content:
          'برای خطوط پرس با شوک بار ناگهانی، دو محصول تقویت شده با کورد آرامید (Kevlar) در کاتالوگ رسمی ۱۴۰۴ فورزا منطبق هستند:',
        products: getCatalogProducts().slice(1, 4),
        timestamp: new Date(Date.now() - 3600000 * 23.5).toISOString(),
      },
      {
        id: 'msg-102-3',
        conversationId: 'conv-102',
        sender: 'assistant',
        type: 'PRODUCT_COMPARISON',
        content: 'جدول مقایسه فنی و متالوژی بین دو مدل پیشنهادی FORZA:',
        comparisonData: {
          title: 'مقایسه تسمه تایمینگ FORZA تقویت شده در برابر مدل استاندارد',
          productCodes: ['1000-0-1', '1000-0-2'],
          products: getCatalogProducts().slice(0, 2),
          comparisonPoints: [
            {
              feature: 'کورد تقویت‌کننده داخلی',
              values: {
                '1000-0-1': 'پلی‌استر صنعتی های‌تنسایل',
                '1000-0-2': 'کولار آرامید ضد کشیدگی (Aramid Cord)',
              },
            },
            {
              feature: 'تحمل گشتاور و شوک ناگهانی',
              values: {
                '1000-0-1': 'تا ۲۵۰ نیوتن‌متر',
                '1000-0-2': 'تا ۴۸۰ نیوتن‌متر (ویژه پرس‌های سنگین)',
              },
            },
            {
              feature: 'مقاومت در برابر اسید و روغن',
              values: {
                '1000-0-1': 'استاندارد گرید B',
                '1000-0-2': 'گرید صنعتی A+ (HNBR ضد روغن)',
              },
            },
            {
              feature: 'موجودی انبار و تحویل',
              values: {
                '1000-0-1': '۲۴۰ حلقه (تحویل فوری)',
                '1000-0-2': '۱۸۰ حلقه (تحویل فوری)',
              },
            },
          ],
        },
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
    ],
  },
  {
    id: 'conv-103',
    title: 'جلسه صوتی Face-to-Face: بررسی لرزش گیربکس',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 46).toISOString(),
    lastMessage: 'خلاصه جلسه تصویری و دیاگرام بیرینگ‌های جایگزین ذخیره شد.',
    messageCount: 3,
    status: 'active',
    isPinned: false,
    activeContext: {
      lastReferencedProductCode: '1000-0-3',
      identifiedCategory: 'bearings',
    },
    metadata: {
      tags: ['Face-to-Face', 'صوتی و تصویری', 'عیب‌یابی خط'],
      interactionMode: 'face_to_face',
    },
    messages: [
      {
        id: 'msg-103-1',
        conversationId: 'conv-103',
        sender: 'user',
        type: 'VOICE',
        content: 'صدای لرزش شدید در دور الکتروموتور ۳۰۰۰ دور شفت اصلی',
        voiceData: {
          duration: 14,
          transcript: 'صدای لرزش شدید در دور الکتروموتور ۳۰۰۰ دور شفت اصلی، آیا مشکل از لقی بیرینگه یا ناهم‌محوری پولی؟',
        },
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: 'msg-103-2',
        conversationId: 'conv-103',
        sender: 'assistant',
        type: 'AI_RESPONSE',
        content:
          'مهندس گرامی، با توجه به فرکانس ارتعاش ثبت شده در مکالمه Face-to-Face، احتمال ۹۰٪ مربوط به لقی ساچمه‌های بیرینگ دور بالا در شرایط حرارتی است. استفاده از رولربیرینگ سرامیکی هیبرید یا بیرینگ شیار عمیق C3 فورزا توصیه می‌شود.',
        products: getCatalogProducts().slice(2, 5),
        timestamp: new Date(Date.now() - 3600000 * 47).toISOString(),
      },
      {
        id: 'msg-103-3',
        conversationId: 'conv-103',
        sender: 'system',
        type: 'SYSTEM_ACTION',
        content: 'جلسه Face-to-Face به مدت ۴ دقیقه و ۱۲ ثانیه با موفقیت به تاریخچه این مکالمه متصل و آرشیو گردید.',
        timestamp: new Date(Date.now() - 3600000 * 46).toISOString(),
      },
    ],
  },
];

class ForzaWorkspaceService {
  private conversations: Conversation[] = [];
  private activeConversationId: string | null = null;
  private catalog: Product[] = [];

  constructor() {
    this.catalog = getCatalogProducts();
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.conversations = JSON.parse(stored);
      } else {
        this.conversations = SEED_CONVERSATIONS;
        this.saveToStorage();
      }

      const activeId = localStorage.getItem(ACTIVE_CONV_KEY);
      if (activeId && this.conversations.some((c) => c.id === activeId)) {
        this.activeConversationId = activeId;
      } else if (this.conversations.length > 0) {
        this.activeConversationId = this.conversations[0].id;
      }
    } catch (e) {
      console.error('Error loading conversations from localStorage:', e);
      this.conversations = SEED_CONVERSATIONS;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations));
      if (this.activeConversationId) {
        localStorage.setItem(ACTIVE_CONV_KEY, this.activeConversationId);
      }
    } catch (e) {
      console.error('Error saving conversations to localStorage:', e);
    }
  }

  public getConversations(): Conversation[] {
    return [...this.conversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  public getActiveConversation(): Conversation | null {
    if (!this.activeConversationId && this.conversations.length > 0) {
      this.activeConversationId = this.conversations[0].id;
    }
    return this.conversations.find((c) => c.id === this.activeConversationId) || null;
  }

  public getConversationById(id: string): Conversation | null {
    return this.conversations.find((c) => c.id === id) || null;
  }

  public setActiveConversation(id: string): Conversation | null {
    const conv = this.conversations.find((c) => c.id === id);
    if (conv) {
      this.activeConversationId = id;
      this.saveToStorage();
      return conv;
    }
    return null;
  }

  public createConversation(title?: string, initialMode?: string): Conversation {
    const newConv: Conversation = {
      id: 'conv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: title || 'گفتگوی جدید با FORZA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      status: 'active',
      isPinned: false,
      messages: [],
      metadata: {
        interactionMode: (initialMode as any) || 'standard',
        tags: ['هوش مصنوعی', 'مشاوره فنی'],
      },
    };

    this.conversations.unshift(newConv);
    this.activeConversationId = newConv.id;
    this.saveToStorage();
    return newConv;
  }

  public addMessage(conversationId: string, messageData: Partial<Message>): Message {
    let conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) {
      conv = this.createConversation();
      conversationId = conv.id;
    }

    const newMessage: Message = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      conversationId,
      sender: messageData.sender || 'user',
      type: messageData.type || 'TEXT',
      content: messageData.content || '',
      attachments: messageData.attachments || [],
      products: messageData.products || [],
      identificationResult: messageData.identificationResult,
      comparisonData: messageData.comparisonData,
      rfqData: messageData.rfqData,
      voiceData: messageData.voiceData,
      metadata: messageData.metadata,
      timestamp: new Date().toISOString(),
    };

    conv.messages.push(newMessage);
    conv.messageCount = conv.messages.length;
    conv.updatedAt = new Date().toISOString();
    conv.lastMessage = newMessage.content.substring(0, 80) || (newMessage.type === 'IMAGE' ? '📷 ارسال تصویر' : 'پیام جدید');

    // Auto-update smart title if it's default
    if (conv.title === 'گفتگوی جدید با FORZA' && newMessage.sender === 'user' && newMessage.content) {
      const smartTitle = newMessage.content.slice(0, 32) + (newMessage.content.length > 32 ? '...' : '');
      conv.title = smartTitle;
    }

    this.saveToStorage();
    return newMessage;
  }

  public togglePin(id: string): boolean {
    const conv = this.conversations.find((c) => c.id === id);
    if (conv) {
      conv.isPinned = !conv.isPinned;
      conv.updatedAt = new Date().toISOString();
      this.saveToStorage();
      return conv.isPinned;
    }
    return false;
  }

  public renameConversation(id: string, newTitle: string): boolean {
    const conv = this.conversations.find((c) => c.id === id);
    if (conv && newTitle.trim()) {
      conv.title = newTitle.trim();
      conv.updatedAt = new Date().toISOString();
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public deleteConversation(id: string): boolean {
    const index = this.conversations.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.conversations.splice(index, 1);
      if (this.activeConversationId === id) {
        this.activeConversationId = this.conversations.length > 0 ? this.conversations[0].id : null;
      }
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public searchConversations(query: string): Conversation[] {
    if (!query.trim()) return this.getConversations();
    const q = query.toLowerCase().trim();
    return this.conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q)) ||
        c.metadata?.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  // AI Logic: Image Analysis & Product Identification
  public async analyzeImageAndMatch(
    conversationId: string,
    imageUrl: string,
    userPrompt?: string
  ): Promise<{ identification: IdentificationResult; products: Product[]; aiText: string }> {
    // Simulated deep vision intelligence
    const matchedProducts = this.catalog.slice(0, 3);
    const confidence = Math.floor(Math.random() * 8) + 91; // 91% to 98%

    const identification: IdentificationResult = {
      partType: 'شیر توپی صنعتی / تسمه صنعتی انتقال قدرت استاندارد',
      brand: 'FORZA (فورزا) / SWR',
      model: 'FZ-IND-SERIES High Pressure',
      confidence,
      specs: [
        'استاندارد ابعادی: DIN EN 12266 / ISO 5211',
        'مقاومت دمایی: -۳۰ الی +۲۰۰ درجه سانتی‌گراد',
        'پوشش محافظ: پوشش آنتی‌استاتیک و ضد سایش کوره',
        'کلاس آب‌بندی: 100% Bubble Tight Class VI',
      ],
      visualFeatures: [
        'شیارهای دقیق ماشین‌کاری شده با CNC',
        'پلاک مشخصات برجسته با شماره سریال رهگیری',
        'کد کاتالوگ منطبق با صفحه ۱۹ و ۲۰ کاتالوگ اطلس',
      ],
      summary: `بر اساس تصویر با ضریب اطمینان ${confidence}٪، این قطعه مربوط به خطوط صنعتی کاشی، فولاد و سیمان است و ۳ مدل فابریک با تحویل فوری در انبار موجود است.`,
    };

    const aiText = `تصویر قطعه با موفقیت توسط موتور پردازش تصویری FORZA بررسی شد.\n\nبر اساس ویژگی‌های ظاهری، مقطع، گام شیارها و پلاک فنی، این قطعه با اطمینان **${confidence}٪** شناسایی شد:\n\n**نوع قطعه:** ${identification.partType}\n**برند معادل:** ${identification.brand}\n\nمحصولات فابریک و استاندارد زیر در انبار مرکزی هایپر صنعت موجود و آماده ارسال هستند:`;

    // Update conversation context
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.activeContext = {
        lastReferencedProductCode: matchedProducts[0]?.code,
        identifiedCategory: matchedProducts[0]?.categorySlug,
        identifiedPartType: identification.partType,
      };
      conv.title = `شناسایی: ${identification.partType.slice(0, 24)}`;
      this.saveToStorage();
    }

    return { identification, products: matchedProducts, aiText };
  }

  // AI Logic: Context-Aware Chat Response
  public async processUserQuery(
    conversationId: string,
    query: string
  ): Promise<{ responseType: Message['type']; content: string; products?: Product[]; comparisonData?: ComparisonData; rfqData?: RfqRecord }> {
    const lower = query.toLowerCase();
    const conv = this.conversations.find((c) => c.id === conversationId);
    const lastProductCode = conv?.activeContext?.lastReferencedProductCode || '1000-0-1';
    const activeProduct = this.catalog.find((p) => p.code === lastProductCode) || this.catalog[0];

    // Intent 1: Price / RFQ inquiry
    if (lower.includes('قیمت') || lower.includes('استعلام') || lower.includes('پیش‌فاکتور') || lower.includes('rfq')) {
      const rfqNumber = 'RFQ-' + Math.floor(10000 + Math.random() * 90000) + '-FZ';
      const rfq: RfqRecord = {
        rfqNumber,
        productCode: activeProduct.code,
        productName: activeProduct.name,
        quantity: 5,
        status: 'priced',
        estimatedPrice: activeProduct.prices.retail * 5,
        createdAt: new Date().toISOString(),
        note: 'ثبت شده خودکار توسط دستیار هوشمند FORZA',
      };

      return {
        responseType: 'RFQ',
        content: `استعلام قیمت رسمی برای محصول **${activeProduct.name}** با موفقیت صادر گردید.\n\nشماره پیگیری استعلام: **${rfqNumber}**\nقیمت همکار و تخفیف ویژه نمایندگی برای شما فعال گردید.`,
        rfqData: rfq,
      };
    }

    // Intent 2: Product Comparison
    if (lower.includes('مقایسه') || lower.includes('فرق') || lower.includes('تفاوت') || lower.includes('کدوم بهتره')) {
      const p1 = this.catalog[0];
      const p2 = this.catalog[1] || this.catalog[0];
      const comparison: ComparisonData = {
        title: `مقایسه فنی: ${p1.name.slice(0, 25)} در برابر ${p2.name.slice(0, 25)}`,
        productCodes: [p1.code, p2.code],
        products: [p1, p2],
        comparisonPoints: [
          {
            feature: 'کلاس متالوژی / ساختار',
            values: { [p1.code]: 'تسمه تقویت شده های‌پاور کلاسیک', [p2.code]: 'تسمه دنده‌ای آرامید سنگین' },
          },
          {
            feature: 'تحمل حرارتی',
            values: { [p1.code]: 'تا +۱۴۰ درجه سانتی‌گراد', [p2.code]: 'تا +۲۰۰ درجه سانتی‌گراد (ویژه کوره)' },
          },
          {
            feature: 'گارانتی و خدمات پس از فروش',
            values: { [p1.code]: '۱۲ ماه ضمانت کتبی', [p2.code]: '۲۴ ماه ضمانت تعویض طلایی' },
          },
          {
            feature: 'وضعیت در انبار',
            values: { [p1.code]: `${p1.stock} عدد موجود`, [p2.code]: `${p2.stock} عدد موجود` },
          },
        ],
      };

      return {
        responseType: 'PRODUCT_COMPARISON',
        content: `جدول مقایسه جامع فنی بین دو محصول به شرح زیر است:`,
        comparisonData: comparison,
      };
    }

    // Intent 3: Catalog Search / Find product
    if (lower.includes('پیدا') || lower.includes('تسمه') || lower.includes('شیر') || lower.includes('کاتالوگ') || lower.includes('مدل')) {
      const results = this.catalog.slice(0, 3);
      return {
        responseType: 'PRODUCT_RESULT',
        content: `محصولات منطبق در انبار مرکزی FORZA با مشخصات مدنظر شما پیدا شدند:`,
        products: results,
      };
    }

    // Default: General intelligent engineering answer
    return {
      responseType: 'AI_RESPONSE',
      content: `پاسخ مهندسی FORZA:\n\nبا توجه به شرایط کاری خط تولید شما، استفاده از قطعات با استاندارد صنعتی DIN/ISO و مقاومت به سایش بالا توصیه می‌شود. کلیه محصولات ارائه شده در هایپر صنعت دارای سرتیفیکیت معتبر متالوژی و تضمین تعویض هستند.\n\nبرای راهنمایی دقیق‌تر می‌توانید تصویر پلاک ماشین‌آلات را ارسال کنید یا استعلام قیمت فوری ثبت فرمایید.`,
    };
  }

  // Create quick RFQ from Product Card
  public createRfqForProduct(conversationId: string, product: Product, quantity = 1): Message {
    const rfqNumber = 'RFQ-' + Math.floor(10000 + Math.random() * 90000) + '-FZ';
    const rfq: RfqRecord = {
      rfqNumber,
      productCode: product.code,
      productName: product.name,
      quantity,
      status: 'priced',
      estimatedPrice: (product.prices?.retail || 500000) * quantity,
      createdAt: new Date().toISOString(),
      note: 'درخواست فوری از طریق میزکار چت FORZA',
    };

    return this.addMessage(conversationId, {
      sender: 'assistant',
      type: 'RFQ',
      content: `استعلام قیمت و صدور پیش‌فاکتور برای **${product.name}** (تعداد: ${quantity} ${product.unit || 'عدد'}) با موفقیت ثبت شد.`,
      rfqData: rfq,
    });
  }
}

export const forzaWorkspaceService = new ForzaWorkspaceService();
