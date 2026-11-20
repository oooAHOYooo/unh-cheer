import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Folder, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface BucketHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicPrefix: string;
  onSavePrefix: (prefix: string) => void;
}

export const BucketHelperModal: React.FC<BucketHelperModalProps> = ({
  isOpen,
  onClose,
  publicPrefix,
  onSavePrefix,
}) => {
  if (!isOpen) return null;

  const [prefixInput, setPrefixInput] = useState(publicPrefix);
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrefix(prefixInput.trim());
    onClose();
  };

  const handleTestUrl = () => {
    if (!testUrl.trim()) return;
    setTestResult('testing');
    const video = document.createElement('video');
    video.src = testUrl.trim();
    video.onloadeddata = () => {
      setTestResult('success');
    };
    video.onerror = () => {
      setTestResult('error');
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white border border-slate-300 rounded-md w-full max-w-xl flex flex-col overflow-hidden shadow-xl text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#002D62] text-white">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-[#FFC72C]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              MP4 Storage Bucket Setup
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-sm text-blue-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          <div className="bg-blue-50 border-l-4 border-[#002D62] p-3 text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900 mb-0.5">
              How Video Hosting Works
            </p>
            <p className="text-slate-600">
              This site is hosted on Netlify, while high-definition MP4 clips live inside your cloud bucket (Cloudflare R2, AWS S3, or Supabase). As you finish clips of stunts or backflips, paste the public MP4 URL to stream them directly.
            </p>
          </div>

          {/* Folder Guide */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-[#002D62]" />
              Recommended Bucket Structure:
            </h4>
            <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200 font-mono text-[11px] text-slate-700 space-y-0.5">
              <div>unh-cheer-bucket/</div>
              <div className="pl-4 text-[#002D62]">├── tumbling/        <span className="text-slate-400 font-sans"># Backflips, standing tucks, passes</span></div>
              <div className="pl-4 text-[#002D62]">├── stunts/          <span className="text-slate-400 font-sans"># Extensions, libs, partner stunts</span></div>
              <div className="pl-4 text-[#002D62]">├── pyramids/        <span className="text-slate-400 font-sans"># Transitions & routines</span></div>
              <div className="pl-4 text-[#002D62]">└── gameday/         <span className="text-slate-400 font-sans"># DellaCamera Stadium sidelines</span></div>
            </div>
          </div>

          {/* Bucket URL Prefix Form */}
          <form onSubmit={handleSave} className="space-y-2 pt-2 border-t border-slate-200">
            <label className="block font-bold uppercase tracking-wider text-slate-600">
              Default Bucket Base URL Prefix (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://pub-xxxxxx.r2.dev/unh-cheer"
                value={prefixInput}
                onChange={(e) => setPrefixInput(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-sm font-mono text-xs text-slate-900 focus:outline-none focus:border-[#002D62]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#002D62] hover:bg-[#001f44] text-white font-bold rounded-sm shadow-sm transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              When set, you can type short keys like <code className="text-slate-700">tumbling/backflip.mp4</code>.
            </p>
          </form>

          {/* Test Link */}
          <div className="pt-2 border-t border-slate-200 space-y-1.5">
            <label className="block font-bold uppercase tracking-wider text-slate-600">
              Quick Test an MP4 Link:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste MP4 URL to verify playback..."
                value={testUrl}
                onChange={(e) => {
                  setTestUrl(e.target.value);
                  setTestResult('idle');
                }}
                className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-sm font-mono text-xs text-slate-900 focus:outline-none focus:border-[#002D62]"
              />
              <button
                type="button"
                onClick={handleTestUrl}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-sm"
              >
                Test
              </button>
            </div>

            {testResult === 'testing' && (
              <span className="text-amber-600 text-xs">Connecting...</span>
            )}
            {testResult === 'success' && (
              <span className="text-emerald-700 text-xs flex items-center gap-1 font-bold">
                <Check className="w-3.5 h-3.5" /> Video link is working and accessible!
              </span>
            )}
            {testResult === 'error' && (
              <span className="text-rose-600 text-xs flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Could not load video. Check CORS / public access on your bucket.
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
