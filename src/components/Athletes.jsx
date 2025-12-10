import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Trash2, X, Users, Activity, HeartPulse, Trophy, ExternalLink, Globe, Award, LayoutDashboard, LineChart as IconLineChart } from 'lucide-react';
import { getEligibleCategories } from '../utils/categoryUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const AthleteForm = ({ onClose }) => {
    const { addAthlete } = useApp();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: 'Male',
        weapon: 'Foil',
        dob: '',
        email: '',
        phone: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullName = `${formData.lastName.toUpperCase()} ${formData.firstName}`;
        addAthlete({
            ...formData,
            name: fullName,
            parent_name: formData.parentName,
            parent_email: formData.parentEmail,
            parent_phone: formData.parentPhone
        });
        onClose();
    };

    const getFieUrl = () => {
        const query = formData.lastName ? formData.lastName : '';
        return `https://fie.org/athletes?name=${query}`;
    };

    const getOphardtUrl = () => {
        const query = `${formData.lastName}+${formData.firstName}`;
        return `https://fencing.ophardt.online/en/search-results?q=${query}`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Add New Athlete</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Surname</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase placeholder:normal-case"
                                placeholder="GAULTIER"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                placeholder="Jean-Paul"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                    </div>

                    {(formData.lastName || formData.firstName) && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Check Official Spelling</span>
                            <div className="flex gap-2">
                                <a href={getFieUrl()} target="_blank" rel="noreferrer" className="flex-1 py-1.5 px-3 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium hover:text-blue-600 hover:border-blue-200 flex items-center justify-center gap-1 transition-colors">
                                    <Globe className="w-3 h-3" /> FIE Database
                                </a>
                                <a href={getOphardtUrl()} target="_blank" rel="noreferrer" className="flex-1 py-1.5 px-3 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center gap-1 transition-colors">
                                    <Search className="w-3 h-3" /> Ophardt
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Weapon</label>
                            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white" value={formData.weapon} onChange={e => setFormData({ ...formData, weapon: e.target.value })}>
                                <option>Foil</option>
                                <option>Epee</option>
                                <option>Sabre</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                            <input
                                required
                                type="date"
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                value={formData.dob}
                                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                    </div>



                    {/* Contact Information */}
                    <div className="border-t border-slate-100 pt-4 mt-2">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <h3 className="text-sm font-semibold text-slate-800 mb-3 mt-4">Parent/Guardian</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    value={formData.parentName}
                                    onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        value={formData.parentEmail}
                                        onChange={e => setFormData({ ...formData, parentEmail: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        value={formData.parentPhone}
                                        onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                        <textarea className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none h-24" placeholder="Medical conditions, experience level, etc." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg mr-2">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm shadow-indigo-200 transition-colors">Add Athlete</button>
                    </div>
                </form>
            </div >
        </div >
    );
};

// Unified Profile Modal
const AthleteProfileModal = ({ athlete, initialTab = 'overview', onClose }) => {
    const { updateAthleteProfile, updateAthleteStatus, athleteStatus } = useApp();
    const [activeTab, setActiveTab] = useState(initialTab);

    // Status Logic
    const currentStatus = athleteStatus[athlete.id] || { status: 'Active', note: '' };
    const [status, setStatus] = useState(currentStatus.status);
    const [statusNote, setStatusNote] = useState(currentStatus.note || '');

    // Rankings Logic
    const [rankings, setRankings] = useState(athlete.rankings || {
        national: { rank: '', points: '' },
        fie: { rank: '', points: '' },
        efc: { rank: '', points: '' },
        urls: { fie: '', ophardt: '', federation: '' }
    });

    const handleSaveStatus = () => {
        updateAthleteStatus(athlete.id, status, statusNote);
        // Toast logic could go here
    };

    const handleSaveRankings = () => {
        updateAthleteProfile(athlete.id, { rankings });
    };

    const updateRank = (type, field, value) => {
        setRankings(prev => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
    };

    const updateUrl = (field, value) => {
        setRankings(prev => ({ ...prev, urls: { ...prev.urls, [field]: value } }));
    };

    // Performance Data (Mock/Default if missing)
    const performance = athlete.performance || {
        skills: [
            { subject: 'Technique', A: 65, fullMark: 100 },
            { subject: 'Physical', A: 80, fullMark: 100 },
            { subject: 'Tactical', A: 50, fullMark: 100 },
            { subject: 'Mental', A: 70, fullMark: 100 },
        ],
        history: [
            { month: 'Sep', rank: 60 },
            { month: 'Oct', rank: 55 },
            { month: 'Nov', rank: 50 },
            { month: 'Dec', rank: 45 }, // Example improvement (lower is better)
            { month: 'Jan', rank: 42 },
        ]
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'rankings', label: 'Rankings', icon: Trophy },
        { id: 'performance', label: 'Performance', icon: IconLineChart },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Sidebar */}
                <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-full bg-slate-200 mb-4 flex items-center justify-center text-2xl font-bold text-slate-400">
                            {athlete.name[0]}
                        </div>
                        <h2 className="font-bold text-slate-900 text-lg leading-tight">{athlete.name}</h2>
                        <p className="text-sm text-slate-500">{athlete.weapon} • {athlete.gender}</p>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                                    : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <button onClick={onClose} className="mt-auto flex items-center gap-2 text-slate-400 hover:text-slate-600 px-2 py-2 text-sm font-medium transition-colors">
                        <X className="w-4 h-4" /> Close Profile
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 max-w-xl">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-emerald-500" />
                                    Medical & Status
                                </h3>

                                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="grid grid-cols-4 gap-2">
                                        {['Active', 'Injured', 'Sick', 'Restricted'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setStatus(s)}
                                                className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${status === s
                                                    ? s === 'Active' ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : s === 'Injured' ? 'border-red-500 bg-red-50 text-red-700'
                                                            : s === 'Sick' ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                                : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="Add status notes (e.g. 'Returning from ankle sprain')..."
                                        value={statusNote}
                                        onChange={e => setStatusNote(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="flex justify-end">
                                        <button onClick={handleSaveStatus} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors">
                                            Update Status
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-3">General Notes</h3>
                                <p className="text-slate-600 text-sm leading-relaxed p-4 bg-slate-100 rounded-xl">{athlete.notes || "No notes recorded."}</p>
                            </div>
                        </div>
                    )}

                    {/* RANKINGS TAB */}
                    {activeTab === 'rankings' && (
                        <div className="space-y-8 max-w-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                    Rankings Management
                                </h3>
                                <button onClick={handleSaveRankings} className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors">
                                    Save Changes
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Cards for Rank Input */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-2xl">🇬🇷</span>
                                        <span className="font-bold text-slate-700">National</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400">Rank</label>
                                            <input type="number" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" value={rankings.national?.rank} onChange={e => updateRank('national', 'rank', e.target.value)} placeholder="#" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400">Points</label>
                                            <input type="number" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" value={rankings.national?.points} onChange={e => updateRank('national', 'points', e.target.value)} placeholder="Pts" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                        <span className="font-bold text-blue-900">FIE (World)</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-blue-400">Rank</label>
                                            <input type="number" className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg" value={rankings.fie?.rank} onChange={e => updateRank('fie', 'rank', e.target.value)} placeholder="#" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-blue-400">Points</label>
                                            <input type="number" className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg" value={rankings.fie?.points} onChange={e => updateRank('fie', 'points', e.target.value)} placeholder="Pts" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="w-5 h-5 text-indigo-600" />
                                        <span className="font-bold text-indigo-900">EFC (Euro)</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-indigo-400">Rank</label>
                                            <input type="number" className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg" value={rankings.efc?.rank} onChange={e => updateRank('efc', 'rank', e.target.value)} placeholder="#" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase font-bold text-indigo-400">Points</label>
                                            <input type="number" className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg" value={rankings.efc?.points} onChange={e => updateRank('efc', 'points', e.target.value)} placeholder="Pts" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4">External Profiles</h4>
                                <div className="space-y-3">
                                    {['fie', 'ophardt', 'federation'].map(platform => (
                                        <div key={platform} className="flex items-center gap-3">
                                            <span className="w-24 text-sm font-medium text-slate-500 capitalize">{platform}</span>
                                            <input
                                                type="text"
                                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white transition-colors"
                                                placeholder={`Paste ${platform} profile URL...`}
                                                value={rankings.urls[platform]}
                                                onChange={e => updateUrl(platform, e.target.value)}
                                            />
                                            {rankings.urls[platform] && (
                                                <a href={rankings.urls[platform]} target="_blank" rel="noreferrer" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PERFORMANCE TAB */}
                    {activeTab === 'performance' && (
                        <div className="space-y-8 h-full flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <IconLineChart className="w-5 h-5 text-indigo-600" />
                                Performance Analysis
                            </h3>

                            <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
                                {/* Radar Chart - Skills */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col">
                                    <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Skill Profile</h4>
                                    <div className="flex-1 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performance.skills}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar
                                                    name={athlete.name}
                                                    dataKey="A"
                                                    stroke="#4f46e5"
                                                    strokeWidth={3}
                                                    fill="#6366f1"
                                                    fillOpacity={0.3}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Line Chart - Ranking History */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col">
                                    <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">National Ranking Progression</h4>
                                    <div className="flex-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={performance.history}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                                <YAxis reversed hide domain={['dataMin - 5', 'dataMax + 5']} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="rank"
                                                    stroke="#0ea5e9"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        <p className="text-center text-xs text-slate-400 mt-4">Lower rank is better</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Athletes = () => {
    const { athletes, removeAthlete, athleteStatus } = useApp();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAthlete, setSelectedAthlete] = useState(null); // { athlete, tab }
    const [search, setSearch] = useState('');

    const filteredAthletes = athletes.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.weapon.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Injured': return 'bg-red-50 border-red-200';
            case 'Sick': return 'bg-orange-50 border-orange-200';
            case 'Restricted': return 'bg-yellow-50 border-yellow-200';
            default: return 'bg-white border-slate-200';
        }
    };

    const openProfile = (athlete, tab = 'overview') => {
        setSelectedAthlete({ athlete, tab });
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Athletes</h1>
                    <p className="text-slate-500">Manage your club members</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Athlete
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by name or weapon..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAthletes.map(athlete => {
                    const status = athleteStatus[athlete.id];
                    const isIssue = status && status.status !== 'Active';
                    const eligibleCats = getEligibleCategories(athlete.birthYear);
                    const rankings = athlete.rankings;

                    return (
                        <div key={athlete.id} className={`p-5 rounded-xl border shadow-sm transition-all group relative ${getStatusColor(status?.status)}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => openProfile(athlete, 'overview')}>
                                        {athlete.name}
                                        {isIssue && <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${athlete.weapon === 'Foil' ? 'bg-yellow-100 text-yellow-700' : athlete.weapon === 'Epee' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                            {athlete.weapon}
                                        </span>
                                        <span className="text-slate-500 text-xs">{athlete.gender}</span>
                                        {eligibleCats.slice(0, 2).map(cat => (
                                            <span key={cat} className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">{cat.split(' ')[0]}</span>
                                        ))}
                                    </div>

                                    {/* Rankings Display */}
                                    {rankings && (rankings.national?.rank || rankings.fie?.rank || rankings.efc?.rank) && (
                                        <div className="mt-3 flex flex-wrap gap-2 cursor-pointer" onClick={() => openProfile(athlete, 'rankings')}>
                                            {rankings.national?.rank && (
                                                <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-700">
                                                    <span>🇬🇷</span>
                                                    <span className="font-bold">#{rankings.national.rank}</span>
                                                </div>
                                            )}
                                            {rankings.fie?.rank && (
                                                <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 border border-blue-100 text-xs text-blue-700">
                                                    <Globe className="w-3 h-3" />
                                                    <span className="font-bold">#{rankings.fie.rank}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => openProfile(athlete, 'overview')}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${isIssue ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                                        >
                                            <Activity className="w-3 h-3" />
                                            {status?.status || 'Active'}
                                        </button>

                                        <button
                                            onClick={() => openProfile(athlete, 'performance')}
                                            className="text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                        >
                                            <IconLineChart className="w-3 h-3" />
                                            Performance
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { if (confirm('Are you sure you want to delete this athlete?')) removeAthlete(athlete.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete Athlete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filteredAthletes.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-slate-900 font-medium mb-1">No athletes found</h3>
                        <p className="text-slate-500 text-sm">Get started by adding a new member to the club.</p>
                    </div>
                )}
            </div>

            {isAddModalOpen && <AthleteForm onClose={() => setIsAddModalOpen(false)} />}

            {selectedAthlete && (
                <AthleteProfileModal
                    athlete={selectedAthlete.athlete}
                    initialTab={selectedAthlete.tab}
                    onClose={() => setSelectedAthlete(null)}
                />
            )}
        </div>
    );
};

export default Athletes;
