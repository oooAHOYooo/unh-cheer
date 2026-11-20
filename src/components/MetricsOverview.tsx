import React from 'react';
import { Film, CheckCircle2, AlertCircle, Calendar, Sparkles } from 'lucide-react';
import { Clip, CheerEvent } from '../types/cheer';

interface MetricsOverviewProps {
  clips: Clip[];
  events: CheerEvent[];
  onFilterStatus?: (status: string) => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  clips,
  events,
  onFilterStatus,
}) => {
  const totalClips = clips.length;
  const approvedClips = clips.filter(c => c.status === 'coach_approved' || c.status === 'ready_to_post' || c.status === 'posted').length;
  const pendingClips = clips.filter(c => c.status === 'needs_review').length;
  const readyToPost = clips.filter(c => c.status === 'ready_to_post').length;
  const upcomingEvents = events.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      
      {/* Total Library */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('all')}
        className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Total Vault Clips</span>
          <Film className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{totalClips}</span>
          <span className="text-[11px] text-slate-500">MP4 items</span>
        </div>
      </div>

      {/* Coach Approved */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('coach_approved')}
        className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Coach Approved</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-400">{approvedClips}</span>
          <span className="text-[11px] text-emerald-500/80 font-medium">cleared</span>
        </div>
      </div>

      {/* Pending Coach Review */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('needs_review')}
        className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-amber-500/40 transition-all cursor-pointer group shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Pending Review</span>
          <AlertCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-400">{pendingClips}</span>
          <span className="text-[11px] text-amber-500/80 font-medium">in queue</span>
        </div>
      </div>

      {/* Ready for Socials */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('ready_to_post')}
        className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-purple-500/40 transition-all cursor-pointer group shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Ready for Socials</span>
          <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-purple-300">{readyToPost}</span>
          <span className="text-[11px] text-purple-400/80 font-medium">staged</span>
        </div>
      </div>

      {/* Upcoming Events */}
      <div 
        className="col-span-2 lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Team Calendar</span>
          <Calendar className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{upcomingEvents}</span>
          <span className="text-[11px] text-slate-500">events & drops</span>
        </div>
      </div>

    </div>
  );
};
