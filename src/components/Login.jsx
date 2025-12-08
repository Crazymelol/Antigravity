import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Swords, User, ShieldCheck, Users } from 'lucide-react';

const Login = () => {
    const { login, athletes, coaches, requestCoachAccess } = useApp();
    const navigate = useNavigate();
    const [view, setView] = useState('main'); // main, coach-login, coach-register, admin, athlete-login, parent-login
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [coachPassword, setCoachPassword] = useState('');
    const [selectedAthlete, setSelectedAthlete] = useState(null);
    const [athleteDob, setAthleteDob] = useState('');

    const handleCoachLogin = (e) => {
        e.preventDefault();
        // Default Head Coach password: "coach123" (change this in production)
        if (coachPassword === 'coach123') {
            login('coach');
            navigate('/');
        } else {
            alert('Incorrect password');
            setCoachPassword('');
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        requestCoachAccess(regName, regEmail);
        alert('Request sent to Admin!');
        setView('main');
        setRegName('');
        setRegEmail('');
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
                                    value="Head Coach"
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
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
                    <p className="text-sm text-slate-500 mb-4">Click to login:</p>
                    <button
                        onClick={() => setView('athlete-login')}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Athlete Login
                    </button>
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
                    <button
                        onClick={() => setView('parent-login')}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Parent Login
                    </button>
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
            </div>

            <p className="mt-8 text-sm text-slate-400">
                Note: This is a demo authentication system.
            </p>
        </div>
    );
};

export default Login;
