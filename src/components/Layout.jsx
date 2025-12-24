import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, ClipboardCheck, LayoutDashboard, Swords, LogOut, Shield, QrCode, Package, BookOpen, CreditCard, Monitor, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

const Layout = () => {
    const { currentUser, logout, athletes } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavItems = () => {
        if (currentUser?.role === 'athlete') {
            return [
                { to: '/attendance', icon: ClipboardCheck, label: 'My Attendance' },
                { to: '/competitions', icon: Swords, label: 'Competitions' },
            ];
        }
        return [
            { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/athletes', icon: Users, label: 'Athletes' },
            { to: '/competitions', icon: Swords, label: 'Competitions' },
            { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
            { to: '/qr-checkin', icon: QrCode, label: 'QR Check-In' },
            { to: '/inventory', icon: Package, label: 'Inventory' },
            { to: '/lessons', icon: BookOpen, label: 'Lessons' },
            { to: '/badges', icon: CreditCard, label: 'Badges' },
            { to: '/strips', icon: Monitor, label: 'Strip View' },
            { to: '/referees', icon: Shield, label: 'Referees' },
            { to: '/rankings', icon: Trophy, label: 'Rankings' },
        ];
    };

    const navItems = getNavItems();

    // For athlete dashboard view, maybe show name
    const currentAthleteName = currentUser?.role === 'athlete'
        ? athletes.find(a => a.id === currentUser.athleteId)?.name
        : 'Coach';

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Swords className="w-8 h-8 text-indigo-600 mr-2" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        En Garde
                    </span>
                </div>

                <div className="px-6 py-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Signed in as
                    </div>
                    <div className="font-medium text-slate-800 truncate">
                        {currentAthleteName}
                    </div>
                </div>

                <nav className="flex-1 py-2 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => clsx(
                                "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={clsx(
                                        "w-5 h-5 mr-3 transition-colors",
                                        isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                    )} />
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>

                    <div className="text-xs text-slate-400 text-center">
                        &copy; {new Date().getFullYear()} Fencing Club Manager
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <Swords className="w-6 h-6 text-indigo-600 mr-2" />
                        <span className="font-bold text-lg">En Garde</span>
                    </div>
                    <button onClick={handleLogout}>
                        <LogOut className="w-5 h-5 text-slate-500" />
                    </button>
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-10 safe-area-bottom">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center p-2 rounded-lg",
                            isActive ? "text-indigo-600" : "text-slate-500"
                        )}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] mt-1">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Layout;
