import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gauge, Clock, Dumbbell, Plus, Minus } from 'lucide-react';
import { clsx } from 'clsx';

const WorkloadForm = ({ onComplete }) => {
    const { currentUser, submitWorkload } = useApp();
    const [rpe, setRpe] = useState(5);
    const [duration, setDuration] = useState(90);

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        submitWorkload(today, currentUser.athleteId, { rpe, duration });
        onComplete();
    };

    const getRpeLabel = (val) => {
        if (val <= 2) return "Very Easy";
        if (val <= 4) return "Easy";
        if (val <= 6) return "Moderate";
        if (val <= 8) return "Hard";
        return "Max Effort";
    };

    const getRpeColor = (val) => {
        if (val <= 2) return "text-emerald-500 from-emerald-500 to-emerald-600";
        if (val <= 4) return "text-blue-500 from-blue-500 to-blue-600";
        if (val <= 6) return "text-yellow-500 from-yellow-400 to-yellow-600";
        if (val <= 8) return "text-orange-500 from-orange-400 to-orange-600";
        return "text-red-500 from-red-500 to-red-700";
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* RPE SLIDER */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Gauge className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                        <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Session Intensity
                        </label>

                        <div className="flex items-center justify-between mb-8">
                            <div className="text-center w-full">
                                <span className={clsx("text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br transition-all duration-300", getRpeColor(rpe))}>
                                    {rpe}
                                </span>
                                <span className={clsx("block text-sm font-bold uppercase tracking-widest mt-2 transition-colors duration-300", getRpeColor(rpe).split(' ')[0])}>
                                    {getRpeLabel(rpe)}
                                </span>
                            </div>
                        </div>

                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={rpe}
                            onChange={(e) => setRpe(parseInt(e.target.value))}
                            className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest opacity-60">
                            <span>Recovery (1)</span>
                            <span>Max (10)</span>
                        </div>
                    </div>
                </div>

                {/* DURATION INPUT */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Clock className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                        <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Duration (Minutes)
                        </label>

                        <div className="flex items-center justify-between gap-6">
                            <button
                                type="button"
                                onClick={() => setDuration(d => Math.max(0, d - 15))}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <Minus className="w-6 h-6" />
                            </button>

                            <div className="text-center">
                                <span className="text-5xl font-black text-slate-800 tracking-tight">{duration}</span>
                                <span className="text-sm font-bold text-slate-400 ml-1">min</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDuration(d => d + 15)}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                    <Dumbbell className="w-5 h-5" />
                    Log Training
                </button>
            </form>
        </div>
    );
};

export default WorkloadForm;

