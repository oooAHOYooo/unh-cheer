import React from 'react';
import { 
  Plus, 
  Database, 
  Download, 
  Upload, 
  Calendar, 
  Film, 
  CheckCircle2, 
  Share2, 
  Search,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'library' | 'coach' | 'calendar' | 'social';
  setActiveTab: (tab: 'library' | 'coach' | 'calendar' | 'social') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
  onOpenBucketModal: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pendingReviewCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenBucketModal,
  onExportData,
  onImportData,
  pendingReviewCount,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Team Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 via-blue-900 to-amber-500 p-0.5 shadow-lg shadow-blue-900/30">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center border border-amber-400/30">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-200 text-lg tracking-wider">
                  UNH
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  UNH CHEER
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold tracking-normal">
                    Media Vault
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">Content Library & Coach Collaboration Hub</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search backflips, stunts, athletes, tags..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenBucketModal}
              title="Cloud Bucket Setup (S3/R2/Netlify)"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-lg transition-colors shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">MP4 Bucket</span>
            </button>

            <button
              onClick={onExportData}
              title="Backup & Export Library JSON"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onImportData} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import JSON Backup"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-lg transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-lg shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Add Clip</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-2 border-t border-slate-800/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'library'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Clips Vault & Library
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all relative ${
              activeTab === 'coach'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            Coach Collaboration
            {pendingReviewCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                {pendingReviewCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'calendar'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Events & Schedule
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'social'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Social Drops & Captions
          </button>
        </div>
      </div>
    </header>
  );
};
