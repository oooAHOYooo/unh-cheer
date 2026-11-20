import React from 'react';
import { 
  Play, 
  MessageSquare, 
  Star, 
  Share2, 
  Clock, 
  User, 
  Tag, 
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Clip, ReviewStatus } from '../types/cheer';

interface ClipCardProps {
  clip: Clip;
  onSelect: (clip: Clip) => void;
  onQuickApprove?: (clipId: string) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({
  clip,
  onSelect,
  onQuickApprove,
}) => {
  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'coach_approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" /> Coach Approved
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> Needs Review
          </span>
        );
      case 'revision_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <RotateCcw className="w-3 h-3" /> Needs Retake
          </span>
        );
      case 'ready_to_post':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3 h-3" /> Ready to Post
          </span>
        );
      case 'posted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            ✓ Live on Social
          </span>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tumbling & Flips':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Stunts & Partner':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Pyramids':
        return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'Basket Tosses':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'Game Day & Chants':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div 
      onClick={() => onSelect(clip)}
      className="group bg-slate-900/70 border border-slate-800 hover:border-amber-400/50 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer flex flex-col"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden">
        {clip.thumbnailUrl ? (
          <img 
            src={clip.thumbnailUrl} 
            alt={clip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-600">
            <Play className="w-12 h-12 opacity-30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(clip.skillCategory)} backdrop-blur-md`}>
            {clip.skillCategory}
          </span>
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-black/60 text-slate-300 backdrop-blur-md">
            {clip.aspectRatio}
          </span>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div>
            {getStatusBadge(clip.status)}
          </div>
          {clip.duration && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md">
              <Clock className="w-3 h-3 text-slate-400" />
              {clip.duration}
            </span>
          )}
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1 mb-1.5">
            {clip.title}
          </h3>

          {/* Athletes */}
          {clip.athletes && clip.athletes.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
              <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{clip.athletes.join(', ')}</span>
            </div>
          )}

          {/* Coach Feedback Snippet */}
          {clip.coachFeedback && (
            <div className="mb-3 px-2.5 py-1.5 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <p className="line-clamp-2 italic text-slate-300">
                "{clip.coachFeedback}"
              </p>
            </div>
          )}
        </div>

        {/* Footer info: tags & platforms */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {clip.tags.slice(0, 2).map((t, idx) => (
              <span key={idx} className="text-[10px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded">
                #{t}
              </span>
            ))}
            {clip.tags.length > 2 && (
              <span className="text-[10px] text-slate-500">
                +{clip.tags.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            {clip.coachRating && (
              <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{clip.coachRating}</span>
              </div>
            )}
            <span className="text-[11px] text-slate-500 font-mono">
              {clip.dateRecorded.slice(5)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
