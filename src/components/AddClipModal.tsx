import React, { useState } from 'react';
import { X, Plus, Sparkles, Film, Database, Check } from 'lucide-react';
import { Clip, SkillCategory, ReviewStatus, SocialPlatform } from '../types/cheer';

interface AddClipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClip: (clip: Clip) => void;
}

const CATEGORIES: SkillCategory[] = [
  'Tumbling & Flips',
  'Stunts & Partner',
  'Pyramids',
  'Basket Tosses',
  'Jumps & Motions',
  'Game Day & Chants',
  'Halftime Routines',
  'Conditioning & Drills'
];

const PLATFORMS: SocialPlatform[] = [
  'Instagram Reel',
  'TikTok',
  'YouTube Shorts',
  'Instagram Story',
  'X (Twitter)'
];

export const AddClipModal: React.FC<AddClipModalProps> = ({
  isOpen,
  onClose,
  onAddClip,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState<SkillCategory>('Tumbling & Flips');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [athletesInput, setAthletesInput] = useState('');
  const [duration, setDuration] = useState('0:15');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [targetPlatforms, setTargetPlatforms] = useState<SocialPlatform[]>(['Instagram Reel', 'TikTok']);
  const [status, setStatus] = useState<ReviewStatus>('needs_review');
  const [tagsInput, setTagsInput] = useState('');
  const [captionDraft, setCaptionDraft] = useState('');
  const [coachFeedback, setCoachFeedback] = useState('');
  const [bucketKey, setBucketKey] = useState('');

  const togglePlatform = (platform: SocialPlatform) => {
    if (targetPlatforms.includes(platform)) {
      setTargetPlatforms(targetPlatforms.filter(p => p !== platform));
    } else {
      setTargetPlatforms([...targetPlatforms, platform]);
    }
  };

  const handleFillSample = () => {
    setTitle('Full-In Backflip Dismount Drill');
    setSkillCategory('Tumbling & Flips');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setThumbnailUrl('https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80');
    setAthletesInput('Brianna, Chloe');
    setDuration('0:14');
    setAspectRatio('9:16');
    setTargetPlatforms(['TikTok', 'Instagram Reel']);
    setTagsInput('Backflip, Full-In, Dismount, Tumbling, High Energy');
    setCaptionDraft('Leveling up the difficulty! Check out this full-in rotation from practice today. 🌀⚡️ #UNHCheer #ChargerPride #CollegeCheer #Backflip');
    setCoachFeedback('Notice how the chest stays tall going into the flip. Ready for review!');
    setBucketKey('tumbling/2026-11-20-brianna-full-in.mp4');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      alert('Please provide at least a title and a video MP4 URL.');
      return;
    }

    const athletes = athletesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map(s => s.trim().replace(/^#/, ''))
      .filter(Boolean);

    // Default caption if left blank
    const finalCaption = captionDraft.trim() || 
      `${title} 💙💛 UNH Cheer in action! #UNHCheer #ChargerPride #CollegeCheer #${skillCategory.split(' ')[0]}`;

    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      title: title.trim(),
      skillCategory,
      athletes: athletes.length > 0 ? athletes : ['UNH Squad'],
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      duration: duration.trim() || '0:15',
      targetPlatforms,
      status,
      coachFeedback: coachFeedback.trim() || undefined,
      coachRating: status === 'coach_approved' ? 5 : undefined,
      tags: tags.length > 0 ? tags : [skillCategory.split(' ')[0], 'UNHCheer'],
      aspectRatio,
      dateRecorded: new Date().toISOString().slice(0, 10),
      captionDraft: finalCaption,
      bucketKey: bucketKey.trim() || undefined,
    };

    onAddClip(newClip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Add New Clip to Library</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleFillSample}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" /> Auto-fill Sample
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Clip Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Standing Back Tuck - Clean Landing Drill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Skill Category
              </label>
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value as SkillCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Initial Review Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              >
                <option value="needs_review">⏳ Needs Review</option>
                <option value="coach_approved">✅ Coach Approved</option>
                <option value="ready_to_post">🚀 Ready to Post</option>
                <option value="revision_requested">🔄 Needs Retake</option>
              </select>
            </div>
          </div>

          {/* Video MP4 URL & Bucket Key */}
          <div className="space-y-3 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-300">
                  Direct MP4 URL <span className="text-amber-400">*</span>
                </label>
                <span className="text-[11px] text-blue-400 flex items-center gap-1 font-normal">
                  <Database className="w-3 h-3" /> AWS S3 / Cloudflare R2 / Supabase
                </span>
              </div>
              <input
                type="url"
                required
                placeholder="https://your-bucket-url.com/clips/backflip-drill.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-400 mb-1">
                  Bucket Key / Folder Path (Optional)
                </label>
                <input
                  type="text"
                  placeholder="tumbling/2026-11-20-backflip.mp4"
                  value={bucketKey}
                  onChange={(e) => setBucketKey(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">
                  Thumbnail Poster URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://.../thumbnail.jpg"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Athletes & Duration & Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Athletes (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="Emma, Jordan, Tyler"
                value={athletesInput}
                onChange={(e) => setAthletesInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="0:15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9' | '1:1')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              >
                <option value="9:16">9:16 (Vertical TikTok/Reel)</option>
                <option value="16:9">16:9 (Landscape / YouTube)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>
          </div>

          {/* Target Platforms */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Target Social Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => {
                const isSelected = targetPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1 stroke-[3]" />}
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Skill & Drill Tags (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="Backflip, Tumbling, Clean Landing, Level 4"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Caption & Coach Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Draft Social Caption
              </label>
              <textarea
                rows={3}
                placeholder="Write hook and hashtags..."
                value={captionDraft}
                onChange={(e) => setCaptionDraft(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Notes for Head Coach
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Check landing and chest angle..."
                value={coachFeedback}
                onChange={(e) => setCoachFeedback(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold rounded-lg shadow-md transition-all active:scale-95"
            >
              Add Clip to Library
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
