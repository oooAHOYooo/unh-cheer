import React from 'react';
import { Film, CheckCircle2, Clock, Calendar } from 'lucide-react';
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
  const approvedClips = clips.filter(c => c.status === 'coach_approved' || c.status === 'ready_to_post').length;
  const pendingClips = clips.filter(c => c.status === 'needs_review').length;
  const upcomingEvents = events.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      
      {/* Total Library */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('all')}
        className="bg-white border border-slate-200/90 rounded-md p-3.5 hover:border-[#002D62] transition-colors cursor-pointer shadow-sm"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Clips</span>
          <Film className="w-4 h-4 text-[#002D62]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#002D62]">{totalClips}</span>
          <span className="text-xs text-slate-500">in vault</span>
        </div>
      </div>

      {/* Coach Approved */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('coach_approved')}
        className="bg-white border border-slate-200/90 rounded-md p-3.5 hover:border-emerald-600 transition-colors cursor-pointer shadow-sm"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Coach Approved</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-700">{approvedClips}</span>
          <span className="text-xs text-emerald-600 font-medium">cleared</span>
        </div>
      </div>

      {/* Pending Review */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('needs_review')}
        className="bg-white border border-slate-200/90 rounded-md p-3.5 hover:border-amber-500 transition-colors cursor-pointer shadow-sm"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Needs Coach Review</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-600">{pendingClips}</span>
          <span className="text-xs text-amber-700 font-medium">in queue</span>
        </div>
      </div>

      {/* Events */}
      <div 
        className="bg-white border border-slate-200/90 rounded-md p-3.5 shadow-sm"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Schedule</span>
          <Calendar className="w-4 h-4 text-[#002D62]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800">{upcomingEvents}</span>
          <span className="text-xs text-slate-500">upcoming events</span>
        </div>
      </div>

    </div>
  );
};
