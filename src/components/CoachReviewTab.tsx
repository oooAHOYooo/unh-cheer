import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  MessageSquare, 
  Star, 
  Sparkles,
  Filter,
  Check,
  Send
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
  const [coachNotesInput, setCoachNotesInput] = useState<{ [id: string]: string }>({});

  const filteredClips = clips.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const handleQuickStatusChange = (clip: Clip, newStatus: ReviewStatus) => {
    const updated: Clip = {
      ...clip,
      status: newStatus,
      coachFeedback: coachNotesInput[clip.id] || clip.coachFeedback,
    };
    onUpdateClip(updated);
  };

  const handleSaveNotes = (clip: Clip) => {
    const updated: Clip = {
      ...clip,
      coachFeedback: coachNotesInput[clip.id] || clip.coachFeedback,
    };
    onUpdateClip(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Banner / Instructions */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border border-blue-900/50 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white">Head Coach Review Queue</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Collaborative portal for coach evaluations. Review technique on tumbling passes, stunt stability, and pyramid transitions before clips are released to team social media.
            </p>
          </div>

          {/* Quick status filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All ({clips.length})
            </button>
            <button
              onClick={() => setFilterStatus('needs_review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filterStatus === 'needs_review'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Pending ({clips.filter(c => c.status === 'needs_review').length})
            </button>
            <button
              onClick={() => setFilterStatus('coach_approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filterStatus === 'coach_approved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approved ({clips.filter(c => c.status === 'coach_approved').length})
            </button>
            <button
              onClick={() => setFilterStatus('revision_requested')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filterStatus === 'revision_requested'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retakes ({clips.filter(c => c.status === 'revision_requested').length})
            </button>
          </div>
        </div>
      </div>

      {/* List of Clips for Review */}
      {filteredClips.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white mb-1">Queue Clear</h3>
          <p className="text-xs text-slate-400">No clips match the selected review filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredClips.map((clip) => {
            const currentNote = coachNotesInput[clip.id] !== undefined ? coachNotesInput[clip.id] : (clip.coachFeedback || '');
            
            return (
              <div 
                key={clip.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all flex flex-col md:flex-row gap-5"
              >
                {/* Left Thumbnail & Quick Play */}
                <div 
                  onClick={() => onSelectClip(clip)}
                  className="relative w-full md:w-56 aspect-video bg-black rounded-lg overflow-hidden shrink-0 cursor-pointer group"
                >
                  <img 
                    src={clip.thumbnailUrl || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'} 
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-white">
                    {clip.duration || '0:15'} • {clip.aspectRatio}
                  </span>
                </div>

                {/* Center Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {clip.skillCategory}
                      </span>
                      <h3 
                        onClick={() => onSelectClip(clip)}
                        className="text-base font-bold text-white hover:text-amber-400 cursor-pointer transition-colors"
                      >
                        {clip.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Recorded: {clip.dateRecorded}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-slate-400">Athletes:</span> {clip.athletes?.join(', ') || 'Team'}
                  </p>

                  {/* Coach Notes Input */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                        Coach Coaching Notes & Corrections:
                      </label>
                      {clip.coachRating && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>Rating: {clip.coachRating}/5</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={currentNote}
                        onChange={(e) => setCoachNotesInput({ ...coachNotesInput, [clip.id]: e.target.value })}
                        placeholder="Add coaching feedback (e.g. 'Keep chest up on the landing', 'Great power')..."
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                      />
                      <button
                        onClick={() => handleSaveNotes(clip)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="md:w-48 flex flex-col justify-between pt-3 md:pt-0 md:border-l md:border-slate-800 md:pl-5 space-y-2 shrink-0">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Coach Decision:
                    </span>
                    
                    <button
                      onClick={() => handleQuickStatusChange(clip, 'coach_approved')}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        clip.status === 'coach_approved'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                          : 'bg-slate-800/80 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Clip
                    </button>

                    <button
                      onClick={() => handleQuickStatusChange(clip, 'ready_to_post')}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        clip.status === 'ready_to_post'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                          : 'bg-slate-800/80 hover:bg-purple-950/60 text-purple-300 border border-purple-500/20'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Ready for Social
                    </button>

                    <button
                      onClick={() => handleQuickStatusChange(clip, 'revision_requested')}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        clip.status === 'revision_requested'
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'bg-slate-800/80 hover:bg-rose-950/60 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Request Retake
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectClip(clip)}
                    className="text-xs text-center text-slate-400 hover:text-white py-1 transition-colors"
                  >
                    Open Slow-Mo Analyzer →
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
