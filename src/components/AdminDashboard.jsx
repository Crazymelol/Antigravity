import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, X, Shield, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const { pendingCoaches, coaches, approveCoach, declineCoach } = useApp();

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                    <Shield className="w-8 h-8 mr-3 text-slate-800" />
                    Admin Dashboard
                </h1>
                <p className="text-slate-500 mt-2">Manage coach approvals and system access.</p>
            </header>

            {/* Pending Requests */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-amber-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-amber-600" />
                        Pending Requests
                        <span className="ml-3 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                            {pendingCoaches.length}
                        </span>
                    </h2>
                </div>

                <div className="divide-y divide-slate-100">
                    {pendingCoaches.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 italic">
                            No pending requests at this time.
                        </div>
                    ) : (
                        pendingCoaches.map(request => (
                            <div key={request.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <h3 className="font-bold text-slate-900">{request.name}</h3>
                                    <p className="text-sm text-slate-500">{request.email}</p>
                                    <p className="text-xs text-slate-400 mt-1">Requested: {new Date(request.requestedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => declineCoach(request.id)}
                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Decline"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => approveCoach(request.id)}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Active Coaches */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Active Coaches</h2>
                    <span className="text-sm text-slate-500">{coaches.length} active</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coaches.map(coach => (
                        <div key={coach.id} className="p-4 border border-slate-100 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                {coach.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900">{coach.name}</h4>
                                <p className="text-xs text-slate-400">Approved: {new Date(coach.approvedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
