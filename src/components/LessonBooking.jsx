import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Plus, Clock, User, X, CheckCircle } from 'lucide-react';

const LessonBooking = () => {
    const { lessonBookings, addLessonBooking, updateLessonBooking, cancelLessonBooking, athletes } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [formData, setFormData] = useState({
        athleteId: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 60,
        focus: '',
        notes: ''
    });

    const timeSlots = Array.from({ length: 13 }, (_, i) => {
        const hour = i + 8;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addLessonBooking({ ...formData, status: 'Scheduled' });
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            athleteId: '',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            duration: 60,
            focus: '',
            notes: ''
        });
        setIsFormOpen(false);
    };

    const getBookingsForDate = (date) => {
        return lessonBookings.filter(b => b.date === date && b.status !== 'Cancelled');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const upcomingBookings = lessonBookings
        .filter(b => b.status === 'Scheduled' && new Date(b.date) >= new Date(new Date().toISOString().split('T')[0]))
        .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-purple-600" />
                        Lesson Booking
                    </h1>
                    <p className="text-slate-500 mt-2">Schedule and manage private lessons</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Book Lesson
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Schedule</h2>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="space-y-2">
                        {getBookingsForDate(selectedDate).length > 0 ? (
                            getBookingsForDate(selectedDate).map(booking => {
                                const athlete = athletes.find(a => a.id === booking.athleteId);
                                return (
                                    <div key={booking.id} className={`p-4 rounded-lg border-2 ${getStatusColor(booking.status)}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-bold">{booking.time}</span>
                                                    <span className="text-sm">({booking.duration} min)</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm mb-1">
                                                    <User className="w-4 h-4" />
                                                    <span className="font-medium">{athlete?.name || 'Unknown Athlete'}</span>
                                                </div>
                                                {booking.focus && (
                                                    <p className="text-sm mt-2"><strong>Focus:</strong> {booking.focus}</p>
                                                )}
                                                {booking.notes && (
                                                    <p className="text-sm text-slate-600 mt-1 italic">{booking.notes}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {booking.status === 'Scheduled' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateLessonBooking(booking.id, { status: 'Completed' })}
                                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                                            title="Mark Complete"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => cancelLessonBooking(booking.id)}
                                                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No lessons scheduled for this date</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Lessons Sidebar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming Lessons</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {upcomingBookings.slice(0, 10).map(booking => {
                            const athlete = athletes.find(a => a.id === booking.athleteId);
                            return (
                                <div key={booking.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="text-sm font-medium text-slate-900">{athlete?.name}</div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                    </div>
                                    {booking.focus && (
                                        <div className="text-xs text-purple-700 mt-1">{booking.focus}</div>
                                    )}
                                </div>
                            );
                        })}
                        {upcomingBookings.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                No upcoming lessons
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Book a Lesson</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Athlete</label>
                                <select
                                    required
                                    value={formData.athleteId}
                                    onChange={e => setFormData({ ...formData, athleteId: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select athlete...</option>
                                    {athletes.map(athlete => (
                                        <option key={athlete.id} value={athlete.id}>{athlete.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                    <select
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                                <select
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>60 minutes</option>
                                    <option value={90}>90 minutes</option>
                                    <option value={120}>120 minutes</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Focus Area</label>
                                <input
                                    type="text"
                                    value={formData.focus}
                                    onChange={e => setFormData({ ...formData, focus: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Footwork, Blade work"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows="2"
                                    placeholder="Any additional notes..."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Book Lesson
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonBooking;
