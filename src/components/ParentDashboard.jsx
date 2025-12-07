import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Trophy, Activity, AlertCircle, HeartPulse, ChevronRight, MessageSquare } from 'lucide-react';
import { getEligibleCategories } from '../utils/categoryUtils';

const ParentDashboard = () => {
    const { currentUser, athletes, athleteStatus, announcements, competitions } = useApp();

    const child = athletes.find(a => a.id === currentUser?.athleteId);

    if (!child) return <div className="p-8 text-center text-slate-500">Child profile not linked.</div>;

    const status = athleteStatus[child.id] || { status: 'Active', note: '' };
    const isIssue = status.status !== 'Active';
    const eligibleCats = getEligibleCategories(child.birthYear);

    // Filter competitions (simple logic: future date + eligible category)
    const upcomingCompetitions = competitions.filter(c => {
        // In a real app check date > today
        // Check eligibility (mock match)
        return true;
    }).slice(0, 3);

    const getStatusColor = (s) => {
        switch (s) {
            case 'Injured': return 'bg-red-50 text-red-700 border-red-200';
            case 'Sick': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Restricted': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
    };

    return (
        <div className="p-4 space-y-6">
            {/* Status Card */}
            <div className={`p-6 rounded-2xl border ${getStatusColor(status.status)} relative overflow-hidden transition-all shadow-sm`}>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">Current Status</span>
                        {isIssue ? <HeartPulse className="w-5 h-5 animate-pulse" /> : <Activity className="w-5 h-5" />}
                    </div>
                    <h2 className="text-3xl font-bold mb-1">{status.status}</h2>
                    <p className="text-sm opacity-90">{status.note || 'Ready to train.'}</p>
                </div>
                {/* Background Pattern */}
                <div className="absolute right-[-20px] top-[-20px] opacity-10">
                    <Activity className="w-40 h-40" />
                </div>
            </div>

            {/* Announcements */}
            {announcements.length > 0 && (
                <div className="bg-indigo-600 rounded-2xl p-6 shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-indigo-200" />
                        <span className="font-bold text-sm text-indigo-100">Team Update</span>
                    </div>
                    <p className="font-medium text-lg leading-snug">{announcements[0].message}</p>
                    <p className="text-xs text-indigo-300 mt-2">{new Date(announcements[0].date).toLocaleDateString()}</p>
                </div>
            )}

            {/* Stats / Overview */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold uppercase">Nat. Rank</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        {child.rankings?.national?.rank ? `#${child.rankings.national.rank}` : '-'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">In {eligibleCats[0] || 'Category'}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold uppercase">Next Event</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 leading-tight">
                        {upcomingCompetitions[0]?.name || 'No Events'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{upcomingCompetitions[0]?.date || '-'}</p>
                </div>
            </div>

            {/* Schedule Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900">Upcoming Schedule</h3>
                    <button className="text-xs font-bold text-indigo-600 flex items-center">
                        View All <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {upcomingCompetitions.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">No upcoming competitions found.</p>
                    ) : (
                        upcomingCompetitions.map(comp => (
                            <div key={comp.id} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 shrink-0">
                                    <span className="text-xs font-bold text-slate-400 uppercase">{new Date(comp.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-lg font-bold text-slate-900 leading-none">{new Date(comp.date).getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{comp.name}</h4>
                                    <p className="text-xs text-slate-500">{comp.location} • {comp.category}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
