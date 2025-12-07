import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Swords, User, ShieldCheck, Users } from 'lucide-react';

const Login = () => {
    const { login, athletes, coaches, requestCoachAccess } = useApp();
    const navigate = useNavigate();
    const [view, setView] = useState('main'); // main, coach-login, coach-register, admin
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');

    const handleCoachLogin = (coachId) => {
        login('coach'); // In reality, we'd bind to the coach ID
        navigate('/');
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

    const handleAthleteLogin = (athleteId) => {
        login('athlete', athleteId);
        navigate('/');
    };

    const handleParentLogin = (childId) => {
        login('parent', childId);
        navigate('/parent');
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
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Select Coach Profile</h2>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {coaches.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => handleCoachLogin(c.id)}
                                    className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-slate-700 hover:text-indigo-700"
                                >
                                    {c.name}
                                </button>
                            ))}
                            {coaches.length === 0 && <p className="text-sm text-slate-400 italic">No approved coaches yet.</p>}
                        </div>
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
                    <p className="text-sm text-slate-500 mb-4">Select your profile to check in:</p>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {athletes.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No athletes found. Ask a coach to add you.</p>
                        ) : (
                            athletes.map(a => (
                                <button
                                    key={a.id}
                                    onClick={() => handleAthleteLogin(a.id)}
                                    className="w-full text-left px-4 py-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors flex items-center justify-between group"
                                >
                                    <span className="font-medium text-slate-700 group-hover:text-emerald-700">{a.name}</span>
                                    <span className="text-xs text-slate-400 uppercase">{a.weapon}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-orange-50 px-8 py-6 border-t border-orange-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-orange-600" />
                        Parent Access
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">Select your child to view progress:</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {athletes.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No athletes found.</p>
                        ) : (
                            athletes.map(a => (
                                <button
                                    key={`parent-${a.id}`}
                                    onClick={() => handleParentLogin(a.id)}
                                    className="w-full text-left px-4 py-3 bg-white hover:bg-orange-100 border border-orange-200 hover:border-orange-300 rounded-lg transition-colors flex items-center justify-between group"
                                >
                                    <span className="font-medium text-slate-700 group-hover:text-orange-800">{a.name}</span>
                                    <span className="text-xs text-slate-400 uppercase">{a.weapon}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <p className="mt-8 text-sm text-slate-400">
                Note: This is a demo authentication system.
            </p>
        </div>
    );
};

export default Login;
