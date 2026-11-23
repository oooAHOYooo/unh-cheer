import React, { useState } from 'react';
import { 
  Plus, 
  Database, 
  Download, 
  Upload, 
  Grid, 
  Search,
  ExternalLink,
  Layers,
  Users,
  Copy,
  Check
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'library' | 'features';
  setActiveTab: (tab: 'library' | 'features') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
  onOpenBucketModal: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchToTeam: () => void;
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
  onSwitchToTeam,
  pendingReviewCount,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [copiedTeamLink, setCopiedTeamLink] = useState(false);

  const handleCopyTeamLink = () => {
    const teamUrl = `${window.location.origin}${window.location.pathname}?view=team`;
    navigator.clipboard.writeText(teamUrl);
    setCopiedTeamLink(true);
    setTimeout(() => setCopiedTeamLink(false), 2500);
  };

  return (
    <header className="bg-[#002D62] text-white shadow-md border-b-4 border-[#FFC72C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Bar */}
        <div className="flex items-center justify-between py-4 gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center p-1 shadow-sm shrink-0">
              <span className="font-black text-[#002D62] text-sm tracking-wider">
                UNH
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white uppercase">
                  New Haven Chargers
                </h1>
                <span className="text-[11px] font-bold text-[#FFC72C] bg-[#001f44] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  Cheer Media
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Official Content Library & Video Vault
              </p>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search interviews, stunts, athletes..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#001f44] border border-blue-900 rounded-md text-xs text-white placeholder-blue-300 focus:outline-none focus:border-[#FFC72C] transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-blue-300 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Team Portal Switch & Link Share */}
            <div className="flex items-center bg-[#001f44] border border-blue-800 rounded-md p-0.5">
              <button
                onClick={onSwitchToTeam}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#002D62] bg-[#FFC72C] hover:bg-yellow-400 rounded-sm shadow-xs transition-colors"
                title="View what the athletes and cheer team see"
              >
                <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Team Portal</span>
              </button>

              <button
                onClick={handleCopyTeamLink}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors"
                title="Copy direct link to share with athletes: ?view=team"
              >
                {copiedTeamLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-300 font-bold hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px] hidden sm:inline">Share Link</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onOpenBucketModal}
              title="Bucket Settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#001f44] hover:bg-blue-900 border border-blue-800 rounded-md transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[#FFC72C]" />
              <span className="hidden lg:inline">Bucket Settings</span>
            </button>

            <button
              onClick={onExportData}
              title="Backup Library"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-200 hover:text-white bg-[#001f44] border border-blue-800 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
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
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-200 hover:text-white bg-[#001f44] border border-blue-800 rounded-md transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#002D62] bg-[#FFC72C] hover:bg-yellow-400 rounded-md shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Clip</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation - Starts with Grid / Library, Additional Features separated */}
        <div className="flex space-x-6 border-t border-blue-900/60 pt-1">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-[#FFC72C] text-[#FFC72C]'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Media Grid & Vault
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'features'
                ? 'border-[#FFC72C] text-[#FFC72C]'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Additional Features
            {pendingReviewCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#FFC72C] text-[#002D62] text-[10px] font-black rounded-sm">
                {pendingReviewCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
