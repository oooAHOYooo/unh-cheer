import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Copy, 
  Check, 
  Film, 
  Folder, 
  HardDrive, 
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Clip, ReviewStatus } from '../types/cheer';

interface DriveTableViewProps {
  clips: Clip[];
  onSelectClip: (clip: Clip) => void;
}

export const DriveTableView: React.FC<DriveTableViewProps> = ({
  clips,
  onSelectClip,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (clip: Clip) => {
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

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'coach_approved':
        return <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200">Approved</span>;
      case 'needs_review':
        return <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200">Needs Review</span>;
      case 'revision_requested':
        return <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-sm border border-rose-200">Retake</span>;
      case 'ready_to_post':
        return <span className="text-[11px] font-bold text-[#002D62] bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-200">Ready to Post</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-md overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">File Name / Title</th>
              <th className="py-3 px-3">Folder</th>
              <th className="py-3 px-3">Athletes</th>
              <th className="py-3 px-3">Size</th>
              <th className="py-3 px-3">Recorded</th>
              <th className="py-3 px-3">Coach Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clips.map((clip) => (
              <tr 
                key={clip.id}
                className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                onClick={() => onSelectClip(clip)}
              >
                {/* File Title & Icon */}
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-sm overflow-hidden shrink-0 relative flex items-center justify-center">
                      <img 
                        src={clip.thumbnailUrl} 
                        alt="" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                      />
                      <Play className="w-3 h-3 text-white absolute fill-white" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-[#002D62] block line-clamp-1">
                        {clip.title}
                      </span>
                      {clip.bucketKey && (
                        <span className="font-mono text-[10px] text-slate-400 block truncate max-w-xs">
                          {clip.bucketKey}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Folder / Category */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                    <Folder className="w-3 h-3 text-[#002D62]" />
                    {clip.folder || clip.skillCategory}
                  </span>
                </td>

                {/* Athletes */}
                <td className="py-3 px-3 text-slate-600 max-w-[150px] truncate">
                  {clip.athletes.join(', ')}
                </td>

                {/* Size */}
                <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                  {clip.fileSize || '—'}
                </td>

                {/* Recorded Date */}
                <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                  {clip.dateRecorded}
                </td>

                {/* Status */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {getStatusBadge(clip.status)}
                </td>

                {/* Actions: View, Download, Copy Link */}
                <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center space-x-1.5">
                    <button
                      onClick={() => onSelectClip(clip)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#002D62] bg-blue-50 hover:bg-blue-100 rounded-sm border border-blue-200 transition-colors"
                      title="View Video Player"
                    >
                      View
                    </button>

                    {clip.videoUrl ? (
                      <>
                        <button
                          onClick={() => handleDownload(clip)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-[#002D62] hover:bg-[#001f44] rounded-sm transition-colors flex items-center gap-1 shadow-xs"
                          title="Download Full Master MP4"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>

                        <button
                          onClick={() => copyUrl(clip.videoUrl || '', clip.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-sm border border-slate-200 hover:bg-slate-100 transition-colors"
                          title="Copy Direct MP4 Link"
                        >
                          {copiedId === clip.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400">Processing</span>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
