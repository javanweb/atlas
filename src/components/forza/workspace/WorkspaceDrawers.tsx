import React, { useState } from 'react';
import {
  Clock,
  Compass,
  FileText,
  X,
  Search,
  Settings,
  Trash2,
  Check,
  Calculator,
} from 'lucide-react';

export interface DrawerSession {
  id: string;
  title: string;
  updatedAt: number;
  messageCount: number;
}

export interface DrawerDoc {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

// -----------------------------------------------------------------------------
// History Drawer Component
// -----------------------------------------------------------------------------
interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: DrawerSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession?: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = sessions.filter(s => s.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="absolute inset-y-0 right-16 sm:right-20 w-80 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col p-4 animate-slide-right select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-orange-600" />
          تاریخچه گفتگوها ({sessions.length})
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Filter */}
      <div className="py-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="جستجو در گفتگوها..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-8 pl-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1 space-y-1 text-xs">
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => {
              onSelectSession(s.id);
              onClose();
            }}
            className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition group ${
              s.id === activeSessionId
                ? 'bg-orange-50 text-orange-700 font-bold'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="truncate flex-1">{s.title}</span>
            <span className="text-[10px] text-slate-400 mr-2 shrink-0">{s.messageCount} پیام</span>
            {onDeleteSession && sessions.length > 1 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDeleteSession(s.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Engineering Tools Drawer Component (Belt Calculator DIN 2215)
// -----------------------------------------------------------------------------
interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendCalcToChat: (prompt: string) => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ isOpen, onClose, onSendCalcToChat }) => {
  const [calcC, setCalcC] = useState('500');
  const [calcD, setCalcD] = useState('315');
  const [calcd, setCalcd] = useState('160');
  const [resultLength, setResultLength] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCalculate = () => {
    const C = parseFloat(calcC) || 0;
    const D = parseFloat(calcD) || 0;
    const d = parseFloat(calcd) || 0;
    if (C <= 0 || D <= 0 || d <= 0) return;
    const L = 2 * C + 1.5708 * (D + d) + Math.pow(D - d, 2) / (4 * C);
    setResultLength(Math.round(L));
  };

  return (
    <div className="absolute inset-y-0 right-16 sm:right-20 w-80 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col p-4 animate-slide-right text-xs select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-orange-600" />
          محاسبه‌گر طول تسمه (DIN 2215)
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        <div>
          <label className="text-[11px] text-slate-500 block mb-1">فاصله محوری پولی‌ها (C به mm):</label>
          <input
            type="number"
            value={calcC}
            onChange={e => setCalcC(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">قطر پولی بزرگ (D):</label>
            <input
              type="number"
              value={calcD}
              onChange={e => setCalcD(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">قطر پولی کوچک (d):</label>
            <input
              type="number"
              value={calcd}
              onChange={e => setCalcd(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-slate-800"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-xs transition active:scale-95"
        >
          محاسبه طول استاندارد
        </button>

        {resultLength !== null && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-center space-y-1">
            <div className="text-[10px] text-slate-500">طول استاندارد محاسبه‌شده:</div>
            <div className="text-lg font-black text-orange-600">{resultLength} میلی‌متر</div>
            <button
              onClick={() => {
                const prompt = `با فاصله محوری C=${calcC}mm و قطرهای D=${calcD}mm و d=${calcd}mm، طول محاسبه‌شده برابر ${resultLength}mm شد. لطفاً کد نزدیک‌ترین تسمه استاندارد FORZA را با موجودی انبار بگو.`;
                onSendCalcToChat(prompt);
                onClose();
              }}
              className="text-xs text-orange-700 font-bold hover:underline"
            >
              ارسال به چت برای استعلام کد کاتالوگ ↲
            </button>
          </div>
        )}

        {/* Quick formulas info */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1.5 text-slate-600">
          <div className="font-bold text-slate-800">فرمول‌های مرجع:</div>
          <div>گشتاور: <code>T = (9550 × P) / n</code></div>
          <div>سرعت خطی: <code>v = (π × D × n) / 60000</code></div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Files & Catalogs Drawer Component
// -----------------------------------------------------------------------------
interface FilesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  files: DrawerDoc[];
  onUploadFileClick?: () => void;
}

export const FilesDrawer: React.FC<FilesDrawerProps> = ({ isOpen, onClose, files, onUploadFileClick }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-0 right-16 sm:right-20 w-80 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col p-4 animate-slide-right text-xs select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-orange-600" />
          آرشیو کاتالوگ‌ها و اسناد
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {files.map(doc => (
          <div key={doc.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-800 truncate">{doc.name}</div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>{doc.size}</span>
              <span>{doc.uploadDate}</span>
            </div>
          </div>
        ))}

        {onUploadFileClick && (
          <button
            onClick={onUploadFileClick}
            className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-xl text-slate-600 font-medium text-xs transition"
          >
            + آپلود سند جدید (PDF / XLSX)
          </button>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Settings Modal Component
// -----------------------------------------------------------------------------
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoTts: boolean;
  onToggleAutoTts: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, autoTts, onToggleAutoTts }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-orange-600" />
            تنظیمات هوش مصنوعی FORZA
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <div className="font-bold text-slate-900">روخوانی صوتی خودکار</div>
              <div className="text-[10px] text-slate-500">پخش صدا به زبان فارسی پس از تولید پاسخ</div>
            </div>
            <input
              type="checkbox"
              checked={autoTts}
              onChange={onToggleAutoTts}
              className="accent-orange-600 w-4 h-4"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900">اتصال به انبار و کاتالوگ اطلس</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              متصل به انبار مرکزی تهران و کاتالوگ رسمی ۱۴۰۴
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-[#181F2A] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition"
        >
          بستن
        </button>
      </div>
    </div>
  );
};
