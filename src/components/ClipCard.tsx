import React from 'react';
import { 
  Play, 
  MessageSquare, 
  User, 
  Download,
  Share2,
  Film
} from 'lucide-react';
import { Clip } from '../types/cheer';

interface ClipCardProps {
  clip: Clip;
  onSelect: (clip: Clip) => void;
  onExportClip?: (clip: Clip) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({
  clip,
  onSelect,
  onExportClip,
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExportClip) {
      onExportClip(clip);
    } else if (clip.videoUrl) {
      const a = document.createElement('a');
      a.href = clip.videoUrl;
      a.download = `${clip.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div 
      onClick={() => onSelect(clip)}
      className="group bg-white border border-slate-200/90 hover:border-[#002D62] rounded-md overflow-hidden transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        {clip.thumbnailUrl ? (
          <img 
            src={clip.thumbnailUrl} 
            alt={clip.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
            loading="lazy"
          />
        ) : clip.videoUrl ? (
          <video
            src={`${clip.videoUrl}#t=1.0`}
            preload="metadata"
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#001f44] flex items-center justify-center text-blue-200">
            <Film className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 flex items-center justify-center transition-colors">
          <div className="w-10 h-10 rounded-md bg-[#002D62]/90 group-hover:bg-[#002D62] text-white flex items-center justify-center shadow-md">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
        </div>

        {/* Top Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#002D62] text-white uppercase tracking-wider shadow-sm">
            {clip.skillCategory}
          </span>
        </div>

        {/* Bottom Tag */}
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

      {/* Content Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#002D62] transition-colors line-clamp-1 mb-1">
            {clip.title}
          </h3>

          {/* Athletes / Participants */}
          {clip.athletes && clip.athletes.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{clip.athletes.join(', ')}</span>
            </div>
          )}

          {/* Feedback Snippet if any */}
          {clip.coachFeedback && (
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-700 flex items-start gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#002D62] shrink-0 mt-0.5" />
              <p className="line-clamp-2 italic text-[11px]">
                "{clip.coachFeedback}"
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 font-mono">
            {clip.dateRecorded}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(clip);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#002D62] bg-blue-50 hover:bg-blue-100 rounded-sm transition-colors border border-blue-200"
              title="View in Player"
            >
              <Play className="w-3 h-3 fill-[#002D62]" />
              <span>View</span>
            </button>

            {clip.videoUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-[#002D62] hover:bg-[#001f44] rounded-sm transition-colors shadow-xs"
                title="Download / Canva / Instagram Export"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            )}

            {onExportClip && clip.videoUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExportClip(clip);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#002D62] bg-[#FFC72C] hover:bg-yellow-400 rounded-sm transition-colors shadow-2xs"
                title="Canva & Instagram Social Hub"
              >
                <Share2 className="w-3 h-3" />
                <span className="hidden sm:inline">Social</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
