import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { ClipCard } from './components/ClipCard';
import { DriveTableView } from './components/DriveTableView';
import { VideoModal } from './components/VideoModal';
import { AddClipModal } from './components/AddClipModal';
import { CoachReviewTab } from './components/CoachReviewTab';
import { CalendarView } from './components/CalendarView';
import { TryoutCurriculum } from './components/TryoutCurriculum';
import { BucketHelperModal } from './components/BucketHelperModal';
import { SocialExportModal } from './components/SocialExportModal';
import { TeamPortalView } from './components/TeamPortalView';
import { TeamVideoModal } from './components/TeamVideoModal';
import { INITIAL_CLIPS, INITIAL_EVENTS } from './data/initialData';
import { Clip, CheerEvent, SkillCategory } from './types/cheer';
import { 
  Plus, 
  Film, 
  LayoutGrid, 
  List, 
  Folder, 
  CheckSquare, 
  Calendar, 
  Award,
  Sparkles 
} from 'lucide-react';

const CATEGORIES: SkillCategory[] = [
  'Interviews',
  'Practice & Drills',
  'Tumbling & Flips',
  'Stunts & Partner',
  'Pyramids',
  'Basket Tosses',
  'Game Day & Chants'
];

export function App() {
  // Persistence state with auto-merger for authentic interview and practice exports
  const [clips, setClips] = useState<Clip[]>(() => {
    try {
      const saved = localStorage.getItem('unh_cheer_clips_v6') || localStorage.getItem('unh_cheer_clips_v5');
      if (saved) {
        const parsed: Clip[] = JSON.parse(saved);
        const clean = parsed.filter(c => !c.thumbnailUrl?.includes('unsplash.com'));
        const existingIds = new Set(clean.map(c => c.id));
        const toAdd = INITIAL_CLIPS.filter(c => !existingIds.has(c.id));
        return [...toAdd, ...clean];
      }
    } catch (e) {
      console.error('Error loading clips', e);
    }
    return INITIAL_CLIPS;
  });

  const [events, setEvents] = useState<CheerEvent[]>(() => {
    try {
      const saved = localStorage.getItem('unh_cheer_events_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading events', e);
    }
    return INITIAL_EVENTS;
  });

  const [bucketPrefix, setBucketPrefix] = useState<string>(() => {
    return localStorage.getItem('unh_cheer_bucket_prefix') || '';
  });

  // Portal mode: 'coach' (full management vault) vs 'team' (athlete-only film room)
  const [portalMode, setPortalMode] = useState<'coach' | 'team'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'team' ? 'team' : 'coach';
  });

  // UI state: defaults directly to library and starts with the grid
  const [activeTab, setActiveTab] = useState<'library' | 'features'>('library');
  const [activeFeature, setActiveFeature] = useState<'coach' | 'schedule' | 'tryouts'>('coach');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [selectedTeamClip, setSelectedTeamClip] = useState<Clip | null>(null);
  const [selectedExportClip, setSelectedExportClip] = useState<Clip | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);

  // Sync portal mode to URL history
  const handleSwitchPortal = (mode: 'coach' | 'team') => {
    setPortalMode(mode);
    const url = new URL(window.location.href);
    if (mode === 'team') {
      url.searchParams.set('view', 'team');
    } else {
      url.searchParams.delete('view');
    }
    window.history.pushState({}, '', url.toString());
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setPortalMode(params.get('view') === 'team' ? 'team' : 'coach');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unh_cheer_clips_v6', JSON.stringify(clips));
    } catch (e) {
      console.error('Failed to save clips', e);
    }
  }, [clips]);

  useEffect(() => {
    try {
      localStorage.setItem('unh_cheer_events_v2', JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events', e);
    }
  }, [events]);

  const handleSaveBucketPrefix = (prefix: string) => {
    setBucketPrefix(prefix);
    localStorage.setItem('unh_cheer_bucket_prefix', prefix);
  };

  // Handlers for Clips
  const handleAddClip = (newClip: Clip) => {
    let finalClip = { ...newClip };
    if (bucketPrefix && finalClip.videoUrl && !finalClip.videoUrl.startsWith('http')) {
      const cleanPrefix = bucketPrefix.replace(/\/$/, '');
      const cleanUrl = finalClip.videoUrl.replace(/^\//, '');
      finalClip.videoUrl = `${cleanPrefix}/${cleanUrl}`;
    }
    setClips([finalClip, ...clips]);
  };

  const handleUpdateClip = (updated: Clip) => {
    setClips(clips.map(c => c.id === updated.id ? updated : c));
    if (selectedClip && selectedClip.id === updated.id) {
      setSelectedClip(updated);
    }
  };

  const handleDeleteClip = (id: string) => {
    setClips(clips.filter(c => c.id !== id));
    if (selectedClip && selectedClip.id === id) {
      setSelectedClip(null);
    }
  };

  // Handlers for Events
  const handleAddEvent = (newEvent: CheerEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Backup and Export JSON
  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      team: 'University of New Haven Cheerleading',
      coach: 'Alexis Vano',
      clips,
      events,
      bucketPrefix
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unh-cheer-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.clips && Array.isArray(parsed.clips)) setClips(parsed.clips);
        if (parsed.events && Array.isArray(parsed.events)) setEvents(parsed.events);
        if (parsed.bucketPrefix) setBucketPrefix(parsed.bucketPrefix);
        alert('UNH Cheer media library restored successfully!');
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter clips for library
  const filteredClips = clips.filter(clip => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = clip.title.toLowerCase().includes(q);
      const matchCategory = clip.skillCategory.toLowerCase().includes(q);
      const matchAthletes = clip.athletes.some(a => a.toLowerCase().includes(q));
      const matchNotes = clip.coachFeedback?.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchAthletes && !matchNotes) {
        return false;
      }
    }

    if (selectedCategory !== 'all' && clip.skillCategory !== selectedCategory) {
      return false;
    }

    if (selectedStatus !== 'all' && clip.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const pendingReviewCount = clips.filter(c => c.status === 'needs_review').length;
  const interviewClips = clips.filter(c => c.skillCategory === 'Interviews');
  const interviewCount = interviewClips.length;
  const interviewTotalMB = interviewClips
    .reduce((acc, c) => acc + (parseFloat(c.fileSize || '0') || 0), 0)
    .toFixed(1);

  if (portalMode === 'team') {
    return (
      <>
        <TeamPortalView
          clips={clips}
          onSwitchToCoach={() => handleSwitchPortal('coach')}
          onOpenTeamClip={(c) => setSelectedTeamClip(c)}
          onExportClip={(c) => setSelectedExportClip(c)}
        />

        <TeamVideoModal
          clip={selectedTeamClip}
          onClose={() => setSelectedTeamClip(null)}
          onExportClip={(c) => setSelectedExportClip(c)}
        />

        <SocialExportModal
          clip={selectedExportClip}
          isOpen={!!selectedExportClip}
          onClose={() => setSelectedExportClip(null)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBucketModal={() => setIsBucketModalOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onSwitchToTeam={() => handleSwitchPortal('team')}
        pendingReviewCount={pendingReviewCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Tab 1: Content Library (Starts directly with the Grid!) */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            
            {/* Filter Bar & View Controls - Simple & Direct */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-md border border-slate-200/90 shadow-sm">
              
              {/* Category / Folder Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-[#002D62] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({clips.length})
                </button>

                {CATEGORIES.map(cat => {
                  const count = clips.filter(c => c.skillCategory === cat).length;
                  const isInterview = cat === 'Interviews';
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap flex items-center gap-1 ${
                        selectedCategory === cat
                          ? isInterview ? 'bg-[#FFC72C] text-[#002D62] shadow-xs' : 'bg-[#002D62] text-white shadow-xs'
                          : isInterview ? 'bg-amber-100/70 text-[#002D62] hover:bg-amber-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>

              {/* View Switcher: Grid vs Drive Table */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-sm border border-slate-200 text-xs">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2.5 py-1 font-semibold flex items-center gap-1 rounded-sm transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-[#002D62] text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Grid View"
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
                    title="Drive Table View"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>List</span>
                  </button>
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-sm text-xs text-slate-800 font-medium focus:outline-none focus:border-[#002D62]"
                >
                  <option value="all">All Statuses</option>
                  <option value="coach_approved">Approved</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="ready_to_post">Ready to Post</option>
                </select>
              </div>

            </div>

            {/* Video Content: Starts with the Grid! */}
            {filteredClips.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-md p-10 text-center space-y-2.5 shadow-sm">
                <Film className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">No Clips Found</h3>
                <p className="text-xs text-slate-500">
                  No video clips matched your search or category filter.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#002D62] text-white font-bold text-xs rounded-sm hover:bg-[#001f44] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Clip
                </button>
              </div>
            ) : viewMode === 'table' ? (
              <DriveTableView
                clips={filteredClips}
                onSelectClip={(c) => setSelectedClip(c)}
                onExportClip={(c) => setSelectedExportClip(c)}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClips.map((clip) => (
                  <ClipCard
                    key={clip.id}
                    clip={clip}
                    onSelect={(c) => setSelectedClip(c)}
                    onExportClip={(c) => setSelectedExportClip(c)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Additional Features (Houses Coach Review, Schedule, Tryouts & Overview) */}
        {activeTab === 'features' && (
          <div className="space-y-5">
            
            {/* Feature Sub-Navigation Tabs - Clean Rectangles */}
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-md border border-slate-200 shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveFeature('coach')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeFeature === 'coach'
                    ? 'bg-[#002D62] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#FFC72C]" />
                Coach Alexis Vano Review Queue
                {pendingReviewCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-[#FFC72C] text-[#002D62] text-[10px] font-black rounded-sm">
                    {pendingReviewCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveFeature('schedule')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeFeature === 'schedule'
                    ? 'bg-[#002D62] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#FFC72C]" />
                Team Schedule & Events
              </button>

              <button
                onClick={() => setActiveFeature('tryouts')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeFeature === 'tryouts'
                    ? 'bg-[#002D62] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#FFC72C]" />
                Tryout Prep & Curriculum
              </button>
            </div>

            {/* Metrics Overview housed inside Features */}
            <MetricsOverview
              clips={clips}
              events={events}
            />

            {/* Sub-Feature 1: Coach Review */}
            {activeFeature === 'coach' && (
              <CoachReviewTab
                clips={clips}
                onSelectClip={(c) => setSelectedClip(c)}
                onUpdateClip={handleUpdateClip}
              />
            )}

            {/* Sub-Feature 2: Schedule & Events */}
            {activeFeature === 'schedule' && (
              <CalendarView
                events={events}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {/* Sub-Feature 3: Tryout Prep */}
            {activeFeature === 'tryouts' && (
              <TryoutCurriculum
                onSelectClip={(c) => setSelectedClip(c)}
                clips={clips}
              />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002D62]">UNH Chargers Cheerleading</span>
            <span>• Content Vault & Media Management</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <a 
              href="https://newhavenchargers.com/sports/cheerleading" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#002D62] underline"
            >
              newhavenchargers.com/sports/cheerleading
            </a>
            <span>•</span>
            <button 
              onClick={() => setIsBucketModalOpen(true)}
              className="hover:text-[#002D62] underline"
            >
              Bucket Storage Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VideoModal
        clip={selectedClip}
        onClose={() => setSelectedClip(null)}
        onUpdateClip={handleUpdateClip}
        onDeleteClip={handleDeleteClip}
        onExportClip={(c) => setSelectedExportClip(c)}
      />

      <SocialExportModal
        clip={selectedExportClip}
        isOpen={!!selectedExportClip}
        onClose={() => setSelectedExportClip(null)}
      />

      <AddClipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddClip={handleAddClip}
      />

      <BucketHelperModal
        isOpen={isBucketModalOpen}
        onClose={() => setIsBucketModalOpen(false)}
        publicPrefix={bucketPrefix}
        onSavePrefix={handleSaveBucketPrefix}
      />

    </div>
  );
}

export default App;
