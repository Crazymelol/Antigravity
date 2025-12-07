import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Trophy, CalendarCheck, Gauge, Activity, Megaphone, Send } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
    </div>
);

const Dashboard = () => {
    const {
        athletes,
        competitions,
        attendance,
        wellness,
        workload,
        announcements,
        addAnnouncement,
        removeAnnouncement
    } = useApp();

    // Calculate stats
    const totalAthletes = athletes.length;
    const upcomingCompetitions = competitions.filter(c => new Date(c.date) >= new Date()).length;

    // Get today's attendance count
    const todayStr = new Date().toISOString().split('T')[0];
    const presentToday = attendance[todayStr]?.length || 0;

    // Calculate Average Workload (RPE) for today
    const todayWorkloads = Object.values(workload[todayStr] || {});
    const avgWorkload = todayWorkloads.length > 0
        ? (todayWorkloads.reduce((acc, curr) => acc + curr.rpe, 0) / todayWorkloads.length).toFixed(1)
        : 0;

    // Calculate Team Wellness (Average %)
    const todayWellness = Object.values(wellness[todayStr] || {});
    const avgWellness = todayWellness.length > 0
        ? Math.round(todayWellness.reduce((acc, curr) => acc + (curr.avg / 5) * 100, 0) / todayWellness.length)
        : 0;


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back, Coach.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Athletes"
                    value={totalAthletes}
                    icon={Users}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Present Today"
                    value={presentToday}
                    icon={CalendarCheck}
                    colorClass="bg-emerald-500"
                />
                <StatCard
                    title="Avg Workload"
                    value={avgWorkload > 0 ? avgWorkload : '-'}
                    icon={Gauge}
                    colorClass="bg-indigo-500"
                />
                <StatCard
                    title="Team Wellness"
                    value={avgWellness > 0 ? `${avgWellness}%` : '-'}
                    icon={Activity}
                    colorClass="bg-pink-500"
                />
                <StatCard
                    title="Upcoming Comps"
                    value={upcomingCompetitions}
                    icon={Trophy}
                    colorClass="bg-amber-500"
                />
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ANNOUNCEMENTS WIDGET */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-96">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-indigo-500" />
                        Team Announcements
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                        {announcements.length === 0 ? (
                            <div className="text-center text-slate-400 text-sm h-full flex items-center justify-center italic">
                                No announcements posted.
                            </div>
                        ) : (
                            announcements.map(ann => (
                                <div key={ann.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group text-sm">
                                    <p className="text-slate-700">{ann.message}</p>
                                    <div className="text-xs text-slate-400 mt-2 flex justify-between items-center">
                                        <span>{new Date(ann.date).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => removeAnnouncement(ann.id)}
                                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-bold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const val = e.target.msg.value.trim();
                            if (val) {
                                addAnnouncement(val);
                                e.target.msg.value = '';
                            }
                        }}
                        className="relative mt-auto"
                    >
                        <input
                            name="msg"
                            type="text"
                            placeholder="Post an update..."
                            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                        >
                            <Send className="w-3 h-3" />
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-96">
                    <h3 className="font-semibold text-slate-800 mb-4">Next Competition</h3>
                    {competitions.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-slate-400 text-sm text-center">No competitions scheduled.</p>
                        </div>
                    ) : (
                        // Simple logic to find next one
                        (() => {
                            const next = competitions
                                .filter(c => new Date(c.date) >= new Date())
                                .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

                            if (!next) return <div className="h-full flex items-center justify-center"><p className="text-slate-400 text-sm">No upcoming competitions.</p></div>;

                            return (
                                <div className="flex flex-col items-center justify-center h-full pb-8 text-center">
                                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                                        <Trophy className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <div className="text-xl font-bold text-slate-800">{next.name}</div>
                                    <div className="text-indigo-600 text-sm font-bold mt-1 uppercase tracking-wider">{new Date(next.date).toLocaleDateString()}</div>
                                    <div className="text-slate-400 text-sm mt-2 font-medium">{next.location} • {next.category}</div>
                                </div>
                            );
                        })()
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
