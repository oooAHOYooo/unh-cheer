import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  ExternalLink, 
  Folder, 
  ShieldCheck, 
  Play, 
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
  const [copiedText, setCopiedText] = useState<string | null>(null);

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

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">MP4 Cloud Bucket Setup</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Overview */}
          <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-4 text-slate-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Hosting Architecture: Bucket + Netlify
            </h4>
            <p className="text-slate-300 text-xs">
              This app is deployed on Netlify as a fast, responsive static web app. You upload your raw MP4 video files to any cloud storage bucket (Cloudflare R2, AWS S3, Supabase Storage, or Google Cloud Storage). Once uploaded, paste the public link into the Vault.
            </p>
          </div>

          {/* Quick Storage Options Recommendation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1">Option A: Cloudflare R2 (Recommended)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
                10 GB free storage, zero bandwidth/egress fees, and custom domain support (<code className="text-slate-300">media.unhcheer.com</code>).
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">★ Best for high video streaming</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-blue-400 block mb-1">Option B: AWS S3 / Supabase</span>
              <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
                Standard object storage with public read permissions or signed URLs. Fast upload via AWS console or Cyberduck.
              </p>
              <span className="text-[10px] text-blue-400 font-medium">★ Industry standard</span>
            </div>
          </div>

          {/* Recommended Folder Organization */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              Recommended Bucket Folder Structure:
            </h4>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div>unh-cheer-vault/</div>
              <div className="pl-4 text-amber-300">├── tumbling/        <span className="text-slate-500 font-sans"># Backflips, standing tucks, roundoffs</span></div>
              <div className="pl-4 text-blue-300">├── stunts/          <span className="text-slate-500 font-sans"># Coed extensions, libs, heel stretches</span></div>
              <div className="pl-4 text-indigo-300">├── pyramids/        <span className="text-slate-500 font-sans"># Full pyramid routines & transitions</span></div>
              <div className="pl-4 text-cyan-300">├── baskets/         <span className="text-slate-500 font-sans"># Basket tosses, kick fulls</span></div>
              <div className="pl-4 text-yellow-300">└── gameday/         <span className="text-slate-500 font-sans"># Sidelines, fight song, halftime</span></div>
            </div>
          </div>

          {/* Public URL Prefix Configuration */}
          <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Default Public Bucket Base URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://pub-xxxxxx.r2.dev/unh-cheer"
                  value={prefixInput}
                  onChange={(e) => setPrefixInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
                >
                  Save Prefix
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                When set, you can type short paths like <code className="text-slate-400">tumbling/backflip.mp4</code> when creating clips.
              </p>
            </div>
          </form>

          {/* Quick URL Tester */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-300 block">
              Test an MP4 Link Before Adding:
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste any MP4 URL to test playback..."
                value={testUrl}
                onChange={(e) => {
                  setTestUrl(e.target.value);
                  setTestResult('idle');
                }}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleTestUrl}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
              >
                Test Link
              </button>
            </div>

            {testResult === 'testing' && (
              <span className="text-amber-400 text-xs">Connecting to video stream...</span>
            )}
            {testResult === 'success' && (
              <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Video loaded successfully and is ready to stream!
              </span>
            )}
            {testResult === 'error' && (
              <span className="text-rose-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Failed to load. Check that the file exists and has public read / CORS enabled.
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
