import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  MessageSquare,
  Check
} from 'lucide-react';
import { Clip, ReviewStatus } from '../types/cheer';

interface CoachReviewTabProps {
  clips: Clip[];
  onSelectClip: (clip: Clip) => void;
  onUpdateClip: (clip: Clip) => void;
}

export const CoachReviewTab: React.FC<CoachReviewTabProps> = ({
  clips,
  onSelectClip,
  onUpdateClip,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notesState, setNotesState] = useState<{ [id: string]: string }>({});

  const filteredClips = clips.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const handleStatusChange = (clip: Clip, newStatus: ReviewStatus) => {
    const updated: Clip = {
      ...clip,
      status: newStatus,
      coachFeedback: notesState[clip.id] !== undefined ? notesState[clip.id] : clip.coachFeedback,
    };
    onUpdateClip(updated);
  };

  const handleSaveNotes = (clip: Clip) => {
    const updated: Clip = {
      ...clip,
      coachFeedback: notesState[clip.id] !== undefined ? notesState[clip.id] : clip.coachFeedback,
    };
    onUpdateClip(updated);
  };

  return (
    <div className="space-y-5">
      
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-[#002D62] p-4 rounded-md shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#002D62] uppercase tracking-wide">
              Head Coach Review Portal
            </h2>
            <p className="text-xs text-slate-600">
              Collaboration queue with Coach Alexis Vano. Review technique, tumbling execution, and approve clips before they go live on social.
            </p>
          </div>

          {/* Simple Tab Filters - No Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#002D62] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({clips.length})
            </button>
            <button
              onClick={() => setFilterStatus('needs_review')}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                filterStatus === 'needs_review'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-amber-700 hover:bg-slate-200'
              }`}
            >
              Pending ({clips.filter(c => c.status === 'needs_review').length})
            </button>
            <button
              onClick={() => setFilterStatus('coach_approved')}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                filterStatus === 'coach_approved'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-emerald-800 hover:bg-slate-200'
              }`}
            >
              Approved ({clips.filter(c => c.status === 'coach_approved').length})
            </button>
            <button
              onClick={() => setFilterStatus('revision_requested')}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                filterStatus === 'revision_requested'
                  ? 'bg-rose-700 text-white'
                  : 'bg-slate-100 text-rose-800 hover:bg-slate-200'
              }`}
            >
              Retakes ({clips.filter(c => c.status === 'revision_requested').length})
            </button>
          </div>
        </div>
      </div>

      {/* Clips Review List */}
      <div className="space-y-3">
        {filteredClips.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-xs text-slate-500">
            No clips match the selected filter.
          </div>
        ) : (
          filteredClips.map((clip) => {
            const currentNote = notesState[clip.id] !== undefined ? notesState[clip.id] : (clip.coachFeedback || '');

            return (
              <div 
                key={clip.id}
                className="bg-white border border-slate-200/90 rounded-md p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start"
              >
                {/* Thumbnail */}
                <div 
                  onClick={() => onSelectClip(clip)}
                  className="relative w-full md:w-48 aspect-video bg-slate-900 rounded-sm overflow-hidden shrink-0 cursor-pointer group"
                >
                  <img 
                    src={clip.thumbnailUrl} 
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-sm bg-[#002D62] text-white flex items-center justify-center shadow-md">
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 text-[10px] font-mono bg-black/70 px-1 py-0.2 rounded-sm text-white">
                    {clip.duration || '0:15'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#002D62] text-white">
                        {clip.skillCategory}
                      </span>
                      <h3 
                        onClick={() => onSelectClip(clip)}
                        className="text-sm font-bold text-slate-900 hover:text-[#002D62] cursor-pointer transition-colors"
                      >
                        {clip.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {clip.dateRecorded}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Athletes:</span> {clip.athletes.join(', ')}
                  </p>

                  {/* Coach Notes Row */}
                  <div className="pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Coach Alexis Vano Feedback:
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={currentNote}
                        onChange={(e) => setNotesState({ ...notesState, [clip.id]: e.target.value })}
                        placeholder="Add coaching comment on form or landing..."
                        className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#002D62]"
                      />
                      <button
                        onClick={() => handleSaveNotes(clip)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm text-xs font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Decision Buttons */}
                <div className="w-full md:w-40 flex flex-col gap-1.5 shrink-0 pt-2 md:pt-0 md:border-l md:border-slate-100 md:pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Decision:
                  </span>

                  <button
                    onClick={() => handleStatusChange(clip, 'coach_approved')}
                    className={`w-full py-1 px-2.5 rounded-sm text-xs font-bold transition-colors ${
                      clip.status === 'coach_approved'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    ✓ Approve Clip
                  </button>

                  <button
                    onClick={() => handleStatusChange(clip, 'ready_to_post')}
                    className={`w-full py-1 px-2.5 rounded-sm text-xs font-bold transition-colors ${
                      clip.status === 'ready_to_post'
                        ? 'bg-[#002D62] text-white shadow-xs'
                        : 'bg-blue-50 text-[#002D62] hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    🚀 Ready to Post
                  </button>

                  <button
                    onClick={() => handleStatusChange(clip, 'revision_requested')}
                    className={`w-full py-1 px-2.5 rounded-sm text-xs font-bold transition-colors ${
                      clip.status === 'revision_requested'
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    ↺ Request Retake
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
