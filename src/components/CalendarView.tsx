import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  X,
  Trash2
} from 'lucide-react';
import { CheerEvent, EventType } from '../types/cheer';

interface CalendarViewProps {
  events: CheerEvent[];
  onAddEvent: (event: CheerEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('game_day');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('1:00 PM');
  const [location, setLocation] = useState('Ralph F. DellaCamera Stadium');
  const [description, setDescription] = useState('');

  const filteredEvents = events.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventBadge = (evtType: EventType) => {
    switch (evtType) {
      case 'game_day':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-bold bg-[#FFC72C]/20 text-[#002D62] border border-[#FFC72C]/40 uppercase tracking-wider">
            <Trophy className="w-3 h-3 text-[#002D62]" /> Game Day
          </span>
        );
      case 'practice':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-bold bg-blue-100 text-[#002D62] border border-blue-200 uppercase tracking-wider">
            <Users className="w-3 h-3" /> Practice Drill
          </span>
        );
      case 'competition':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200 uppercase tracking-wider">
            Competition
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
            Event
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
    };

    onAddEvent(newEvent);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-md border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#002D62] uppercase tracking-wide flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#002D62]" />
            Charger Cheer Schedule
          </h2>
          <p className="text-xs text-slate-600">
            Game days, practice filming sessions, and campus showcase dates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Buttons - No Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-sm text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors ${
                filterType === 'all' ? 'bg-[#002D62] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('game_day')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors ${
                filterType === 'game_day' ? 'bg-[#002D62] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Games
            </button>
            <button
              onClick={() => setFilterType('practice')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors ${
                filterType === 'practice' ? 'bg-[#002D62] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practices
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 bg-[#002D62] hover:bg-[#001f44] text-white font-bold text-xs rounded-sm flex items-center gap-1 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Event
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2.5">
        {filteredEvents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-xs text-slate-500">
            No events found.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-white border border-slate-200/90 rounded-md p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getEventBadge(event.type)}
                  <h3 className="text-sm font-bold text-slate-900">
                    {event.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span className="font-mono text-slate-700 font-semibold">
                    {event.date}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-1 font-mono text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {event.time}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {event.location}
                    </span>
                  )}
                </div>

                {event.description && (
                  <p className="text-xs text-slate-600 pt-0.5">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end shrink-0">
                <button
                  onClick={() => {
                    if (confirm(`Remove "${event.title}"?`)) {
                      onDeleteEvent(event.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-md w-full max-w-md p-5 shadow-xl space-y-3.5 text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-[#002D62] uppercase tracking-wide">
                Add Schedule Event
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Football Game Day vs Southern Conn"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Event Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
                  >
                    <option value="game_day">🏆 Game Day</option>
                    <option value="practice">👥 Practice</option>
                    <option value="competition">✨ Competition</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="1:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Ralph F. DellaCamera Stadium"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes for filming or routine schedule..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#002D62] hover:bg-[#001f44] text-white font-bold rounded-sm shadow-sm"
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
