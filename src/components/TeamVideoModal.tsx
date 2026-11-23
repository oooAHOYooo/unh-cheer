import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Camera, 
  User, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Clip } from '../types/cheer';

interface TeamVideoModalProps {
  clip: Clip | null;
  onClose: () => void;
  onExportClip: (clip: Clip) => void;
}

export const TeamVideoModal: React.FC<TeamVideoModalProps> = ({
  clip,
  onClose,
  onExportClip,
}) => {
  if (!clip) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [clip]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    if (clip.videoUrl) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      
      {/* Container */}
      <div className="bg-white border border-slate-300 rounded-md w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#002D62] text-white">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#FFC72C] text-[#002D62] rounded-sm shrink-0">
              {clip.skillCategory}
            </span>
            <h2 className="text-base font-bold truncate">
              {clip.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {clip.videoUrl && (
              <>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 text-xs font-bold bg-[#FFC72C] hover:bg-yellow-400 text-[#002D62] rounded-sm flex items-center gap-1 transition-colors shadow-xs"
                  title="Download MP4 to your device"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={() => onExportClip(clip)}
                  className="px-2.5 py-1 text-xs font-bold bg-white text-[#002D62] hover:bg-blue-50 rounded-sm flex items-center gap-1 transition-colors shadow-xs border border-blue-200"
                  title="Export for Canva & Instagram"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#002D62]" />
                  <span>Canva & Social</span>
                </button>
              </>
            )}

            <button 
              onClick={onClose}
              className="p-1 rounded-sm text-blue-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player & Info */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0 text-slate-800">
          
          {/* Video Section (7 cols) */}
          <div className="md:col-span-7 p-4 bg-slate-900 flex flex-col justify-between text-white border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="relative aspect-video bg-black rounded-sm overflow-hidden flex items-center justify-center">
                {clip.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={clip.videoUrl}
                    poster={clip.thumbnailUrl}
                    loop={isLooping}
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    controls
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <p className="text-slate-400 text-xs">Video file is processing.</p>
                  </div>
                )}
              </div>

              {/* Slow Motion Controls for Athletes */}
              {clip.videoUrl && (
                <div className="mt-3 flex items-center justify-between text-xs bg-slate-800/80 p-2 rounded-sm border border-slate-700">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={togglePlay}
                      className="px-2 py-1 bg-[#002D62] hover:bg-[#001f44] text-white rounded-sm font-semibold flex items-center gap-1"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`px-2 py-1 rounded-sm flex items-center gap-1 font-semibold ${
                        isLooping ? 'bg-[#FFC72C] text-[#002D62]' : 'bg-slate-700 text-slate-300'
                      }`}
                      title="Continuous Loop"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Loop</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] text-slate-400 mr-1">Technique Speed:</span>
                    {[0.5, 0.75, 1].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          setPlaybackSpeed(spd);
                          if (videoRef.current) videoRef.current.playbackRate = spd;
                        }}
                        className={`px-1.5 py-0.5 rounded-sm text-[11px] font-mono font-bold ${
                          playbackSpeed === spd
                            ? 'bg-[#FFC72C] text-[#002D62]'
                            : 'bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video Specs Footer */}
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span>Format:</span>
                <span className="text-white">{clip.aspectRatio} High Definition</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span>Recorded:</span>
                <span className="text-slate-300">{clip.dateRecorded}</span>
              </div>
              {clip.fileSize && (
                <div className="flex justify-between font-mono text-[11px]">
                  <span>File Size:</span>
                  <span className="text-amber-300">{clip.fileSize}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details & Technique Coaching Section (5 cols) */}
          <div className="md:col-span-5 p-5 bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Clip Overview
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {clip.title}
                </h3>
              </div>

              {/* Athletes Involved */}
              {clip.athletes && clip.athletes.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#002D62]" />
                    Featured Athletes
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {clip.athletes.join(', ')}
                  </div>
                </div>
              )}

              {/* Coach Feedback / Technique Instruction */}
              {clip.coachFeedback && (
                <div className="bg-blue-50/70 p-3.5 rounded-md border border-blue-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#002D62] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#002D62]" />
                    Coach Alexis Vano Technique Cues
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed italic">
                    "{clip.coachFeedback}"
                  </p>
                </div>
              )}

              {/* Social Caption Draft */}
              {clip.captionDraft && (
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Ready Social Caption:
                  </div>
                  <p className="text-xs text-slate-700 font-mono text-[11px] leading-relaxed">
                    {clip.captionDraft}
                  </p>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onExportClip(clip)}
                className="w-full py-2 bg-[#002D62] hover:bg-[#001f44] text-white rounded-sm font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span>Canva & Instagram Social Hub</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
