import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Users, Trophy } from 'lucide-react';

const AthleteSchedule = () => {
    const { athletes, competitions, lessonBookings } = useApp();
    const [selectedAthleteId, setSelectedAthleteId] = useState('');

    const selectedAthlete = athletes.find(a => a.id === selectedAthleteId);

    // Get athlete's registered competitions
    const athleteCompetitions = selectedAthleteId
        ? competitions.filter(comp =>
            comp.preregistrants?.some(p => p.toLowerCase().includes(selectedAthlete?.name.toLowerCase()))
        )
        : [];

    // Get athlete's lessons
    const athleteLessons = selectedAthleteId
        ? lessonBookings.filter(b => b.athleteId === selectedAthleteId && b.status === 'Scheduled')
        : [];

    // Combine and sort all events
    const allEvents = [
        ...athleteCompetitions.map(comp => ({
            type: 'competition',
            date: comp.date,
            title: comp.name,
            location: comp.location,
            weapon: comp.weapon,
            data: comp
        })),
        ...athleteLessons.map(lesson => ({
            type: 'lesson',
            date: lesson.date,
            time: lesson.time,
            title: `Private Lesson`,
            focus: lesson.focus,
            duration: lesson.duration,
            data: lesson
        }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const upcomingEvents = allEvents.filter(e => new Date(e.date) >= new Date(new Date().toISOString().split('T')[0]));
    const pastEvents = allEvents.filter(e => new Date(e.date) < new Date(new Date().toISOString().split('T')[0]));

    const EventCard = ({ event }) => {
        const isCompetition = event.type === 'competition';
        return (
            <div className={`p-4 rounded-lg border-l-4 ${isCompetition
                    ? 'bg-indigo-50 border-indigo-500'
                    : 'bg-purple-50 border-purple-500'
                }`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {isCompetition ? (
                                <Trophy className="w-5 h-5 text-indigo-600" />
                            ) : (
                                <Users className="w-5 h-5 text-purple-600" />
                            )}
                            <h3 className="font-bold text-slate-900">{event.title}</h3>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</span>
                                {event.time && (
                                    <>
                                        <Clock className="w-4 h-4 ml-2" />
                                        <span>{event.time}</span>
                                    </>
                                )}
                            </div>
                            {isCompetition ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="inline-block px-2 py-0.5 bg-white rounded-full text-xs font-medium">
                                            {event.weapon}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {event.focus && (
                                        <div className="text-purple-700 font-medium">Focus: {event.focus}</div>
                                    )}
                                    <div className="text-xs text-slate-500">{event.duration} minutes</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-cyan-600" />
                    Smart Athlete Schedule
                </h1>
                <p className="text-slate-500 mt-2">Personalized timeline of competitions and lessons</p>
            </div>

            {/* Athlete Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Athlete</label>
                <select
                    value={selectedAthleteId}
                    onChange={(e) => setSelectedAthleteId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
                >
                    <option value="">Choose an athlete...</option>
                    {athletes.map(athlete => (
                        <option key={athlete.id} value={athlete.id}>
                            {athlete.name} - {athlete.weapon}
                        </option>
                    ))}
                </select>
            </div>

            {selectedAthleteId && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-indigo-100 text-sm mb-1">Upcoming Competitions</div>
                                    <div className="text-3xl font-bold">{athleteCompetitions.length}</div>
                                </div>
                                <Trophy className="w-10 h-10 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-purple-100 text-sm mb-1">Scheduled Lessons</div>
                                    <div className="text-3xl font-bold">{athleteLessons.length}</div>
                                </div>
                                <Users className="w-10 h-10 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-5 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-cyan-100 text-sm mb-1">Total Events</div>
                                    <div className="text-3xl font-bold">{upcomingEvents.length}</div>
                                </div>
                                <Calendar className="w-10 h-10 opacity-80" />
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-cyan-600" />
                            Upcoming Events
                        </h2>
                        <div className="space-y-3">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event, idx) => (
                                    <EventCard key={idx} event={event} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No upcoming events scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Past Events */}
                    {pastEvents.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Past Events</h2>
                            <div className="space-y-3 opacity-60">
                                {pastEvents.slice(0, 5).map((event, idx) => (
                                    <EventCard key={idx} event={event} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {!selectedAthleteId && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 text-lg">Select an athlete to view their personalized schedule</p>
                </div>
            )}
        </div>
    );
};

export default AthleteSchedule;
