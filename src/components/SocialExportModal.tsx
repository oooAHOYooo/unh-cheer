import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Film, 
  Palette, 
  Camera, 
  Sparkles,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { Clip } from '../types/cheer';

interface SocialExportModalProps {
  clip: Clip | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialExportModal: React.FC<SocialExportModalProps> = ({
  clip,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !clip) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const captionText = clip.captionDraft || `${clip.title} 💙⚡️ UNH Cheer in action! #UNHCheer #ChargerPride #NewHavenChargers #CollegeCheer`;

  const handleDownloadMp4 = () => {
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

  const handleDownloadFrame = () => {
    if (clip.thumbnailUrl) {
      const a = document.createElement('a');
      a.href = clip.thumbnailUrl;
      a.download = `${clip.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_cover.jpg`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleOpenCanva = (type: 'reel' | 'post' | 'story') => {
    // Copy the direct video URL so user can paste into Canva's upload
    if (clip.videoUrl) {
      navigator.clipboard.writeText(clip.videoUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }

    let url = 'https://www.canva.com/create/instagram-reels/';
    if (type === 'post') url = 'https://www.canva.com/create/instagram-posts/';
    if (type === 'story') url = 'https://www.canva.com/create/instagram-stories/';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: clip.title,
          text: captionText,
          url: clip.videoUrl || window.location.href,
        });
        setShareStatus('Shared successfully!');
        setTimeout(() => setShareStatus(null), 3000);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: Copy caption and direct to Instagram
      handleCopyCaptionAndInstagram();
    }
  };

  const handleCopyCaptionAndInstagram = () => {
    navigator.clipboard.writeText(captionText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const handleOpenMetaBusinessSuite = () => {
    navigator.clipboard.writeText(captionText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
    window.open('https://business.facebook.com/creatorstudio', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-300 rounded-md w-full max-w-xl flex flex-col overflow-hidden shadow-2xl text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#002D62] text-white">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-[#FFC72C]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Download & Social Export Hub
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-sm text-blue-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          
          {/* Target File Info */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-md border border-slate-200">
            <div className="w-16 h-10 bg-slate-900 rounded-sm overflow-hidden shrink-0 relative flex items-center justify-center">
              <img 
                src={clip.thumbnailUrl} 
                alt="" 
                className="w-full h-full object-cover"
              />
              <Film className="w-3.5 h-3.5 text-white absolute" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-xs truncate">
                {clip.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                <span>{clip.fileSize || 'HD MP4'}</span>
                <span>•</span>
                <span>{clip.aspectRatio}</span>
                <span>•</span>
                <span>{clip.duration}</span>
              </div>
            </div>
          </div>

          {/* 1. Direct Downloads */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-600 block text-[11px]">
              1. Download Options
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleDownloadMp4}
                className="p-3 bg-white border border-slate-200 hover:border-[#002D62] rounded-md text-left transition-colors flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-[#002D62] flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-[#002D62]" />
                    Full Master MP4
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Raw 1080p file for editing or storage ({clip.fileSize || 'Full HD'})
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002D62] transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={handleDownloadFrame}
                className="p-3 bg-white border border-slate-200 hover:border-[#002D62] rounded-md text-left transition-colors flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-[#002D62] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#002D62]" />
                    Cover Frame (JPG)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Crisp still frame for Canva templates or Reel covers
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002D62] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* 2. Canva Design Export */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-600 block text-[11px]">
                2. Design in Canva
              </span>
              {copiedLink && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-sm border border-emerald-200">
                  ✓ MP4 link copied to clipboard!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleOpenCanva('reel')}
                className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 hover:border-[#002D62] rounded-md text-left transition-colors group"
              >
                <div className="font-bold text-[#002D62] flex items-center justify-between">
                  <span>Instagram Reel (9:16)</span>
                  <ExternalLink className="w-3 h-3 text-[#002D62]" />
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">
                  1080 × 1920 Canva canvas with video ready to insert
                </div>
              </button>

              <button
                onClick={() => handleOpenCanva('story')}
                className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 hover:border-[#002D62] rounded-md text-left transition-colors group"
              >
                <div className="font-bold text-[#002D62] flex items-center justify-between">
                  <span>Instagram Story</span>
                  <ExternalLink className="w-3 h-3 text-[#002D62]" />
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">
                  Full screen vertical format for game day stories
                </div>
              </button>

              <button
                onClick={() => handleOpenCanva('post')}
                className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 hover:border-[#002D62] rounded-md text-left transition-colors group"
              >
                <div className="font-bold text-[#002D62] flex items-center justify-between">
                  <span>Feed Post (1:1)</span>
                  <ExternalLink className="w-3 h-3 text-[#002D62]" />
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">
                  Square grid post with athletic graphics
                </div>
              </button>
            </div>
          </div>

          {/* 3. Connect to Instagram */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-600 block text-[11px]">
                3. Share to Instagram (@unewhavencheer)
              </span>
              {copiedCaption && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-sm border border-emerald-200">
                  ✓ Caption & hashtags copied!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Native Mobile Share / AirDrop to Instagram */}
              <button
                onClick={handleNativeShare}
                className="p-3 bg-white border border-slate-200 hover:border-[#002D62] rounded-md text-left transition-colors flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-[#002D62] flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#002D62]" />
                    Share to Instagram App
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Opens system share sheet to send video to Instagram on your phone or Mac
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002D62] transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Meta Business Suite / Creator Studio */}
              <button
                onClick={handleOpenMetaBusinessSuite}
                className="p-3 bg-white border border-slate-200 hover:border-[#002D62] rounded-md text-left transition-colors flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-[#002D62] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#002D62]" />
                    Schedule Reel on Meta
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Copies caption & opens Creator Studio to schedule @unewhavencheer post
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002D62] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Caption Preview Box */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] text-slate-700 flex items-start justify-between gap-2">
              <div className="font-mono line-clamp-2">
                <span className="font-bold text-[#002D62] font-sans">Ready Caption: </span>
                {captionText}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(captionText);
                  setCopiedCaption(true);
                  setTimeout(() => setCopiedCaption(false), 2000);
                }}
                className="text-[#002D62] font-bold shrink-0 hover:underline flex items-center gap-1 font-sans"
              >
                {copiedCaption ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            UNH Cheer • Ready for Canva & Instagram
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
