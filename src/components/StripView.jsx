import React, { useState, useEffect } from 'react';
import { Monitor, Swords, Clock, User, RefreshCw } from 'lucide-react';

const StripView = () => {
    const [strips, setStrips] = useState([
        { id: 1, name: 'Strip 1', status: 'active', bout: null },
        { id: 2, name: 'Strip 2', status: 'active', bout: null },
        { id: 3, name: 'Strip 3', status: 'active', bout: null },
        { id: 4, name: 'Strip 4', status: 'active', bout: null },
        { id: 5, name: 'Strip 5', status: 'active', bout: null },
        { id: 6, name: 'Strip 6', status: 'active', bout: null },
    ]);

    // Mock data for demonstration
    const mockBouts = [
        { fencer1: 'PAPADAKIS Dimitris', fencer2: 'GEORGIOU Andreas', score1: 12, score2: 8, time: '2:15', round: 'DE Table of 32' },
        { fencer1: 'KONSTANTINOU Maria', fencer2: 'NIKOLAOU Sofia', score1: 5, score2: 15, time: '1:45', round: 'DE Table of 16' },
        { fencer1: 'PETROU Nikos', fencer2: 'IOANNOU Christos', score1: 15, score2: 11, time: '0:30', round: 'Semifinals' },
        { fencer1: 'ALEXANDROU Elena', fencer2: 'DIMITRIOU Anna', score1: 8, score2: 8, time: '1:20', round: 'Poule 3' },
        { fencer1: 'MICHAELIDIS Yannis', fencer2: 'STAVROU Kostas', score1: 15, score2: 7, time: 'Complete', round: 'Finals' },
        { fencer1: 'CHRISTOFOROU Lia', fencer2: 'ANDREOU Katerina', score1: 3, score2: 10, time: '2:00', round: 'Poule 1' },
    ];

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStrips(prev => prev.map((strip, idx) => ({
                ...strip,
                bout: mockBouts[idx] || null
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (time) => {
        if (time === 'Complete') return 'bg-emerald-500';
        if (time && time.includes(':')) {
            const [min] = time.split(':').map(Number);
            if (min < 1) return 'bg-rose-500';
            if (min < 2) return 'bg-amber-500';
        }
        return 'bg-blue-500';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Monitor className="w-8 h-8 text-blue-600" />
                    Live Strip Status
                </h1>
                <p className="text-slate-500 mt-2">Real-time monitoring of all active strips</p>
            </div>

            {/* Auto-refresh indicator */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center gap-2 text-blue-700">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Auto-refreshing every 3 seconds</span>
            </div>

            {/* Strips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strips.map(strip => (
                    <div key={strip.id} className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        {/* Strip Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Swords className="w-5 h-5" />
                                    <h3 className="font-bold text-lg">{strip.name}</h3>
                                </div>
                                {strip.bout && (
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(strip.bout.time)} animate-pulse`}></div>
                                )}
                            </div>
                        </div>

                        {/* Bout Info */}
                        {strip.bout ? (
                            <div className="p-5">
                                {/* Round */}
                                <div className="text-center mb-4">
                                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                        {strip.bout.round}
                                    </span>
                                </div>

                                {/* Fencers & Scores */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-900">{strip.bout.fencer1}</span>
                                        </div>
                                        <div className={`text-2xl font-bold ${strip.bout.score1 > strip.bout.score2 ? 'text-emerald-600' : 'text-slate-400'
                                            }`}>
                                            {strip.bout.score1}
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-900">{strip.bout.fencer2}</span>
                                        </div>
                                        <div className={`text-2xl font-bold ${strip.bout.score2 > strip.bout.score1 ? 'text-emerald-600' : 'text-slate-400'
                                            }`}>
                                            {strip.bout.score2}
                                        </div>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="flex items-center justify-center gap-2 text-slate-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">{strip.bout.time}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <Swords className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Waiting for bout...</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3">Status Indicators</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-slate-600">In Progress (2+ min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm text-slate-600">Nearing End (1-2 min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <span className="text-sm text-slate-600">Final Minute (&lt;1 min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-slate-600">Complete</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StripView;
