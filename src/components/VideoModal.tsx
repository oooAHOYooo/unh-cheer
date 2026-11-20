import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  Trash2, 
  MessageSquare,
  Database,
  ExternalLink
} from 'lucide-react';
import { Clip, ReviewStatus } from '../types/cheer';

interface VideoModalProps {
  clip: Clip | null;
  onClose: () => void;
  onUpdateClip: (updated: Clip) => void;
  onDeleteClip: (id: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  clip,
  onClose,
  onUpdateClip,
  onDeleteClip,
}) => {
  if (!clip) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Form states for coach review & video URL
  const [status, setStatus] = useState<ReviewStatus>(clip.status);
  const [feedback, setFeedback] = useState<string>(clip.coachFeedback || '');
  const [videoUrlInput, setVideoUrlInput] = useState<string>(clip.videoUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setStatus(clip.status);
    setFeedback(clip.coachFeedback || '');
    setVideoUrlInput(clip.videoUrl || '');
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

  const handleSaveDetails = () => {
    const updated: Clip = {
      ...clip,
      status,
      coachFeedback: feedback.trim() || undefined,
      videoUrl: videoUrlInput.trim() || undefined,
    };
    onUpdateClip(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(clip.captionDraft || '');
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      
      {/* Modal Container */}
      <div className="bg-white border border-slate-300 rounded-md w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-xl">
        
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
          <button 
            onClick={onClose}
            className="p-1 rounded-sm text-blue-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0 text-slate-800">
          
          {/* Left: Thumbnail & Video Player (7 cols) */}
          <div className="md:col-span-7 p-4 bg-slate-900 flex flex-col justify-between text-white border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              <div className="relative aspect-video bg-black rounded-sm overflow-hidden flex items-center justify-center">
                {videoUrlInput ? (
                  <video
                    ref={videoRef}
                    src={videoUrlInput}
                    poster={clip.thumbnailUrl}
                    loop={isLooping}
                    muted={isMuted}
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={togglePlay}
                  />
                ) : (
                  <img 
                    src={clip.thumbnailUrl} 
                    alt={clip.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Play indicator */}
                {videoUrlInput && !isPlaying && (
                  <div 
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-md bg-[#FFC72C] text-[#002D62] flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 fill-[#002D62] ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Playback Controls (only if video URL exists) */}
              {videoUrlInput && (
                <div className="mt-3 flex items-center justify-between bg-slate-800/90 p-2 rounded-sm text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={togglePlay}
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-sm text-xs font-semibold"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1 ${
                        isLooping ? 'bg-[#FFC72C] text-[#002D62]' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3" /> Loop
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 text-slate-300 hover:text-white"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Slow Motion Technique Buttons */}
                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] text-slate-400 mr-1">Speed:</span>
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

            {/* Bottom details */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Athletes:</span>
                <span className="text-white font-medium">{clip.athletes.join(', ')}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span>Recorded:</span>
                <span className="text-slate-300">{clip.dateRecorded}</span>
              </div>
              {clip.bucketKey && (
                <div className="flex justify-between font-mono text-[11px]">
                  <span>Bucket Key:</span>
                  <span className="text-blue-300">{clip.bucketKey}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Coach Notes & Details (5 cols) */}
          <div className="md:col-span-5 p-5 bg-white flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              {/* Video MP4 Link Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  MP4 Bucket Video Link
                </label>
                <input
                  type="url"
                  placeholder="Paste direct MP4 URL (e.g. from R2 or S3)..."
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs font-mono text-slate-900 focus:outline-none focus:border-[#002D62]"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Leave blank to just show the thumbnail until clip is ready.
                </p>
              </div>

              {/* Coach Review Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Coach Review Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs font-medium text-slate-900 focus:outline-none focus:border-[#002D62]"
                >
                  <option value="needs_review">⏳ Needs Review</option>
                  <option value="coach_approved">✅ Coach Approved</option>
                  <option value="ready_to_post">🚀 Ready to Post</option>
                  <option value="revision_requested">🔄 Needs Retake</option>
                </select>
              </div>

              {/* Coach Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Head Coach Alexis Vano Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  placeholder="Leave feedback on form, landing, or timing..."
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-none focus:border-[#002D62]"
                />
              </div>

              {/* Caption Draft */}
              {clip.captionDraft && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
                    <span>Draft Caption</span>
                    <button
                      onClick={copyCaption}
                      className="text-[#002D62] hover:underline flex items-center gap-1 font-semibold normal-case"
                    >
                      {copiedCaption ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedCaption ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {clip.captionDraft}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm(`Remove "${clip.title}" from library?`)) {
                    onDeleteClip(clip.id);
                    onClose();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>

              <div className="flex items-center space-x-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-1.5 bg-[#002D62] hover:bg-[#001f44] text-white text-xs font-bold rounded-sm shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
