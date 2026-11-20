import React, { useState } from 'react';
import { X, Film, Check } from 'lucide-react';
import { Clip, SkillCategory, ReviewStatus } from '../types/cheer';

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
  'Game Day & Chants'
];

export const AddClipModal: React.FC<AddClipModalProps> = ({
  isOpen,
  onClose,
  onAddClip,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState<SkillCategory>('Tumbling & Flips');
  const [athletesInput, setAthletesInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [bucketKey, setBucketKey] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [duration, setDuration] = useState('0:15');
  const [status, setStatus] = useState<ReviewStatus>('needs_review');
  const [coachFeedback, setCoachFeedback] = useState('');
  const [captionDraft, setCaptionDraft] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a clip title.');
      return;
    }

    const athletes = athletesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Default authentic cheer photo if thumbnail is left blank
    const finalThumbnail = thumbnailUrl.trim() || 
      (skillCategory === 'Tumbling & Flips' 
        ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
        : skillCategory === 'Stunts & Partner'
        ? 'https://images.unsplash.com/photo-1508215885820-468079233ce9?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80');

    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      title: title.trim(),
      skillCategory,
      athletes: athletes.length > 0 ? athletes : ['New Haven Cheer Squad'],
      thumbnailUrl: finalThumbnail,
      videoUrl: videoUrl.trim() || undefined,
      bucketKey: bucketKey.trim() || undefined,
      duration: duration.trim() || '0:15',
      aspectRatio,
      status,
      coachFeedback: coachFeedback.trim() || undefined,
      dateRecorded: new Date().toISOString().slice(0, 10),
      captionDraft: captionDraft.trim() || `${title} ⚡️💙 #UNHCheer #ChargerPride #CollegeCheer`,
    };

    onAddClip(newClip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white border border-slate-300 rounded-md w-full max-w-lg flex flex-col overflow-hidden shadow-xl text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#002D62] text-white">
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-[#FFC72C]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Add Clip to Library
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-sm text-blue-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
              Clip Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Standing Back Tuck Drill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                Category
              </label>
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value as SkillCategory)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
              >
                <option value="needs_review">⏳ Needs Review</option>
                <option value="coach_approved">✅ Coach Approved</option>
                <option value="ready_to_post">🚀 Ready to Post</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                Athletes (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Darby Brown, Anthony Graziosa"
                value={athletesInput}
                onChange={(e) => setAthletesInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9')}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
              >
                <option value="9:16">9:16 (Vertical Reel / TikTok)</option>
                <option value="16:9">16:9 (Landscape)</option>
              </select>
            </div>
          </div>

          {/* Bucket Video Link */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
              MP4 Bucket Video Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://your-bucket-url.com/tumbling/backflip.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm font-mono text-[11px] text-slate-900 focus:outline-none focus:border-[#002D62]"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">
              If not uploaded yet, you can leave this empty and add it later.
            </p>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
              Custom Thumbnail Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://.../thumbnail.jpg (leave blank for auto photo)"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
            />
          </div>

          {/* Coach Notes */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
              Notes for Coach Alexis Vano
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Check landing on the flip..."
              value={coachFeedback}
              onChange={(e) => setCoachFeedback(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-[#002D62]"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#002D62] hover:bg-[#001f44] text-white font-bold rounded-sm shadow-sm transition-colors"
            >
              Save Clip
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
