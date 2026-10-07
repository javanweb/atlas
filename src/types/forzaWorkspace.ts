import { Product } from '../types';

export type MessageType =
  | 'TEXT'
  | 'IMAGE'
  | 'FILE'
  | 'PRODUCT_SEARCH'
  | 'PRODUCT_IDENTIFICATION'
  | 'PRODUCT_RESULT'
  | 'AI_RESPONSE'
  | 'VOICE'
  | 'SYSTEM_ACTION'
  | 'PRODUCT_COMPARISON'
  | 'RFQ';

export type MessageSender = 'user' | 'assistant' | 'system';

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio';
  url: string;
  name: string;
  size?: string;
  mimeType?: string;
  thumbnailUrl?: string;
}

export interface IdentificationResult {
  partType: string;
  brand: string;
  model: string;
  confidence: number;
  specs: string[];
  visualFeatures: string[];
  estimatedDimensions?: string;
  matchedCategoryId?: string;
  summary: string;
}

export interface ComparisonPoint {
  feature: string;
  values: Record<string, string>;
}

export interface ComparisonData {
  title: string;
  productCodes: string[];
  products: Product[];
  comparisonPoints: ComparisonPoint[];
}

export interface RfqRecord {
  rfqNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  status: 'submitted' | 'processing' | 'priced';
  targetPrice?: number;
  estimatedPrice?: number;
  createdAt: string;
  note?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  content: string;
  attachments?: MessageAttachment[];
  products?: Product[];
  identificationResult?: IdentificationResult;
  comparisonData?: ComparisonData;
  rfqData?: RfqRecord;
  voiceData?: {
    duration: number; // in seconds
    transcript: string;
    audioUrl?: string;
  };
  metadata?: {
    confidence?: number;
    responseTimeMs?: number;
    tokens?: number;
    actionType?: string;
    source?: 'chat' | 'visual_search' | 'face_to_face' | 'voice_call' | 'file_analysis';
  };
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  messageCount: number;
  status: 'active' | 'archived';
  isPinned: boolean;
  activeContext?: {
    lastReferencedProductCode?: string;
    identifiedCategory?: string;
    identifiedPartType?: string;
    activeRfqId?: string;
    comparisonProductCodes?: string[];
  };
  metadata?: {
    tags?: string[];
    summary?: string;
    primaryProductCode?: string;
    interactionMode?: 'standard' | 'face_to_face' | 'visual_search' | 'rfq_consultation';
  };
  messages: Message[];
}

export interface AIEvent {
  id: string;
  conversationId: string;
  type:
    | 'USER_MESSAGE'
    | 'IMAGE_UPLOADED'
    | 'IMAGE_ANALYZED'
    | 'PRODUCT_IDENTIFIED'
    | 'PRODUCT_SEARCH_STARTED'
    | 'PRODUCT_SEARCH_COMPLETED'
    | 'PRODUCT_FOUND'
    | 'VOICE_STARTED'
    | 'VOICE_MESSAGE'
    | 'FACE_TO_FACE_STARTED'
    | 'FACE_TO_FACE_ENDED'
    | 'FILE_ANALYZED'
    | 'PRODUCT_COMPARED'
    | 'RFQ_CREATED';
  timestamp: string;
  payload?: any;
}
