import React, { createContext, useContext, useState, useEffect } from 'react';
import { seedCompetitions } from '../data/seedCompetitions';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // User State
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_currentUser');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('fencing_currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('fencing_currentUser');
        }
    }, [currentUser]);

    const login = (role, athleteId = null) => {
        setCurrentUser({ role, athleteId });
    };

    const logout = () => {
        setCurrentUser(null);
    };

    // Load initial state from localStorage or use defaults
    const [athletes, setAthletes] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_athletes');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse athletes", e);
            return [];
        }
    });

    const [competitions, setCompetitions] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_competitions');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.length > 0) return parsed;
            }
            return seedCompetitions;
        } catch (e) {
            console.error("Failed to parse competitions", e);
            return seedCompetitions;
        }
    });

    const [attendance, setAttendance] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_attendance');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to parse attendance", e);
            return {};
        }
    });

    const [wellness, setWellness] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_wellness');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to parse wellness", e);
            return {};
        }
    });

    const [workload, setWorkload] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_workload');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to parse workload", e);
            return {};
        }
    });

    // --- NEW FEATURES: Status & Announcements ---
    const [athleteStatus, setAthleteStatus] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_athleteStatus');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });

    const [announcements, setAnnouncements] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_announcements');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // --- NEW FEATURES: Admin & Coach Approval ---
    // List of approved coaches
    const [coaches, setCoaches] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_coaches');
            return saved ? JSON.parse(saved) : [
                { id: 'default-coach', name: 'Head Coach', email: 'coach@club.com', approvedAt: new Date().toISOString() }
            ];
        } catch { return []; }
    });

    // List of pending coach requests
    const [pendingCoaches, setPendingCoaches] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_pendingCoaches');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // --- Referee Management ---
    const [referees, setReferees] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_referees');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // --- Inventory/Armory Management ---
    const [inventory, setInventory] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_inventory');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // --- Lesson Bookings ---
    const [lessonBookings, setLessonBookings] = useState(() => {
        try {
            const saved = localStorage.getItem('fencing_lessonBookings');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // Persistence
    useEffect(() => { localStorage.setItem('fencing_athletes', JSON.stringify(athletes)); }, [athletes]);
    useEffect(() => { localStorage.setItem('fencing_competitions', JSON.stringify(competitions)); }, [competitions]);
    useEffect(() => { localStorage.setItem('fencing_attendance', JSON.stringify(attendance)); }, [attendance]);
    useEffect(() => { localStorage.setItem('fencing_wellness', JSON.stringify(wellness)); }, [wellness]);
    useEffect(() => { localStorage.setItem('fencing_workload', JSON.stringify(workload)); }, [workload]);
    useEffect(() => { localStorage.setItem('fencing_athleteStatus', JSON.stringify(athleteStatus)); }, [athleteStatus]);
    useEffect(() => { localStorage.setItem('fencing_announcements', JSON.stringify(announcements)); }, [announcements]);
    useEffect(() => { localStorage.setItem('fencing_coaches', JSON.stringify(coaches)); }, [coaches]);
    useEffect(() => { localStorage.setItem('fencing_pendingCoaches', JSON.stringify(pendingCoaches)); }, [pendingCoaches]);
    useEffect(() => { localStorage.setItem('fencing_referees', JSON.stringify(referees)); }, [referees]);
    useEffect(() => { localStorage.setItem('fencing_inventory', JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem('fencing_lessonBookings', JSON.stringify(lessonBookings)); }, [lessonBookings]);

    // Actions
    const addAthlete = (athlete) => {
        setAthletes(prev => [...prev, { ...athlete, id: crypto.randomUUID() }]);
    };

    const updateAthleteProfile = (id, updates) => {
        setAthletes(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const removeAthlete = (id) => {
        setAthletes(prev => prev.filter(a => a.id !== id));
    };

    const addCompetition = (competition) => {
        setCompetitions(prev => [...prev, { ...competition, id: crypto.randomUUID() }]);
    };

    const removeCompetition = (id) => {
        setCompetitions(prev => prev.filter(c => c.id !== id));
    };

    const markAttendance = (date, athleteId, isPresent) => {
        setAttendance(prev => {
            const currentDay = prev[date] || [];
            let newDay;
            if (isPresent) {
                if (!currentDay.includes(athleteId)) {
                    newDay = [...currentDay, athleteId];
                } else {
                    newDay = currentDay;
                }
            } else {
                newDay = currentDay.filter(id => id !== athleteId);
            }
            return { ...prev, [date]: newDay };
        });
    };

    const submitWellness = (date, athleteId, data) => {
        setWellness(prev => {
            const dayRecords = prev[date] || {};
            const scores = [data.sleep, data.fatigue, data.soreness, data.stress, data.mood];
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            return { ...prev, [date]: { ...dayRecords, [athleteId]: { ...data, avg } } };
        });
    };

    const submitWorkload = (date, athleteId, data) => {
        setWorkload(prev => {
            const dayRecords = prev[date] || {};
            const load = data.rpe * data.duration;
            return { ...prev, [date]: { ...dayRecords, [athleteId]: { ...data, load } } };
        });
    };

    const updateAthleteStatus = (athleteId, status, note) => {
        setAthleteStatus(prev => ({
            ...prev,
            [athleteId]: { status, note, updatedAt: new Date().toISOString() }
        }));
    };

    const addAnnouncement = (message, type = 'info') => {
        const newAnnouncement = {
            id: crypto.randomUUID(),
            message,
            type,
            date: new Date().toISOString(),
            author: 'Coach'
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
    };

    const removeAnnouncement = (id) => {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    };

    // Coach Approval Actions
    const requestCoachAccess = (name, email) => {
        const newRequest = {
            id: crypto.randomUUID(),
            name,
            email,
            requestedAt: new Date().toISOString()
        };
        setPendingCoaches(prev => [...prev, newRequest]);
    };

    const approveCoach = (id) => {
        const coach = pendingCoaches.find(c => c.id === id);
        if (coach) {
            setCoaches(prev => [...prev, { ...coach, approvedAt: new Date().toISOString() }]);
            setPendingCoaches(prev => prev.filter(c => c.id !== id));
        }
    };

    const declineCoach = (id) => {
        setPendingCoaches(prev => prev.filter(c => c.id !== id));
    };

    // Referee Management Actions
    const addReferee = (referee) => {
        setReferees(prev => [...prev, { ...referee, id: crypto.randomUUID() }]);
    };

    const updateReferee = (id, updates) => {
        setReferees(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const removeReferee = (id) => {
        setReferees(prev => prev.filter(r => r.id !== id));
    };

    // Inventory Management Actions
    const addInventoryItem = (item) => {
        setInventory(prev => [...prev, { ...item, id: crypto.randomUUID(), addedAt: new Date().toISOString() }]);
    };

    const updateInventoryItem = (id, updates) => {
        setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    };

    const removeInventoryItem = (id) => {
        setInventory(prev => prev.filter(i => i.id !== id));
    };

    const assignEquipment = (itemId, athleteId) => {
        setInventory(prev => prev.map(i =>
            i.id === itemId ? { ...i, assignedTo: athleteId, assignedAt: new Date().toISOString() } : i
        ));
    };

    const returnEquipment = (itemId) => {
        setInventory(prev => prev.map(i =>
            i.id === itemId ? { ...i, assignedTo: null, assignedAt: null, returnedAt: new Date().toISOString() } : i
        ));
    };

    // Lesson Booking Actions
    const addLessonBooking = (booking) => {
        setLessonBookings(prev => [...prev, { ...booking, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
    };

    const updateLessonBooking = (id, updates) => {
        setLessonBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const cancelLessonBooking = (id) => {
        setLessonBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    };

    return (
        <AppContext.Provider value={{
            athletes, addAthlete, removeAthlete, updateAthleteProfile,
            competitions, addCompetition, removeCompetition,
            attendance, markAttendance,
            wellness, submitWellness,
            workload, submitWorkload,
            currentUser, login, logout,
            athleteStatus, updateAthleteStatus,
            announcements, addAnnouncement, removeAnnouncement,
            coaches, pendingCoaches, requestCoachAccess, approveCoach, declineCoach,
            referees, addReferee, updateReferee, removeReferee,
            inventory, addInventoryItem, updateInventoryItem, removeInventoryItem, assignEquipment, returnEquipment,
            lessonBookings, addLessonBooking, updateLessonBooking, cancelLessonBooking
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
