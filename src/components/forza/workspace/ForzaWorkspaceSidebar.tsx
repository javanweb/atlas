import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Conversation } from '../../../types/forzaWorkspace';
import {
  Home,
  MessageSquare,
  Package,
  FileText,
  Settings,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  History,
  Bot,
} from 'lucide-react';

interface ForzaWorkspaceSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onTogglePin: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  isHistoryOpen: boolean;
  onToggleHistory: () => void;
}

export const ForzaWorkspaceSidebar: React.FC<ForzaWorkspaceSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onTogglePin,
  onRenameConversation,
  onDeleteConversation,
  isHistoryOpen,
  onToggleHistory,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const recentConversations = filteredConversations.filter((c) => !c.isPinned);

  const handleStartRename = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const navItems = [
    { label: 'خانه', icon: Home, link: '/' },
    { label: 'گفتگوها', icon: MessageSquare, link: '/ai-forza', active: true },
    { label: 'محصولات', icon: Package, link: '/products' },
    { label: 'درخواست‌ها', icon: FileText, link: '/account/rfq' },
    { label: 'تنظیمات', icon: Settings, link: '/account/settings' },
  ];

  return (
    <div className="flex h-full select-none">
      {/* 1. ULTRA-MINIMAL MAIN ICON BAR */}
      <div className="w-16 sm:w-18 h-full bg-white dark:bg-slate-900 border-l border-slate-200/90 dark:border-slate-800 flex flex-col items-center justify-between py-5 shrink-0 z-30 shadow-xs">
        {/* Brand Logo */}
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/"
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C95210] to-[#E06518] flex items-center justify-center text-white font-black text-sm shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:scale-105 transition-transform"
            title="هایپر صنعت FORZA"
          >
            FZ
          </Link>

          <button
            type="button"
            onClick={onNewConversation}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-[#E06518] hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-xs group cursor-pointer active:scale-95"
            title="گفتگوی جدید (+)"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Core Nav Icons */}
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active || location.pathname === item.link;
            return (
              <Link
                key={item.label}
                to={item.link}
                title={item.label}
                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-orange-500/10 text-[#E06518] font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isActive && (
                  <span className="absolute right-0 top-2 bottom-2 w-1 bg-[#E06518] rounded-l-full" />
                )}
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>

        {/* History Toggle Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onToggleHistory}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              isHistoryOpen
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isHistoryOpen ? 'بستن پنل تاریخچه' : 'مشاهده تاریخچه گفتگوها'}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. SLIDEABLE CONVERSATION HISTORY PANEL */}
      <div
        className={`h-full bg-slate-50/95 dark:bg-slate-900/95 border-l border-slate-200/90 dark:border-slate-800 flex flex-col transition-all duration-300 overflow-hidden ${
          isHistoryOpen ? 'w-72 sm:w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900 dark:text-white">تاریخچه گفتگوها</span>
            <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
              {conversations.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onNewConversation}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#E06518] hover:bg-[#C95210] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>چت جدید</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو در گفتگوها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-right"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 pb-4">
          {/* Pinned List */}
          {pinnedConversations.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 px-2">
                <Pin className="w-3 h-3 text-[#E06518]" />
                <span>سنجاق‌شده‌ها</span>
              </div>
              {pinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeConversationId}
                  isEditing={editingId === conv.id}
                  editTitle={editTitle}
                  onSetEditTitle={setEditTitle}
                  onSelect={() => onSelectConversation(conv.id)}
                  onTogglePin={(e) => {
                    e.stopPropagation();
                    onTogglePin(conv.id);
                  }}
                  onStartRename={(e) => handleStartRename(e, conv)}
                  onSaveRename={(e) => handleSaveRename(e, conv.id)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                />
              ))}
            </div>
          )}

          {/* Recent List */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 px-2">
              گفتگوهای اخیر
            </div>
            {recentConversations.length === 0 && pinnedConversations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                گفتگویی یافت نشد
              </div>
            ) : (
              recentConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeConversationId}
                  isEditing={editingId === conv.id}
                  editTitle={editTitle}
                  onSetEditTitle={setEditTitle}
                  onSelect={() => onSelectConversation(conv.id)}
                  onTogglePin={(e) => {
                    e.stopPropagation();
                    onTogglePin(conv.id);
                  }}
                  onStartRename={(e) => handleStartRename(e, conv)}
                  onSaveRename={(e) => handleSaveRename(e, conv.id)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Individual Conversation Row
const ConversationItem: React.FC<{
  conv: Conversation;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  onSetEditTitle: (val: string) => void;
  onSelect: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onStartRename: (e: React.MouseEvent) => void;
  onSaveRename: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}> = ({
  conv,
  isActive,
  isEditing,
  editTitle,
  onSetEditTitle,
  onSelect,
  onTogglePin,
  onStartRename,
  onSaveRename,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative p-2.5 rounded-2xl transition-all cursor-pointer text-right flex flex-col justify-between ${
        isActive
          ? 'bg-white dark:bg-slate-800 shadow-md border border-orange-500/40'
          : 'hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {isEditing ? (
          <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => onSetEditTitle(e.target.value)}
              className="w-full text-xs font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg border border-orange-500 focus:outline-hidden"
              autoFocus
            />
            <button
              type="button"
              onClick={(e) => onSaveRename(e)}
              className="p-1 bg-emerald-500 text-white rounded-md"
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span
            className={`text-xs font-bold truncate flex-1 ${
              isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {conv.title}
          </span>
        )}

        {/* Hover Quick Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={onTogglePin}
              title={conv.isPinned ? 'حذف سنجاق' : 'سنجاق کردن'}
              className={`p-1 rounded-md transition-colors ${
                conv.isPinned ? 'text-[#E06518]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Pin className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={onStartRename}
              title="تغییر نام"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              title="حذف گفتگو"
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Snippet & Date */}
      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
        <span className="truncate max-w-[170px]">{conv.lastMessage || 'بدون پیام'}</span>
        <span className="shrink-0 font-mono">
          {new Date(conv.updatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
