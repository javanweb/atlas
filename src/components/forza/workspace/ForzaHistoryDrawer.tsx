import React from 'react';
import {
  MessageSquare,
  Search,
  Pin,
  Trash2,
  X,
  Clock,
  Plus,
} from 'lucide-react';
import { WorkspaceSession } from '../ForzaAiWorkspace';

interface ForzaHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: WorkspaceSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onTogglePinSession: (id: string, e: React.MouseEvent) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  onChangeSearchQuery: (q: string) => void;
}

export const ForzaHistoryDrawer: React.FC<ForzaHistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onTogglePinSession,
  onDeleteSession,
  searchQuery,
  onChangeSearchQuery,
}) => {
  if (!isOpen) return null;

  const filtered = sessions.filter(
    s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-slate-800 text-sm">تاریخچه گفتگوها</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & New Session */}
        <div className="p-3 border-b border-slate-100 space-y-2">
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-sm transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>گفتگوی جدید</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="جستجو در متن گفتگوها..."
              value={searchQuery}
              onChange={e => onChangeSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">گفتگویی یافت نشد.</div>
          ) : (
            filtered.map(session => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-2xl cursor-pointer transition ${
                    isActive
                      ? 'bg-orange-50 border border-orange-200 text-orange-950 font-bold'
                      : 'hover:bg-slate-50 border border-transparent text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                    <div className="overflow-hidden">
                      <div className="text-xs truncate">{session.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {session.messages.length} پیام · {new Date(session.updatedAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={e => onTogglePinSession(session.id, e)}
                      className={`p-1.5 rounded-lg hover:bg-slate-200/60 ${session.isPinned ? 'text-amber-500 opacity-100' : 'text-slate-400'}`}
                      title="پین کردن"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    {sessions.length > 1 && (
                      <button
                        onClick={e => onDeleteSession(session.id, e)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
