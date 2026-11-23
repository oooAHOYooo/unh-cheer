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
import { INITIAL_CLIPS, INITIAL_EVENTS } from './data/initialData';
import { Clip, CheerEvent, SkillCategory } from './types/cheer';
import { Plus, Film, LayoutGrid, List, Folder, HardDrive, Download, Sparkles } from 'lucide-react';

const CATEGORIES: SkillCategory[] = [
  'Interviews',
  'Tumbling & Flips',
  'Stunts & Partner',
  'Pyramids',
  'Basket Tosses',
  'Game Day & Chants'
];

export function App() {
  // Persistence state with auto-merger for newly added interview master exports
  const [clips, setClips] = useState<Clip[]>(() => {
    try {
      const saved = localStorage.getItem('unh_cheer_clips_v4');
      if (saved) return JSON.parse(saved);
      const prev = localStorage.getItem('unh_cheer_clips_v3') || localStorage.getItem('unh_cheer_clips_v2');
      if (prev) {
        const parsed: Clip[] = JSON.parse(prev);
        const existingIds = new Set(parsed.map(c => c.id));
        const toAdd = INITIAL_CLIPS.filter(c => !existingIds.has(c.id));
        return [...toAdd, ...parsed];
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

  // UI state
  const [activeTab, setActiveTab] = useState<'library' | 'coach' | 'calendar' | 'tryouts'>('library');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unh_cheer_clips_v4', JSON.stringify(clips));
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
        pendingReviewCount={pendingReviewCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Metrics Overview */}
        <MetricsOverview
          clips={clips}
          events={events}
          onFilterStatus={(st) => {
            setSelectedStatus(st);
            setActiveTab('library');
          }}
        />

        {/* Tab 1: Content Library */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            
            {/* Google Drive Style Library Overview Banner */}
            <div className="bg-white border-l-4 border-[#002D62] p-4 rounded-md border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#002D62] text-white rounded-sm flex items-center gap-1">
                    <Folder className="w-3 h-3 text-[#FFC72C]" />
                    Media Library & Drive
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Full uncut interviews & practice footage
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Organized content vault with in-browser video playback and direct master MP4 download links for Coach Alexis Vano and the team.
                </p>
              </div>

              {/* View Switcher & Quick Stats */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  {interviewCount} Full Interviews ({interviewTotalMB} MB)
                </span>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-sm border border-slate-200 text-xs">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2 py-1 font-semibold flex items-center gap-1 rounded-sm transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-[#002D62] text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Grid Card View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>

                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-2 py-1 font-semibold flex items-center gap-1 rounded-sm transition-colors ${
                      viewMode === 'table' 
                        ? 'bg-[#002D62] text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Drive Table View (Name, Size, View, Download)"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Drive List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
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
                      {isInterview && <Sparkles className="w-3 h-3 text-[#002D62]" />}
                      {cat} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-sm text-xs text-slate-800 font-medium focus:outline-none focus:border-[#002D62]"
                >
                  <option value="all">All Statuses</option>
                  <option value="coach_approved">✅ Approved</option>
                  <option value="needs_review">⏳ Needs Review</option>
                  <option value="ready_to_post">🚀 Ready to Post</option>
                  <option value="revision_requested">🔄 Needs Retake</option>
                </select>
              </div>

            </div>

            {/* Clips View: Either Drive Table or Grid */}
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
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClips.map((clip) => (
                  <ClipCard
                    key={clip.id}
                    clip={clip}
                    onSelect={(c) => setSelectedClip(c)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Coach Review */}
        {activeTab === 'coach' && (
          <CoachReviewTab
            clips={clips}
            onSelectClip={(c) => setSelectedClip(c)}
            onUpdateClip={handleUpdateClip}
          />
        )}

        {/* Tab 3: Events & Schedule */}
        {activeTab === 'calendar' && (
          <CalendarView
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {/* Tab 4: Tryout Curriculum & Prep */}
        {activeTab === 'tryouts' && (
          <TryoutCurriculum
            onSelectClip={(c) => setSelectedClip(c)}
            clips={clips}
          />
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
