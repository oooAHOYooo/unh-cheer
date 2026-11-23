import React, { useState } from 'react';
import { 
  Film, 
  Search, 
  Play, 
  Download, 
  Share2, 
  LayoutGrid, 
  List, 
  User, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Info,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Clip, SkillCategory } from '../types/cheer';
import { SocialExportModal } from './SocialExportModal';

interface TeamPortalViewProps {
  clips: Clip[];
  onSwitchToCoach: () => void;
  onOpenTeamClip: (clip: Clip) => void;
  onExportClip: (clip: Clip) => void;
}

const CATEGORIES: ('All' | SkillCategory)[] = [
  'All',
  'Practice & Drills',
  'Interviews',
  'Stunts & Partner',
  'Tumbling & Flips',
  'Pyramids',
  'Basket Tosses',
  'Game Day & Chants'
];

export const TeamPortalView: React.FC<TeamPortalViewProps> = ({
  clips,
  onSwitchToCoach,
  onOpenTeamClip,
  onExportClip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredClips = clips.filter(clip => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = clip.title.toLowerCase().includes(q);
      const matchCategory = clip.skillCategory.toLowerCase().includes(q);
      const matchAthletes = clip.athletes.some(a => a.toLowerCase().includes(q));
      if (!matchTitle && !matchCategory && !matchAthletes) return false;
    }

    if (selectedCategory !== 'All' && clip.skillCategory !== selectedCategory) {
      return false;
    }

    return true;
  });

  const practiceCount = clips.filter(c => c.skillCategory === 'Practice & Drills').length;
  const interviewCount = clips.filter(c => c.skillCategory === 'Interviews').length;

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 flex flex-col font-sans">
      
      {/* Athlete Portal Dedicated Navigation Bar */}
      <header className="bg-[#002D62] text-white shadow-md border-b-4 border-[#FFC72C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3.5 gap-3">
            
            {/* Team Identity */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center p-1 shadow-sm shrink-0">
                <span className="font-black text-[#002D62] text-sm tracking-wider">
                  UNH
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                    UNH Cheer Team Film Room
                  </h1>
                  <span className="text-[10px] font-bold text-[#002D62] bg-[#FFC72C] px-1.5 py-0.5 rounded-sm uppercase tracking-wider hidden sm:inline-block">
                    Athlete Portal
                  </span>
                </div>
                <p className="text-xs text-blue-200">
                  University of New Haven Cheerleading • Squad Video Vault
                </p>
              </div>
            </div>

            {/* Quick Search */}
            <div className="hidden md:flex flex-1 max-w-xs mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-300" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search routines, athletes, interviews..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#001f44] border border-blue-900 rounded-md text-xs text-white placeholder-blue-300 focus:outline-none focus:border-[#FFC72C]"
                />
              </div>
            </div>

            {/* Right Nav Action: Switch back to Coach Administration */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onSwitchToCoach}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-200 hover:text-white bg-[#001f44] hover:bg-blue-900 border border-blue-800 rounded-md transition-colors"
                title="Return to Coach & Media Admin View"
              >
                <Lock className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span className="hidden sm:inline">Coach / Staff Vault</span>
                <span className="sm:hidden">Staff</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        
        {/* Athlete Welcome & Announcement Card */}
        <div className="bg-gradient-to-r from-[#002D62] to-[#001f44] text-white p-4 sm:p-5 rounded-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-900">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#002D62] bg-[#FFC72C] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                Official Squad Video Room
              </span>
              <span className="text-xs text-blue-200">
                {clips.length} Clips Available
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold">
              Welcome Charger Cheerleaders ⚡️
            </h2>
            <p className="text-xs text-blue-200 leading-relaxed">
              Review all official team practice films, routine transitions, and color-graded interview master cuts. Click any video to study technique with slow-motion (0.5x) or download for Canva & social media sharing.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-[#FFC72C]">
                {practiceCount} Practice • {interviewCount} Interviews
              </div>
              <div className="text-[11px] text-blue-200">
                1080p High-Definition Master
              </div>
            </div>
          </div>
        </div>

        {/* Filters & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-md border border-slate-200/90 shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map(cat => {
              const count = cat === 'All' ? clips.length : clips.filter(c => c.skillCategory === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#002D62] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  {count > 0 && <span className="opacity-80">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-sm border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 font-semibold flex items-center gap-1 rounded-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#002D62] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 font-semibold flex items-center gap-1 rounded-sm transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-[#002D62] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>

        </div>

        {/* Video Grid / Table for Athletes */}
        {filteredClips.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-md p-10 text-center space-y-2.5 shadow-sm">
            <Film className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">No Clips Found</h3>
            <p className="text-xs text-slate-500">
              No video clips found matching this category or search term.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Video / Routine</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Athletes</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Size</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClips.map((clip) => (
                    <tr 
                      key={clip.id}
                      onClick={() => onOpenTeamClip(clip)}
                      className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-slate-900 rounded-sm overflow-hidden shrink-0 relative flex items-center justify-center">
                            {clip.thumbnailUrl ? (
                              <img 
                                src={clip.thumbnailUrl} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <Film className="w-4 h-4 text-blue-300" />
                            )}
                            <Play className="w-3 h-3 text-white absolute fill-white opacity-80" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#002D62] text-xs">
                              {clip.title}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {clip.dateRecorded}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-800">
                          {clip.skillCategory}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {clip.athletes.join(', ')}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600">
                        {clip.duration || 'Full HD'}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600">
                        {clip.fileSize || 'HD'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenTeamClip(clip)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#002D62] bg-blue-50 hover:bg-blue-100 rounded-sm border border-blue-200 transition-colors"
                          >
                            Watch
                          </button>

                          <button
                            onClick={() => onExportClip(clip)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-[#002D62] hover:bg-[#001f44] rounded-sm transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>

                          <button
                            onClick={() => onExportClip(clip)}
                            className="px-2 py-1 text-xs font-bold text-[#002D62] bg-[#FFC72C] hover:bg-yellow-400 rounded-sm transition-colors flex items-center gap-1 shadow-2xs"
                            title="Export for Canva / Instagram"
                          >
                            <Share2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Social</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClips.map((clip) => (
              <div
                key={clip.id}
                onClick={() => onOpenTeamClip(clip)}
                className="group bg-white border border-slate-200/90 hover:border-[#002D62] rounded-md overflow-hidden transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {clip.thumbnailUrl ? (
                    <img 
                      src={clip.thumbnailUrl} 
                      alt={clip.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#001f44] flex items-center justify-center text-blue-200">
                      <Film className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 flex items-center justify-center transition-colors">
                    <div className="w-10 h-10 rounded-md bg-[#002D62]/90 group-hover:bg-[#002D62] text-white flex items-center justify-center shadow-md">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#002D62] text-white uppercase tracking-wider shadow-sm">
                      {clip.skillCategory}
                    </span>
                  </div>

                  {/* Size & Duration */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    {clip.fileSize && (
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-sm bg-black/75 text-amber-300">
                        {clip.fileSize}
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-sm bg-black/75 text-white">
                      {clip.aspectRatio} {clip.duration && `• ${clip.duration}`}
                    </span>
                  </div>
                </div>

                {/* Info & Athlete Action Buttons */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#002D62] transition-colors line-clamp-1 mb-1">
                      {clip.title}
                    </h3>

                    {clip.athletes && clip.athletes.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{clip.athletes.join(', ')}</span>
                      </div>
                    )}

                    {clip.coachFeedback && (
                      <div className="p-2 bg-blue-50/60 border border-blue-100 rounded-sm text-xs text-slate-700">
                        <span className="font-bold text-[#002D62] block text-[10px] uppercase tracking-wide">Coach Note:</span>
                        <p className="line-clamp-2 italic text-[11px] text-slate-700 mt-0.5">
                          "{clip.coachFeedback}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenTeamClip(clip)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#002D62] bg-blue-50 hover:bg-blue-100 rounded-sm transition-colors border border-blue-200"
                    >
                      <Play className="w-3 h-3 fill-[#002D62]" />
                      <span>Watch</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onExportClip(clip)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-[#002D62] hover:bg-[#001f44] rounded-sm transition-colors shadow-xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={() => onExportClip(clip)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#002D62] bg-[#FFC72C] hover:bg-yellow-400 rounded-sm transition-colors shadow-2xs"
                        title="Canva & Social Export"
                      >
                        <Share2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Social</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Athlete Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002D62]">University of New Haven Cheerleading</span>
            <span>• Athlete Video Film Room</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <a 
              href="https://newhavenchargers.com/sports/cheerleading" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#002D62] underline"
            >
              Official Team Roster & Schedule
            </a>
            <span>•</span>
            <button 
              onClick={onSwitchToCoach}
              className="text-[#002D62] font-semibold hover:underline"
            >
              Coach Login
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
