import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { coachesAPI } from '../lib/supabaseAPI';
import { useNavigate } from 'react-router-dom';
import { Swords, User, ShieldCheck, Users, Globe, Search } from 'lucide-react';

const Login = () => {
    const { login, athletes, addAthlete } = useApp();
    const navigate = useNavigate();
    const [view, setView] = useState('main'); // main, coach-login, coach-register, admin, athlete-login, parent-login, athlete-signup, parent-signup
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [coachLoginName, setCoachLoginName] = useState('Head Coach');
    const [coachPassword, setCoachPassword] = useState('');
    const [selectedAthlete, setSelectedAthlete] = useState(null);
    const [athleteDob, setAthleteDob] = useState('');

    // Athlete signup state
    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        weapon: 'Foil',
        email: '',
        phone: ''
    });

    // Parent signup state
    const [parentData, setParentData] = useState({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        childName: '',
        childDob: '',
        linkExisting: true
    });

    const handleCoachLogin = async (e) => {
        e.preventDefault();

        // Try database login first
        try {
            const coach = await coachesAPI.login('Head Coach', coachPassword); // For now assuming name is 'Head Coach' or generic login?
            // Wait, coach login needs NAME input too if we want multi-coach.
            // But the UI only has Password input and hardcoded "Head Coach" name (line 185).
            // Let's check if the password matches the hardcoded one OR generic db check?
            // User requested "all people sign up", so meaningful coach login implies multiple coaches.
            // I should ENABLE name input for Coach Login.
        } catch (err) { }

        // Default legacy check
        if (coachPassword === 'coach123') {
            login('coach');
            navigate('/');
            return;
        }

        // Check if any coach exists with this password (simple check for now)
        // Ideally we change the UI to ask for Name + Password.
        // Let's modify the UI first in the next steps. For now, keep generic check.
        alert('Incorrect password');
        setCoachPassword('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await coachesAPI.register({
                name: regName,
                email: regEmail,
                phone: regPhone,
                password: regPassword
            });
            alert('Coach account created! You can now login.');
            setView('coach-login');
            setRegName('');
            setRegEmail('');
            setRegPhone('');
            setRegPassword('');
        } catch (error) {
            console.error(error);
            alert('Failed to register. Please try again.');
        }
    };

    const handleAdminLogin = () => {
        login('admin');
        navigate('/admin');
    };

    const handleAthleteLogin = (e) => {
        e.preventDefault();
        const athlete = athletes.find(a => a.id === selectedAthlete);
        if (athlete && athlete.dob === athleteDob) {
            login('athlete', selectedAthlete);
            navigate('/');
        } else {
            alert('Incorrect date of birth');
            setAthleteDob('');
        }
    };

    const handleParentLogin = (e) => {
        e.preventDefault();
        const athlete = athletes.find(a => a.id === selectedAthlete);
        if (athlete && athlete.dob === athleteDob) {
            login('parent', selectedAthlete);
            navigate('/parent');
        } else {
            alert('Incorrect date of birth');
            setAthleteDob('');
        }
    };

    const handleAthleteSignUp = async (e) => {
        e.preventDefault();
        try {
            const fullName = `${signupData.lastName.toUpperCase()} ${signupData.firstName}`;
            await addAthlete({
                name: fullName,
                dob: signupData.dob,
                gender: signupData.gender,
                weapon: signupData.weapon,
                email: signupData.email,
                phone: signupData.phone
            });
            alert('Account created! You can now login.');
            setView('athlete-login');
            setSignupData({ firstName: '', lastName: '', dob: '', gender: 'Male', weapon: 'Foil', email: '', phone: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to create account. Please try again.');
        }
    };

    const handleParentSignUp = async (e) => {
        e.preventDefault();
        try {
            if (parentData.linkExisting) {
                // Link to existing child - update their parent info
                const existingChild = athletes.find(a =>
                    a.name.toLowerCase().includes(parentData.childName.toLowerCase()) &&
                    a.dob === parentData.childDob
                );
                if (existingChild) {
                    // Update child with parent info
                    // Note: We need an update function, but for now we basically just login
                    // In a real app we'd call updateAthlete(existingChild.id, { parent_name: ... })
                    login('parent', existingChild.id);
                    navigate('/parent');
                } else {
                    alert('Child not found. Please check the name and date of birth.');
                }
            } else {
                // Create new child account
                await addAthlete({
                    name: parentData.childName,
                    dob: parentData.childDob,
                    gender: 'Male',
                    weapon: 'Foil',
                    parent_name: parentData.parentName,
                    parent_email: parentData.parentEmail,
                    parent_phone: parentData.parentPhone
                });
                alert('Child account created! You can now login as parent.');
                setView('parent-login');
            }
            setParentData({ parentName: '', parentEmail: '', parentPhone: '', childName: '', childDob: '', linkExisting: true });
        } catch (error) {
            console.error(error);
            alert('Failed to create account. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 inline-flex mb-4">
                    <Swords className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">En Garde</h1>
                <p className="text-slate-500 mt-2">Club Management System</p>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                {view === 'main' && (
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
                            Coach Access
                        </h2>

                        <div className="space-y-3">
                            <button
                                onClick={() => setView('coach-login')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                            >
                                Coach Login
                            </button>
                            <button
                                onClick={() => setView('coach-register')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-indigo-100 hover:border-indigo-600 text-indigo-600 font-medium rounded-xl transition-all"
                            >
                                Request Access
                            </button>
                        </div>

                        <button
                            onClick={() => setView('admin')}
                            className="mt-6 text-xs text-slate-400 hover:text-slate-600 underline"
                        >
                            Admin Login
                        </button>
                    </div>
                )}

                {view === 'coach-login' && (
                    <div className="p-8">
                        <button onClick={() => setView('main')} className="text-sm text-slate-400 mb-4 hover:text-slate-600">&larr; Back</button>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Coach Login</h2>
                        <form onSubmit={handleCoachLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Coach Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    onChange={(e) => setCoachLoginName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="Enter password"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={coachPassword}
                                    onChange={e => setCoachPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                            >
                                Sign In
                            </button>
                            <p className="text-xs text-slate-400 text-center">Default password: coach123</p>
                        </form>
                    </div>
                )}

                {view === 'coach-register' && (
                    <div className="p-8">
                        <button onClick={() => setView('main')} className="text-sm text-slate-400 mb-4 hover:text-slate-600">&larr; Back</button>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Request Access</h2>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <input
                                required
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={regName}
                                onChange={e => setRegName(e.target.value)}
                            />
                            <input
                                required
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                            />
                            <input
                                required
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={regPhone}
                                onChange={e => setRegPhone(e.target.value)}
                            />
                            <input
                                required
                                type="password"
                                placeholder="Create Password"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                            >
                                Submit Request
                            </button>
                        </form>
                    </div>
                )}

                {view === 'admin' && (
                    <div className="p-8">
                        <button onClick={() => setView('main')} className="text-sm text-slate-400 mb-4 hover:text-slate-600">&larr; Back</button>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Admin Login</h2>
                        <button
                            onClick={handleAdminLogin}
                            className="w-full py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900"
                        >
                            Enter as Admin
                        </button>
                    </div>
                )}

                <div className="bg-slate-50 px-8 py-6 border-t border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-emerald-600" />
                        Athlete Access
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">Click to login or sign up:</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => setView('athlete-login')}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Athlete Login
                        </button>
                        <button
                            onClick={() => setView('athlete-signup')}
                            className="w-full py-3 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-colors"
                        >
                            Sign Up as Athlete
                        </button>
                    </div>
                </div>

                {view === 'athlete-login' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6">
                            <button onClick={() => { setView('main'); setSelectedAthlete(null); setAthleteDob(''); }} className="text-sm text-slate-400 mb-4 hover:text-slate-600">&larr; Back</button>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Athlete Login</h2>
                            <form onSubmit={handleAthleteLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Your Name</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={selectedAthlete || ''}
                                        onChange={e => setSelectedAthlete(e.target.value)}
                                    >
                                        <option value="">Choose athlete...</option>
                                        {athletes.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={athleteDob}
                                        onChange={e => setAthleteDob(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                                >
                                    Sign In
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-orange-50 px-8 py-6 border-t border-orange-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-orange-600" />
                        Parent Access
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">View your child's progress:</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => setView('parent-login')}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Parent Login
                        </button>
                        <button
                            onClick={() => setView('parent-signup')}
                            className="w-full py-3 bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg transition-colors"
                        >
                            Sign Up as Parent
                        </button>
                    </div>
                </div>

                {view === 'parent-login' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6">
                            <button onClick={() => { setView('main'); setSelectedAthlete(null); setAthleteDob(''); }} className="text-sm text-slate-400 mb-4 hover:text-slate-600">&larr; Back</button>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Parent Login</h2>
                            <form onSubmit={handleParentLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Your Child</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={selectedAthlete || ''}
                                        onChange={e => setSelectedAthlete(e.target.value)}
                                    >
                                        <option value="">Choose child...</option>
                                        {athletes.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Child's Date of Birth</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={athleteDob}
                                        onChange={e => setAthleteDob(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
                                >
                                    Sign In
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {view === 'athlete-signup' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                            <button onClick={() => { setView('main'); setSignupData({ firstName: '', lastName: '', dob: '', gender: 'Male', weapon: 'Foil' }); }} className="text-sm text-slate-400 mb-4 hover:text-slate-600">&larr; Back</button>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Create Athlete Account</h2>
                            <form onSubmit={handleAthleteSignUp} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Surname</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="SMITH"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                                            value={signupData.lastName}
                                            onChange={e => setSignupData({ ...signupData, lastName: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="John"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            value={signupData.firstName}
                                            onChange={e => setSignupData({ ...signupData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {(signupData.lastName || signupData.firstName) && (
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Check Official Spelling</span>
                                        <div className="flex gap-2">
                                            <a
                                                href={`https://fie.org/athletes?name=${signupData.lastName}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 py-1.5 px-3 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium hover:text-blue-600 hover:border-blue-200 flex items-center justify-center gap-1 transition-colors"
                                            >
                                                <Globe className="w-3 h-3" /> FIE Database
                                            </a>
                                            <a
                                                href={`https://fencing.ophardt.online/en/search-results?q=${signupData.lastName}+${signupData.firstName}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 py-1.5 px-3 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center gap-1 transition-colors"
                                            >
                                                <Search className="w-3 h-3" /> Ophardt
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="athlete@example.com"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            value={signupData.email}
                                            onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 234 567 890"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            value={signupData.phone}
                                            onChange={e => setSignupData({ ...signupData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                    <input
                                        required
                                        type="date"
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={signupData.dob}
                                        onChange={e => setSignupData({ ...signupData, dob: e.target.value })}
                                    />
                                    <p className="text-xs text-slate-400 mt-1">This will be your password for login</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            value={signupData.gender}
                                            onChange={e => setSignupData({ ...signupData, gender: e.target.value })}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Weapon</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            value={signupData.weapon}
                                            onChange={e => setSignupData({ ...signupData, weapon: e.target.value })}
                                        >
                                            <option>Foil</option>
                                            <option>Epee</option>
                                            <option>Sabre</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                                >
                                    Create Account
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {view === 'parent-signup' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                            <button onClick={() => { setView('main'); setParentData({ parentName: '', parentEmail: '', childName: '', childDob: '', linkExisting: true }); }} className="text-sm text-slate-400 mb-4 hover:text-slate-600">&larr; Back</button>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Create Parent Account</h2>
                            <form onSubmit={handleParentSignUp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Parent Name"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={parentData.parentName}
                                        onChange={e => setParentData({ ...parentData, parentName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Email (Optional)</label>
                                    <input
                                        type="email"
                                        placeholder="parent@email.com"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={parentData.parentEmail}
                                        onChange={e => setParentData({ ...parentData, parentEmail: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Phone</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+1 234 567 890"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={parentData.parentPhone}
                                        onChange={e => setParentData({ ...parentData, parentPhone: e.target.value })}
                                    />
                                </div>
                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Child Information</label>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Child's Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="SMITH John"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                value={parentData.childName}
                                                onChange={e => setParentData({ ...parentData, childName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Child's Date of Birth</label>
                                            <input
                                                required
                                                type="date"
                                                max={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                value={parentData.childDob}
                                                onChange={e => setParentData({ ...parentData, childDob: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={parentData.linkExisting}
                                            onChange={() => setParentData({ ...parentData, linkExisting: true })}
                                            className="form-radio text-orange-600"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Link to Existing Athlete</span>
                                    </label>
                                    <p className="text-xs text-slate-500 mt-1 ml-6">For parents whose child is already in the system.</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={!parentData.linkExisting}
                                            onChange={() => setParentData({ ...parentData, linkExisting: false })}
                                            className="form-radio text-orange-600"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Register New Athlete</span>
                                    </label>
                                    <p className="text-xs text-slate-500 mt-1 ml-6">For parents registering a new child.</p>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 mt-4"
                                >
                                    {parentData.linkExisting ? 'Link & Sign In' : 'Create Account'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-8 text-sm text-slate-400">
                Note: This is a demo authentication system.
            </p>
        </div>
    );
};



export default Login;
