import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, CheckCircle, Clock, User } from 'lucide-react';

const QRCheckIn = () => {
    const { athletes, attendance, markAttendance } = useApp();
    const [selectedAthlete, setSelectedAthlete] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance[today] || [];

    const handleCheckIn = (athleteId) => {
        markAttendance(today, athleteId, true);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedAthlete(null);
        }, 2000);
    };

    const generateQRPattern = (id) => {
        // Generate a simple visual QR-like pattern based on ID
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const pattern = [];
        for (let i = 0; i < 25; i++) {
            pattern.push((hash * (i + 1)) % 2 === 0);
        }
        return pattern;
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <QrCode className="w-8 h-8 text-emerald-600" />
                    QR Check-In
                </h1>
                <p className="text-slate-500 mt-2">Scan athlete QR codes for instant attendance tracking</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Athlete Selection */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Select Athlete</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {athletes.map(athlete => {
                            const isCheckedIn = todayAttendance.includes(athlete.id);
                            return (
                                <button
                                    key={athlete.id}
                                    onClick={() => setSelectedAthlete(athlete)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${selectedAthlete?.id === athlete.id
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : isCheckedIn
                                                ? 'border-slate-200 bg-slate-50 opacity-60'
                                                : 'border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <div className="font-medium text-slate-900">{athlete.name}</div>
                                                <div className="text-xs text-slate-500">{athlete.weapon}</div>
                                            </div>
                                        </div>
                                        {isCheckedIn && (
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* QR Code Display */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">QR Code</h2>
                    {selectedAthlete ? (
                        <div className="flex flex-col items-center">
                            {/* QR Code Visual */}
                            <div className="bg-white p-6 rounded-xl border-4 border-slate-900 mb-6">
                                <div className="grid grid-cols-5 gap-1 w-48 h-48">
                                    {generateQRPattern(selectedAthlete.id).map((filled, idx) => (
                                        <div
                                            key={idx}
                                            className={`${filled ? 'bg-slate-900' : 'bg-white'} rounded-sm`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Athlete Info */}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">{selectedAthlete.name}</h3>
                                <p className="text-slate-500">{selectedAthlete.weapon}</p>
                                <p className="text-xs text-slate-400 mt-2">ID: {selectedAthlete.id.slice(0, 8)}</p>
                            </div>

                            {/* Check-in Button */}
                            {todayAttendance.includes(selectedAthlete.id) ? (
                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-lg">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Already Checked In</span>
                                </div>
                            ) : showSuccess ? (
                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-lg animate-pulse">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Check-in Successful!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleCheckIn(selectedAthlete.id)}
                                    className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
                                >
                                    Scan & Check In
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                            <QrCode className="w-24 h-24 mb-4 opacity-20" />
                            <p className="text-center">Select an athlete to view their QR code</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Today's Check-ins */}
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Today's Check-ins ({todayAttendance.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {todayAttendance.map(athleteId => {
                        const athlete = athletes.find(a => a.id === athleteId);
                        return athlete ? (
                            <div key={athleteId} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span className="text-sm text-slate-700 truncate">{athlete.name}</span>
                            </div>
                        ) : null;
                    })}
                    {todayAttendance.length === 0 && (
                        <div className="col-span-full text-center py-8 text-slate-400">
                            No check-ins yet today
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRCheckIn;
