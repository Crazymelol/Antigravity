import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Moon, Battery, Zap, Smile } from 'lucide-react';
import { clsx } from 'clsx';

const SliderInput = ({ label, icon: Icon, value, onChange, minLabel, maxLabel }) => {
    const getColor = (v) => {
        if (v <= 1) return 'text-red-500 bg-red-50 border-red-100';
        if (v <= 2) return 'text-orange-500 bg-orange-50 border-orange-100';
        if (v <= 3) return 'text-yellow-500 bg-yellow-50 border-yellow-100';
        if (v <= 4) return 'text-lime-500 bg-lime-50 border-lime-100';
        return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    };

    const getTrackColor = (v) => {
        if (v <= 1) return 'accent-red-500';
        if (v <= 2) return 'accent-orange-500';
        if (v <= 3) return 'accent-yellow-500';
        if (v <= 4) return 'accent-lime-500';
        return 'accent-emerald-500';
    };

    return (
        <div className={clsx("p-4 rounded-xl border transition-all duration-300", getColor(value))}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-700">{label}</span>
                <span className="ml-auto font-black text-2xl opacity-80">{value}</span>
            </div>

            <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className={clsx(
                    "w-full h-3 bg-white/50 rounded-lg appearance-none cursor-pointer",
                    getTrackColor(value)
                )}
            />

            <div className="flex justify-between text-[10px] uppercase font-bold opacity-60 mt-3 tracking-wider">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );
};

const WellnessForm = ({ onComplete }) => {
    const { currentUser, submitWellness } = useApp();
    const [data, setData] = useState({
        sleep: 3,
        fatigue: 3,
        soreness: 3,
        stress: 3,
        mood: 3
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        submitWellness(today, currentUser.athleteId, data);
        onComplete();
    };

    const updateField = (field, val) => setData(prev => ({ ...prev, [field]: val }));

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                <SliderInput
                    label="Sleep Quality"
                    icon={Moon}
                    value={data.sleep}
                    onChange={v => updateField('sleep', v)}
                    minLabel="Poor"
                    maxLabel="Great"
                />

                <SliderInput
                    label="Energy Level"
                    icon={Battery}
                    value={data.fatigue}
                    onChange={v => updateField('fatigue', v)}
                    minLabel="Exhausted"
                    maxLabel="Energized"
                />

                <SliderInput
                    label="Muscle Freshness"
                    icon={Activity}
                    value={data.soreness}
                    onChange={v => updateField('soreness', v)}
                    minLabel="Very Sore"
                    maxLabel="Fresh"
                />

                <SliderInput
                    label="Stress Level"
                    icon={Zap}
                    value={data.stress}
                    onChange={v => updateField('stress', v)}
                    minLabel="High Stress"
                    maxLabel="Relaxed"
                />

                <SliderInput
                    label="Overall Mood"
                    icon={Smile}
                    value={data.mood}
                    onChange={v => updateField('mood', v)}
                    minLabel="Bad"
                    maxLabel="Happy"
                />

                <button
                    type="submit"
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all mt-4 transform active:scale-95"
                >
                    Submit Wellness
                </button>
            </form>
        </div>
    );
};

export default WellnessForm;
