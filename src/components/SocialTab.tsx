import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import { Clip } from '../types/cheer';

interface SocialTabProps {
  clips: Clip[];
  onSelectClip: (clip: Clip) => void;
  onMarkPosted: (clipId: string) => void;
}

export const SocialTab: React.FC<SocialTabProps> = ({
  clips,
  onSelectClip,
  onMarkPosted,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedHashtags, setCopiedHashtags] = useState<string | null>(null);

  const readyClips = clips.filter(c => c.status === 'ready_to_post' || c.status === 'coach_approved');
  const postedClips = clips.filter(c => c.status === 'posted');

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyTags = (tagBundle: string, key: string) => {
    navigator.clipboard.writeText(tagBundle);
    setCopiedHashtags(key);
    setTimeout(() => setCopiedHashtags(null), 2000);
  };

  const hashtagBundles = [
    {
      title: 'Tumbling & Backflips',
      tags: '#UNHCheer #ChargerPride #CollegeCheer #Tumbling #Backflip #Acrobatics #GymnasticsDrills #NCAcheer',
    },
    {
      title: 'Stunts & Pyramids',
      tags: '#UNHCheer #ChargerNation #CheerStunts #CoedStunts #CheerPyramid #StuntSquad #FlyerLife',
    },
    {
      title: 'Game Day & Halftime',
      tags: '#UNHCheer #ChargerPride #GameDay #CollegeFootball #CollegeHoops #SidelineVibes #HalftimeShow',
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 border border-purple-900/50 rounded-2xl p-5 shadow-lg">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Social Media Content Staging & Captions
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Pre-approved video clips ready for distribution to TikTok, Instagram Reels, and YouTube Shorts. Copy captions with one click, track what’s live, and utilize curated UNH cheer hashtag bundles.
        </p>
      </div>

      {/* Hashtag Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {hashtagBundles.map((bundle, idx) => (
          <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-400">{bundle.title}</span>
                <button
                  onClick={() => copyTags(bundle.tags, `bundle-${idx}`)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedHashtags === `bundle-${idx}` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copiedHashtags === `bundle-${idx}` ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono leading-relaxed line-clamp-2">
                {bundle.tags}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Staged & Ready Clips */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-pink-400" />
          Clips Ready to Publish ({readyClips.length})
        </h3>

        {readyClips.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            No clips are marked "Ready to Post" yet. Approve clips in the Clips Vault or Coach Tab first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readyClips.map((clip) => (
              <div 
                key={clip.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {clip.skillCategory}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {clip.aspectRatio} • {clip.duration || '0:15'}
                    </span>
                  </div>

                  <h4 
                    onClick={() => onSelectClip(clip)}
                    className="text-base font-bold text-white hover:text-amber-300 cursor-pointer transition-colors mb-2"
                  >
                    {clip.title}
                  </h4>

                  {/* Caption Box */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed relative">
                    <p className="line-clamp-3">{clip.captionDraft || 'No caption draft available.'}</p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectClip(clip)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors"
                    >
                      ▶ Preview MP4
                    </button>
                    <button
                      onClick={() => copyText(clip.captionDraft || '', clip.id)}
                      className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/30 rounded font-medium flex items-center gap-1 transition-colors"
                    >
                      {copiedId === clip.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === clip.id ? 'Copied!' : 'Copy Caption'}
                    </button>
                  </div>

                  <button
                    onClick={() => onMarkPosted(clip.id)}
                    className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark as Posted
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Previously Posted Archive */}
      {postedClips.length > 0 && (
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Live / Already Posted on Socials ({postedClips.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {postedClips.map((clip) => (
              <div 
                key={clip.id}
                onClick={() => onSelectClip(clip)}
                className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-emerald-400">✓ Live</span>
                  <span>{clip.dateRecorded}</span>
                </div>
                <h5 className="font-bold text-white text-xs truncate">{clip.title}</h5>
                <span className="text-[10px] text-slate-500">{clip.skillCategory}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
