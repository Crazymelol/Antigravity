import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Check, MapPin, Megaphone, AlertTriangle, Info, Download } from 'lucide-react';
import { clsx } from 'clsx';
import WellnessForm from './WellnessForm';
import WorkloadForm from './WorkloadForm';

const AthleteAttendanceView = () => {
    const { currentUser, attendance, markAttendance, athletes, wellness, workload, athleteStatus, announcements } = useApp();
    const today = new Date().toISOString().split('T')[0];
    const athlete = athletes.find(a => a.id === currentUser.athleteId);
    const isPresent = (attendance[today] || []).includes(currentUser.athleteId);
    const hasSubmittedWellness = wellness[today]?.[currentUser.athleteId];
    const hasSubmittedWorkload = workload[today]?.[currentUser.athleteId];

    const currentStatus = athleteStatus[athlete?.id];
    const isRestricted = currentStatus && currentStatus.status !== 'Active';
    const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

    const togglePresence = () => {
        markAttendance(today, currentUser.athleteId, !isPresent);
    };

    if (!athlete) return <div>Athlete profile not found.</div>;

    const steps = [
        { id: 'checkin', label: 'Check In', done: isPresent },
        { id: 'wellness', label: 'Wellness', done: hasSubmittedWellness },
        { id: 'workload', label: 'Training Log', done: hasSubmittedWorkload },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-sm mx-auto px-4 pb-20">

            {/* ANNOUNCEMENT BANNER */}
            {latestAnnouncement && (
                <div className="w-full mb-6 bg-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">Team Update • {new Date(latestAnnouncement.date).toLocaleDateString()}</p>
                            <p className="text-sm font-medium leading-relaxed">{latestAnnouncement.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header with Progress Steps */}
            <div className="w-full mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'},<br />
                    <span className="text-indigo-600">{athlete.name.split(' ')[0]}</span>
                </h1>
                <p className="text-slate-500 font-medium mb-6">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>

                {/* STATUS ALERT */}
                {isRestricted && (
                    <div className={clsx("w-full mb-6 p-4 rounded-xl border-l-4 shadow-sm",
                        currentStatus.status === 'Injured' ? "bg-red-50 border-red-500 text-red-800" :
                            currentStatus.status === 'Sick' ? "bg-orange-50 border-orange-500 text-orange-800" :
                                "bg-yellow-50 border-yellow-500 text-yellow-800"
                    )}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold uppercase text-xs tracking-wider mb-1">Status: {currentStatus.status}</p>
                                <p className="text-sm">{currentStatus.note}</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Progress Indicators */}
                <div className="flex gap-2">
                    {steps.map((step) => (
                        <div key={step.id} className="flex-1">
                            <div className={clsx(
                                "h-1.5 rounded-full transition-all duration-300 mb-1",
                                step.done ? "bg-indigo-600" : "bg-slate-200"
                            )} />
                            <span className={clsx(
                                "text-[10px] font-bold uppercase tracking-wider transition-colors",
                                step.done ? "text-indigo-600" : "text-slate-300"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="w-full animate-in fade-in zoom-in duration-300">

                {/* STATE 4: ALL COMPLETE */}
                {hasSubmittedWorkload ? (
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-emerald-100 border border-emerald-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">You're All Set!</h2>
                        <p className="text-slate-500">Training logged successfully. Rest up and see you next time.</p>
                    </div>
                ) :

                    /* STATE 3: WORKLOAD FORM */
                    hasSubmittedWellness ? (
                        <div className="bg-white rounded-3xl p-1 shadow-lg border border-slate-100">
                            <div className="px-6 py-4 border-b border-slate-50 mb-2">
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Step 3 of 3</span>
                                <h2 className="text-xl font-bold text-slate-900">Training Log</h2>
                            </div>
                            <div className="p-4">
                                <WorkloadForm onComplete={() => { }} />
                            </div>
                        </div>
                    ) :

                        /* STATE 2: WELLNESS FORM */
                        isPresent ? (
                            <div className="bg-white rounded-3xl p-1 shadow-lg border border-slate-100">
                                <div className="px-6 py-4 border-b border-slate-50 mb-2">
                                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Step 2 of 3</span>
                                    <h2 className="text-xl font-bold text-slate-900">Wellness Check</h2>
                                </div>
                                <div className="p-4">
                                    <WellnessForm onComplete={() => { }} />
                                </div>
                            </div>
                        ) :

                            /* STATE 1: CHECK IN BUTTON */
                            (
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={togglePresence}
                                        className="group relative w-72 h-72 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-indigo-200 transition-all duration-300 hover:scale-105 active:scale-95"
                                    >
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 animate-pulse-slow opacity-90 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center z-10">
                                            <MapPin className="w-16 h-16 text-indigo-600 mb-4 stroke-[1.5]" />
                                            <span className="text-3xl font-black text-slate-800 tracking-tight">TAP TO<br />CHECK IN</span>
                                        </div>
                                    </button>
                                    <p className="mt-8 text-center text-slate-400 text-sm max-w-xs mx-auto">
                                        Tap the button above when you arrive at the club to start your session.
                                    </p>
                                </div>
                            )}
            </div>
        </div>
    );
};

const AttendanceTracker = () => {
    const { athletes, attendance, markAttendance, currentUser } = useApp();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // If user is an athlete, show the self-service view
    if (currentUser?.role === 'athlete') {
        return <AthleteAttendanceView />;
    }

    // --- COACH VIEW (Original Grid) ---
    const handleDateChange = (days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        setDate(d.toISOString().split('T')[0]);
    };

    const presentList = attendance[date] || [];
    const presentCount = presentList.length;
    const totalCount = athletes.length;
    const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    // Sorting: Present first, then alphabetical
    const sortedAthletes = [...athletes].sort((a, b) => {
        const aPres = presentList.includes(a.id);
        const bPres = presentList.includes(b.id);
        if (aPres === bPres) return a.name.localeCompare(b.name);
        return aPres ? -1 : 1;
    });

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
                    <p className="text-slate-500">Track who is present today</p>
                </div>

                {/* Date Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const rows = [['Date', 'Athlete Name', 'Weapon', 'Status']];
                            sortedAthletes.forEach(a => {
                                const status = presentList.includes(a.id) ? 'Present' : 'Absent';
                                rows.push([date, a.name, a.weapon, status]);
                            });

                            const csvContent = "data:text/csv;charset=utf-8,"
                                + rows.map(e => e.join(",")).join("\n");

                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", `attendance_${date}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors font-medium border border-indigo-200"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>

                    <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                        <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="mx-2 font-medium text-slate-700 focus:outline-none bg-transparent"
                        />
                        <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Attendance Rate</span>
                    <span className="text-2xl font-bold text-slate-900">{percentage}%</span>
                    <span className="text-sm text-slate-500 ml-2">({presentCount}/{totalCount})</span>
                </div>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-2">
                {athletes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No athletes in the system yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {sortedAthletes.map(athlete => {
                            const isPresent = presentList.includes(athlete.id);
                            return (
                                <button
                                    key={athlete.id}
                                    onClick={() => markAttendance(date, athlete.id, !isPresent)}
                                    className={clsx(
                                        "flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200",
                                        isPresent
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:shadow-sm"
                                    )}
                                >
                                    <div>
                                        <div className={clsx("font-bold", isPresent ? "text-white" : "text-slate-800")}>
                                            {athlete.name}
                                        </div>
                                        <div className={clsx("text-xs mt-1", isPresent ? "text-indigo-200" : "text-slate-400 capitalize")}>
                                            {athlete.weapon}
                                        </div>
                                    </div>
                                    {isPresent && (
                                        <div className="bg-white/20 p-1 rounded-full">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceTracker;
