import React from 'react';
import { 
  Play, 
  MessageSquare, 
  User, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Clip, ReviewStatus } from '../types/cheer';

interface ClipCardProps {
  clip: Clip;
  onSelect: (clip: Clip) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({
  clip,
  onSelect,
}) => {
  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'coach_approved':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3" /> Needs Review
          </span>
        );
      case 'revision_requested':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <RotateCcw className="w-3 h-3" /> Retake
          </span>
        );
      case 'ready_to_post':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[11px] font-bold bg-blue-100 text-[#002D62] border border-blue-300">
            Ready to Post
          </span>
        );
    }
  };

  return (
    <div 
      onClick={() => onSelect(clip)}
      className="group bg-white border border-slate-200/90 hover:border-[#002D62] rounded-md overflow-hidden transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        <img 
          src={clip.thumbnailUrl} 
          alt={clip.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
          loading="lazy"
        />

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 flex items-center justify-center transition-colors">
          <div className="w-10 h-10 rounded-md bg-[#002D62]/90 group-hover:bg-[#002D62] text-white flex items-center justify-center shadow-md">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
        </div>

        {/* Top Tag */}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#002D62] text-white uppercase tracking-wider shadow-sm">
            {clip.skillCategory}
          </span>
        </div>

        {/* Bottom Tag */}
        <div className="absolute bottom-2 right-2">
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-sm bg-black/70 text-white">
            {clip.aspectRatio} {clip.duration && `• ${clip.duration}`}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#002D62] transition-colors line-clamp-1">
              {clip.title}
            </h3>
          </div>

          {/* Athletes */}
          {clip.athletes && clip.athletes.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{clip.athletes.join(', ')}</span>
            </div>
          )}

          {/* Coach Feedback Snippet */}
          {clip.coachFeedback && (
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-700 flex items-start gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#002D62] shrink-0 mt-0.5" />
              <p className="line-clamp-2 italic">
                "{clip.coachFeedback}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            {getStatusBadge(clip.status)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {clip.dateRecorded}
          </span>
        </div>

      </div>
    </div>
  );
};
