import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Film, 
  Trophy, 
  Sparkles, 
  Users, 
  X,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { CheerEvent, EventType, Clip } from '../types/cheer';

interface CalendarViewProps {
  events: CheerEvent[];
  clips: Clip[];
  onAddEvent: (event: CheerEvent) => void;
  onDeleteEvent: (id: string) => void;
  onSelectClip: (clip: Clip) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  clips,
  onAddEvent,
  onDeleteEvent,
  onSelectClip,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('game_day');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('1:00 PM');
  const [location, setLocation] = useState('Charger Stadium / Gym');
  const [description, setDescription] = useState('');
  const [selectedClipIds, setSelectedClipIds] = useState<string[]>([]);

  const filteredEvents = events.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventBadge = (evtType: EventType) => {
    switch (evtType) {
      case 'game_day':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Trophy className="w-3 h-3" /> Game Day
          </span>
        );
      case 'competition':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3 h-3" /> Competition
          </span>
        );
      case 'practice':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Users className="w-3 h-3" /> Practice Drill
          </span>
        );
      case 'social_drop':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
            <Film className="w-3 h-3" /> Content Drop
          </span>
        );
      case 'team_meeting':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Clock className="w-3 h-3" /> Coach Meeting
          </span>
        );
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newEvent: CheerEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      type,
      date,
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      linkedClipIds: selectedClipIds.length > 0 ? selectedClipIds : undefined,
    };

    onAddEvent(newEvent);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setSelectedClipIds([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            UNH Cheer Schedule & Content Timeline
          </h2>
          <p className="text-xs text-slate-400">
            Sync practice schedules, game day appearances, and social media clip drop dates.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded font-medium ${filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('game_day')}
              className={`px-2.5 py-1 rounded font-medium ${filterType === 'game_day' ? 'bg-amber-400/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Games
            </button>
            <button
              onClick={() => setFilterType('practice')}
              className={`px-2.5 py-1 rounded font-medium ${filterType === 'practice' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Practices
            </button>
            <button
              onClick={() => setFilterType('social_drop')}
              className={`px-2.5 py-1 rounded font-medium ${filterType === 'social_drop' ? 'bg-pink-500/20 text-pink-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Drops
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Add Event
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3.5">
        {filteredEvents.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center">
            <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No events found for this filter.</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const linkedClips = clips.filter(c => event.linkedClipIds?.includes(c.id));

            return (
              <div 
                key={event.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {getEventBadge(event.type)}
                    <h3 className="text-base font-bold text-white">
                      {event.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 font-mono text-slate-300">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                      {event.date}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {event.location}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  {/* Linked Clips */}
                  {linkedClips.length > 0 && (
                    <div className="pt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Film className="w-3 h-3 text-amber-400" />
                        Linked Content Clips:
                      </span>
                      {linkedClips.map(clip => (
                        <button
                          key={clip.id}
                          onClick={() => onSelectClip(clip)}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-amber-400/50 text-[11px] text-amber-300 flex items-center gap-1 transition-colors"
                        >
                          ▶ {clip.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 justify-end shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                  <button
                    onClick={() => {
                      if (confirm(`Remove event "${event.title}"?`)) {
                        onDeleteEvent(event.id);
                      }
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                Add Event or Content Drop
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Football Game Day vs Southern Conn"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="game_day">🏆 Game Day</option>
                    <option value="practice">👥 Practice Drill</option>
                    <option value="competition">✨ Competition</option>
                    <option value="social_drop">📱 Social Media Drop</option>
                    <option value="team_meeting">📋 Coach Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Time / Window
                  </label>
                  <input
                    type="text"
                    placeholder="1:00 PM - 4:30 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="DellaCamera Stadium / Gym"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Description & Run of Show
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes for the team, performance timing, what routines to capture..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow-md"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
