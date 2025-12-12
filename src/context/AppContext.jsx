import React, { createContext, useContext, useState, useEffect } from 'react';
import { seedCompetitions } from '../data/seedCompetitions';
import { athletesAPI } from '../lib/athletesAPI';
import {
    competitionsAPI,
    attendanceAPI,
    wellnessAPI,
    workloadAPI,
    athleteStatusAPI,
    announcementsAPI,
    refereesAPI,
    inventoryAPI,
    lessonBookingsAPI,
    coachesAPI
} from '../lib/supabaseAPI';


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

    // Load initial state from Supabase or localStorage fallback
    const [athletes, setAthletes] = useState([]);
    const [athletesLoading, setAthletesLoading] = useState(true);

    // Load athletes from Supabase on mount
    useEffect(() => {
        const loadAthletes = async () => {
            try {
                const data = await athletesAPI.getAll();
                setAthletes(data);
            } catch (error) {
                console.error('Failed to load athletes from Supabase:', error);
                // Fallback to localStorage
                try {
                    const saved = localStorage.getItem('fencing_athletes');
                    if (saved) setAthletes(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to load from localStorage:', e);
                }
            } finally {
                setAthletesLoading(false);
            }
        };
        loadAthletes();
    }, []);

    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        const loadCompetitions = async () => {
            try {
                const data = await competitionsAPI.getAll();
                setCompetitions(data.length > 0 ? data : seedCompetitions);
            } catch (error) {
                console.error('Failed to load competitions:', error);
                setCompetitions(seedCompetitions);
            }
        };
        loadCompetitions();
    }, []);

    const [attendance, setAttendance] = useState({});
    const [wellness, setWellness] = useState({});
    const [workload, setWorkload] = useState({});
    const [athleteStatus, setAthleteStatus] = useState({});
    const [announcements, setAnnouncements] = useState([]);
    const [referees, setReferees] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [lessonBookings, setLessonBookings] = useState([]);

    const [coaches, setCoaches] = useState([]);

    const [pendingCoaches, setPendingCoaches] = useState([]);

    // Load all data from Supabase
    useEffect(() => {
        const loadAllData = async () => {
            try {
                const [attendanceData, wellnessData, workloadData, statusData, announcementsData, refereesData, inventoryData, lessonsData, coachesData, pendingCoachesData] = await Promise.all([
                    attendanceAPI.getAll(),
                    wellnessAPI.getAll(),
                    workloadAPI.getAll(),
                    athleteStatusAPI.getAll(),
                    announcementsAPI.getAll(),
                    refereesAPI.getAll(),
                    inventoryAPI.getAll(),
                    lessonBookingsAPI.getAll(),
                    coachesAPI.getApproved(),
                    coachesAPI.getPending()
                ]);

                // Convert arrays to objects for attendance, wellness, workload, status
                const attendanceObj = {};
                attendanceData.forEach(a => {
                    if (!attendanceObj[a.athlete_id]) attendanceObj[a.athlete_id] = {};
                    attendanceObj[a.athlete_id][a.date] = a.present;
                });

                const wellnessObj = {};
                wellnessData.forEach(w => {
                    if (!wellnessObj[w.athlete_id]) wellnessObj[w.athlete_id] = [];
                    wellnessObj[w.athlete_id].push(w);
                });

                const workloadObj = {};
                workloadData.forEach(w => {
                    if (!workloadObj[w.athlete_id]) workloadObj[w.athlete_id] = [];
                    workloadObj[w.athlete_id].push(w);
                });

                const statusObj = {};
                statusData.forEach(s => {
                    statusObj[s.athlete_id] = { status: s.status, note: s.note };
                });

                setAttendance(attendanceObj);
                setWellness(wellnessObj);
                setWorkload(workloadObj);
                setAthleteStatus(statusObj);
                setAnnouncements(announcementsData);
                setReferees(refereesData);
                setInventory(inventoryData);
                setInventory(inventoryData);
                setLessonBookings(lessonsData);
                setCoaches(coachesData);
                setPendingCoaches(pendingCoachesData);
            } catch (error) {
                console.error('Failed to load data from Supabase:', error);
            }
        };
        loadAllData();
    }, []);

    // Persistence
    useEffect(() => { localStorage.setItem('fencing_athletes', JSON.stringify(athletes)); }, [athletes]);
    useEffect(() => { localStorage.setItem('fencing_competitions', JSON.stringify(competitions)); }, [competitions]);
    useEffect(() => { localStorage.setItem('fencing_attendance', JSON.stringify(attendance)); }, [attendance]);
    useEffect(() => { localStorage.setItem('fencing_wellness', JSON.stringify(wellness)); }, [wellness]);
    useEffect(() => { localStorage.setItem('fencing_workload', JSON.stringify(workload)); }, [workload]);
    useEffect(() => { localStorage.setItem('fencing_athleteStatus', JSON.stringify(athleteStatus)); }, [athleteStatus]);
    useEffect(() => { localStorage.setItem('fencing_announcements', JSON.stringify(announcements)); }, [announcements]);
    // Coaches are now remote-only
    useEffect(() => { localStorage.setItem('fencing_referees', JSON.stringify(referees)); }, [referees]);
    useEffect(() => { localStorage.setItem('fencing_inventory', JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem('fencing_lessonBookings', JSON.stringify(lessonBookings)); }, [lessonBookings]);

    // Actions
    const addAthlete = async (athlete) => {
        try {
            const newAthlete = await athletesAPI.add(athlete);
            setAthletes(prev => [...prev, newAthlete]);
        } catch (error) {
            console.error('Failed to add athlete:', error);
            // Fallback to localStorage
            const newAthlete = { ...athlete, id: crypto.randomUUID() };
            setAthletes(prev => [...prev, newAthlete]);
        }
    };

    const updateAthleteProfile = async (id, updates) => {
        try {
            const updated = await athletesAPI.update(id, updates);
            setAthletes(prev => prev.map(a => a.id === id ? updated : a));
        } catch (error) {
            console.error('Failed to update athlete:', error);
            // Fallback to localStorage
            setAthletes(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
        }
    };

    const removeAthlete = async (id) => {
        try {
            await athletesAPI.remove(id);
            setAthletes(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to remove athlete:', error);
            // Fallback to localStorage
            setAthletes(prev => prev.filter(a => a.id !== id));
        }
    };

    const addCompetition = async (competition) => {
        try {
            const newComp = await competitionsAPI.add(competition);
            setCompetitions(prev => [newComp, ...prev]);
        } catch (error) {
            console.error('Failed to add competition:', error);
        }
    };

    const removeCompetition = async (id) => {
        try {
            await competitionsAPI.remove(id);
            setCompetitions(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to remove competition:', error);
        }
    };

    const markAttendance = async (athleteId, date, present = true) => {
        try {
            await attendanceAPI.mark(athleteId, date, present);
            setAttendance(prev => ({
                ...prev,
                [athleteId]: { ...prev[athleteId], [date]: present }
            }));
        } catch (error) {
            console.error('Failed to mark attendance:', error);
        }
    };


    const submitWellness = async (date, athleteId, data) => {
        try {
            await wellnessAPI.submit({ athlete_id: athleteId, date, ...data });
            setWellness(prev => {
                const athleteRecords = prev[athleteId] || [];
                const scores = [data.sleep, data.fatigue, data.soreness, data.stress, data.mood];
                const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                return { ...prev, [athleteId]: [...athleteRecords, { ...data, date, avg }] };
            });
        } catch (error) {
            console.error('Failed to submit wellness:', error);
        }
    };

    const submitWorkload = async (date, athleteId, data) => {
        try {
            await workloadAPI.submit({ athlete_id: athleteId, date, ...data });
            setWorkload(prev => {
                const athleteRecords = prev[athleteId] || [];
                const load = data.rpe * data.duration;
                return { ...prev, [athleteId]: [...athleteRecords, { ...data, date, load }] };
            });
        } catch (error) {
            console.error('Failed to submit workload:', error);
        }
    };

    const updateAthleteStatus = async (athleteId, status, note) => {
        try {
            await athleteStatusAPI.update(athleteId, status, note);
            setAthleteStatus(prev => ({
                ...prev,
                [athleteId]: { status, note, updatedAt: new Date().toISOString() }
            }));
        } catch (error) {
            console.error('Failed to update athlete status:', error);
        }
    };

    const addAnnouncement = async (message, type = 'info') => {
        try {
            const newAnnouncement = await announcementsAPI.add({ message, type, author: 'Coach' });
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        } catch (error) {
            console.error('Failed to add announcement:', error);
        }
    };

    const removeAnnouncement = async (id) => {
        try {
            await announcementsAPI.remove(id);
            setAnnouncements(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to remove announcement:', error);
        }
    };

    // Coach Approval Actions
    const approveCoach = async (id) => {
        try {
            const approved = await coachesAPI.approve(id);
            setCoaches(prev => [approved, ...prev]);
            setPendingCoaches(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to approve coach:', error);
        }
    };

    const declineCoach = async (id) => {
        try {
            await coachesAPI.decline(id);
            setPendingCoaches(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to decline coach:', error);
        }
    };

    // Referee Management Actions
    const addReferee = async (referee) => {
        try {
            const newReferee = await refereesAPI.add(referee);
            setReferees(prev => [...prev, newReferee]);
        } catch (error) {
            console.error('Failed to add referee:', error);
        }
    };

    const updateReferee = async (id, updates) => {
        try {
            const updated = await refereesAPI.update(id, updates);
            setReferees(prev => prev.map(r => r.id === id ? updated : r));
        } catch (error) {
            console.error('Failed to update referee:', error);
        }
    };

    const removeReferee = async (id) => {
        try {
            await refereesAPI.remove(id);
            setReferees(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Failed to remove referee:', error);
        }
    };

    // Inventory Management Actions
    const addInventoryItem = async (item) => {
        try {
            const newItem = await inventoryAPI.add(item);
            setInventory(prev => [...prev, newItem]);
        } catch (error) {
            console.error('Failed to add inventory item:', error);
        }
    };

    const updateInventoryItem = async (id, updates) => {
        try {
            const updated = await inventoryAPI.update(id, updates);
            setInventory(prev => prev.map(i => i.id === id ? updated : i));
        } catch (error) {
            console.error('Failed to update inventory item:', error);
        }
    };

    const removeInventoryItem = async (id) => {
        try {
            await inventoryAPI.remove(id);
            setInventory(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error('Failed to remove inventory item:', error);
        }
    };

    const assignEquipment = async (itemId, athleteId) => {
        try {
            const updated = await inventoryAPI.assign(itemId, athleteId);
            setInventory(prev => prev.map(i => i.id === itemId ? updated : i));
        } catch (error) {
            console.error('Failed to assign equipment:', error);
        }
    };

    const returnEquipment = async (itemId) => {
        try {
            const updated = await inventoryAPI.return(itemId);
            setInventory(prev => prev.map(i => i.id === itemId ? updated : i));
        } catch (error) {
            console.error('Failed to return equipment:', error);
        }
    };

    // Lesson Booking Actions
    const addLessonBooking = async (booking) => {
        try {
            const newBooking = await lessonBookingsAPI.add(booking);
            setLessonBookings(prev => [...prev, newBooking]);
        } catch (error) {
            console.error('Failed to add lesson booking:', error);
        }
    };

    const updateLessonBooking = async (id, updates) => {
        try {
            const updated = await lessonBookingsAPI.update(id, updates);
            setLessonBookings(prev => prev.map(b => b.id === id ? updated : b));
        } catch (error) {
            console.error('Failed to update lesson booking:', error);
        }
    };

    const cancelLessonBooking = async (id) => {
        try {
            const updated = await lessonBookingsAPI.cancel(id);
            setLessonBookings(prev => prev.map(b => b.id === id ? updated : b));
        } catch (error) {
            console.error('Failed to cancel lesson booking:', error);
        }
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
            coaches, pendingCoaches, approveCoach, declineCoach,
            referees, addReferee, updateReferee, removeReferee,
            inventory, addInventoryItem, updateInventoryItem, removeInventoryItem, assignEquipment, returnEquipment,
            lessonBookings, addLessonBooking, updateLessonBooking, cancelLessonBooking
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
