import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, User } from 'lucide-react';

const ParentLayout = () => {
    const { logout, currentUser, athletes } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const child = athletes.find(a => a.id === currentUser?.athleteId);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Parent Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 shadow-sm">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-slate-900 leading-tight">Parent Portal</h1>
                            <p className="text-xs text-slate-500">Viewing: {child ? child.name : 'Unknown'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-md mx-auto pb-20">
                <Outlet />
            </main>
        </div>
    );
};

export default ParentLayout;
