import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { ClipCard } from './components/ClipCard';
import { VideoModal } from './components/VideoModal';
import { AddClipModal } from './components/AddClipModal';
import { CoachReviewTab } from './components/CoachReviewTab';
import { CalendarView } from './components/CalendarView';
import { SocialTab } from './components/SocialTab';
import { BucketHelperModal } from './components/BucketHelperModal';
import { INITIAL_CLIPS, INITIAL_EVENTS } from './data/initialData';
import { Clip, CheerEvent, SkillCategory, ReviewStatus } from './types/cheer';
import { Filter, SlidersHorizontal, Plus, Search, Sparkles, Film } from 'lucide-react';

const CATEGORIES: SkillCategory[] = [
  'Tumbling & Flips',
  'Stunts & Partner',
  'Pyramids',
  'Basket Tosses',
  'Jumps & Motions',
  'Game Day & Chants',
  'Halftime Routines',
  'Conditioning & Drills'
];

export function App() {
  // Persistence state
  const [clips, setClips] = useState<Clip[]>(() => {
    try {
      const saved = localStorage.getItem('unh_cheer_clips_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading clips from localStorage', e);
    }
    return INITIAL_CLIPS;
  });

  const [events, setEvents] = useState<CheerEvent[]>(() => {
    try {
      const saved = localStorage.getItem('unh_cheer_events_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading events from localStorage', e);
    }
    return INITIAL_EVENTS;
  });

  const [bucketPrefix, setBucketPrefix] = useState<string>(() => {
    return localStorage.getItem('unh_cheer_bucket_prefix') || '';
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'library' | 'coach' | 'calendar' | 'social'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unh_cheer_clips_v1', JSON.stringify(clips));
    } catch (e) {
      console.error('Failed to save clips', e);
    }
  }, [clips]);

  useEffect(() => {
    try {
      localStorage.setItem('unh_cheer_events_v1', JSON.stringify(events));
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
    // If bucketPrefix is configured and URL is relative, prepend prefix
    let finalClip = { ...newClip };
    if (bucketPrefix && !newClip.videoUrl.startsWith('http://') && !newClip.videoUrl.startsWith('https://')) {
      const cleanPrefix = bucketPrefix.replace(/\/$/, '');
      const cleanUrl = newClip.videoUrl.replace(/^\//, '');
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

  const handleMarkPosted = (clipId: string) => {
    setClips(clips.map(c => c.id === clipId ? { ...c, status: 'posted' } : c));
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
      team: 'UNH Cheerleading',
      clips,
      events,
      bucketPrefix
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unh-cheer-media-vault-${new Date().toISOString().slice(0, 10)}.json`;
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
        if (parsed.clips && Array.isArray(parsed.clips)) {
          setClips(parsed.clips);
        }
        if (parsed.events && Array.isArray(parsed.events)) {
          setEvents(parsed.events);
        }
        if (parsed.bucketPrefix) {
          setBucketPrefix(parsed.bucketPrefix);
        }
        alert('UNH Cheer content library successfully restored!');
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter clips for library tab
  const filteredClips = clips.filter(clip => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = clip.title.toLowerCase().includes(q);
      const matchCategory = clip.skillCategory.toLowerCase().includes(q);
      const matchAthletes = clip.athletes.some(a => a.toLowerCase().includes(q));
      const matchTags = clip.tags.some(t => t.toLowerCase().includes(q));
      const matchNotes = clip.coachFeedback?.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchAthletes && !matchTags && !matchNotes) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'all' && clip.skillCategory !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'all' && clip.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const pendingReviewCount = clips.filter(c => c.status === 'needs_review').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      
      {/* App Header */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Metrics Row */}
        <MetricsOverview
          clips={clips}
          events={events}
          onFilterStatus={(st) => {
            setSelectedStatus(st);
            setActiveTab('library');
          }}
        />

        {/* Tab 1: Clips Vault & Library */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            
            {/* Filter controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All Skills ({clips.length})
                </button>

                {CATEGORIES.map(cat => {
                  const count = clips.filter(c => c.skillCategory === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>

              {/* Status dropdown filter */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 font-medium">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="coach_approved">✅ Coach Approved</option>
                  <option value="needs_review">⏳ Needs Review</option>
                  <option value="ready_to_post">🚀 Ready to Post</option>
                  <option value="revision_requested">🔄 Needs Retake</option>
                  <option value="posted">📢 Posted</option>
                </select>
              </div>

            </div>

            {/* Clips Grid */}
            {filteredClips.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Film className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Clips Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No video clips matched your search or filter criteria. Try resetting filters or adding a new clip.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-300 transition-colors"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" /> Add Clip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

        {/* Tab 2: Coach Collaboration */}
        {activeTab === 'coach' && (
          <CoachReviewTab
            clips={clips}
            onSelectClip={(c) => setSelectedClip(c)}
            onUpdateClip={handleUpdateClip}
          />
        )}

        {/* Tab 3: Events & Calendar */}
        {activeTab === 'calendar' && (
          <CalendarView
            events={events}
            clips={clips}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onSelectClip={(c) => setSelectedClip(c)}
          />
        )}

        {/* Tab 4: Social Media Staging */}
        {activeTab === 'social' && (
          <SocialTab
            clips={clips}
            onSelectClip={(c) => setSelectedClip(c)}
            onMarkPosted={handleMarkPosted}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">UNH CHEERLEADING</span>
            <span>• Content Vault & Media Management System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Ready for Netlify Deploy</span>
            <span>•</span>
            <button 
              onClick={() => setIsBucketModalOpen(true)}
              className="hover:text-amber-300 transition-colors"
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
