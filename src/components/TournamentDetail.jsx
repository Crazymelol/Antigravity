import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, DollarSign, Trophy, Info, X, ChevronRight, Share2 } from 'lucide-react';

const TournamentDetail = ({ competition, onClose }) => {
    const [activeTab, setActiveTab] = useState('events');

    if (!competition) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end transition-opacity">
            <div className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-slide-in-right">
                {/* Header Image/Banner Area */}
                <div className="h-32 bg-indigo-900 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-6 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-bold uppercase backdrop-blur-md border border-white/10">
                                {competition.type}
                            </span>
                            <span className="text-indigo-200 text-xs font-medium uppercase tracking-wider">
                                {competition.category}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold leading-tight">{competition.name}</h2>
                    </div>
                </div>

                {/* Meta Bar */}
                <div className="bg-white border-b border-slate-100 px-6 py-4 flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        {new Date(competition.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>{competition.location}</span>
                        {competition.mapUrl && (
                            <a href={competition.mapUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-xs font-bold ml-1">
                                (Map)
                            </a>
                        )}
                    </div>
                    {competition.registrationCloses && (
                        <div className="flex items-center gap-2 text-orange-600 font-medium">
                            <Clock className="w-4 h-4" />
                            Reg. Closes: {new Date(competition.registrationCloses).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Organizer Info (AskFRED style) */}
                {competition.organizer && (
                    <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                        <span>Organized by: <strong className="text-slate-700">{competition.organizer}</strong></span>
                        <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                            <Share2 className="w-3 h-3" /> Share
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="px-6 mt-4 border-b border-slate-200 flex gap-6">
                    {['events', 'preregistrants', 'results'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${activeTab === tab
                                    ? 'text-indigo-600 border-indigo-600'
                                    : 'text-slate-400 border-transparent hover:text-slate-600'
                                }`}
                        >
                            {tab === 'preregistrants' ? "Who's Coming" : tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'events' && (
                        <div className="space-y-3">
                            {competition.events && competition.events.length > 0 ? (
                                competition.events.map(event => (
                                    <div key={event.id} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:bg-slate-50 transition-colors group flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{event.name}</h4>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                                                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {event.fee}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded inline-flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {event.entrants}
                                            </div>
                                            <button className="block text-xs font-bold text-slate-400 mt-1 group-hover:text-indigo-600 transition-colors">
                                                Details &rarr;
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 italic">
                                    No specific events listed yet.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'preregistrants' && (
                        <div>
                            {competition.preregistrants && competition.preregistrants.length > 0 ? (
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3">Rank</th>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Country/Club</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {competition.preregistrants.map((p, i) => (
                                                <tr key={i} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-bold text-slate-400">#{p.rank || '-'}</td>
                                                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                                                    <td className="px-4 py-3 text-slate-500">{p.country || p.club}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                    <p className="text-slate-500">No preregistrants public yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Trophy className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <h3 className="text-slate-900 font-medium">Results Pending</h3>
                            <p className="text-slate-500 text-sm">Pools and DEs will appear here once the tournament starts.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TournamentDetail;
