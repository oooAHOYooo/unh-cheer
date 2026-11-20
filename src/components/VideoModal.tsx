import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Share2,
  Sliders,
  Calendar,
  Layers
} from 'lucide-react';
import { Clip, ReviewStatus, SocialPlatform } from '../types/cheer';

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
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Form states for coach review
  const [status, setStatus] = useState<ReviewStatus>(clip.status);
  const [feedback, setFeedback] = useState<string>(clip.coachFeedback || '');
  const [rating, setRating] = useState<number>(clip.coachRating || 5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setStatus(clip.status);
    setFeedback(clip.coachFeedback || '');
    setRating(clip.coachRating || 5);
  }, [clip]);

  // Adjust playback rate when speed state changes
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

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSaveCoachReview = () => {
    const updated: Clip = {
      ...clip,
      status,
      coachFeedback: feedback,
      coachRating: rating,
    };
    onUpdateClip(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copyToClipboard = (text: string, type: 'caption' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'caption') {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 shrink-0">
              {clip.skillCategory}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate">
              {clip.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two column on desktop */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Video Player & Playback Controls (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 bg-black/40">
            <div>
              {/* Video Element Wrapper */}
              <div className="relative aspect-video sm:aspect-[16/10] bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-800">
                <video
                  ref={videoRef}
                  src={clip.videoUrl}
                  poster={clip.thumbnailUrl}
                  loop={isLooping}
                  muted={isMuted}
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                  onClick={togglePlay}
                />

                {/* Center Play overlay when paused */}
                {!isPlaying && (
                  <div 
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-400/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl transform hover:scale-105 transition-all">
                      <Play className="w-7 h-7 fill-slate-950 ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Player Controls */}
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      isLooping ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-slate-800 text-slate-400'
                    }`}
                    title="Toggle Loop"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Loop</span>
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Slow-mo Technique Analysis Controls */}
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Speed:</span>
                  {[0.5, 0.75, 1, 1.25].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2 py-0.5 rounded text-xs font-mono font-medium transition-all ${
                        playbackSpeed === spd
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={spd < 1 ? `Slow Motion ${spd}x` : `${spd}x speed`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clip Details summary */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Athletes:</span>
                <span className="text-slate-200 font-medium">{clip.athletes?.join(', ') || 'Team'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Target Platforms:</span>
                <div className="flex gap-1.5">
                  {clip.targetPlatforms?.map(p => (
                    <span key={p} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              {clip.bucketKey && (
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Bucket Key:</span>
                  <span className="text-blue-400 truncate max-w-[200px]" title={clip.bucketKey}>
                    {clip.bucketKey}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Coach Review & Social Drafting (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-slate-900 space-y-5">
            
            {/* Coach Collaboration Box */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  Coach Review & Approval
                </h3>
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="needs_review">⏳ Needs Review</option>
                  <option value="coach_approved">✅ Coach Approved</option>
                  <option value="ready_to_post">🚀 Ready to Post (Approved)</option>
                  <option value="revision_requested">🔄 Needs Revision / Retake</option>
                  <option value="posted">📢 Already Posted</option>
                </select>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Execution / Technique Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-2 font-mono">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Coach Feedback textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Coach Notes / Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  placeholder="e.g., Great height on the backflip! Lock out ankles on the landing..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              <button
                onClick={handleSaveCoachReview}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20"
              >
                Save Coach Review
              </button>
            </div>

            {/* Social Caption & Hashtags Draft */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  Social Media Caption Draft
                </h3>
                <button
                  onClick={() => copyToClipboard(clip.captionDraft || '', 'caption')}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCaption ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                {clip.captionDraft || 'No draft caption provided.'}
              </div>
            </div>

            {/* Bottom Actions: Copy MP4 link & Delete */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => copyToClipboard(clip.videoUrl, 'url')}
                className="text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded bg-slate-800/80 hover:bg-slate-800 transition-colors"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'URL Copied!' : 'Copy Direct MP4 Link'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${clip.title}"?`)) {
                    onDeleteClip(clip.id);
                    onClose();
                  }
                }}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1 px-2.5 rounded hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
