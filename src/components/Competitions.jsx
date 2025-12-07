import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Trash2, X, Calendar, MapPin, Trophy, CheckCircle, XCircle, Filter, ChevronRight } from 'lucide-react';
import { getEligibleCategories } from '../utils/categoryUtils';
import TournamentDetail from './TournamentDetail';

const CompetitionForm = ({ onClose }) => {
    const { addCompetition } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: '',
        category: 'Senior',
        type: 'National'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addCompetition(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Schedule Competition</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Competition Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="e.g. National Championship"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <input
                            required
                            type="date"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="e.g. Paris, France"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>U10</option>
                                <option>U13</option>
                                <option>Cadet</option>
                                <option>Junior</option>
                                <option>Senior</option>
                                <option>Veteran</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>National</option>
                                <option>FIE</option>
                                <option>EFC</option>
                                <option>Club</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm shadow-indigo-200 transition-colors"
                        >
                            Schedule Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Competitions = () => {
    const { competitions, removeCompetition, currentUser, athletes } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');

    // Get current athlete info for eligibility check
    const currentAthlete = currentUser?.role === 'athlete'
        ? athletes.find(a => a.id === currentUser.athleteId)
        : null;

    // Calculate eligible categories for the logged-in athlete
    const myCategories = currentAthlete
        ? getEligibleCategories(currentAthlete.birthYear)
        : [];

    const checkEligibility = (compCategory) => {
        if (!currentAthlete) return null; // Not an athlete

        // Normalize checking
        const isEligible = myCategories.some(myCat => {
            if (myCat.includes('Senior') && compCategory.includes('Senior')) return true;
            if (myCat.includes('Junior') && compCategory.includes('Junior')) return true;
            if (myCat.includes('Cadet') && compCategory.includes('Cadet')) return true;
            if (myCat.includes('U13') && compCategory.includes('U13')) return true;
            if (myCat.includes('U10') && compCategory.includes('U10')) return true;
            // Fallback strict check
            return compCategory.includes(myCat);
        });

        return isEligible;
    };

    // Filter and Sort
    const filteredCompetitions = competitions.filter(comp => {
        if (filterCategory === 'All') return true;
        return comp.category.includes(filterCategory);
    });

    const sortedCompetitions = [...filteredCompetitions].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Competitions</h1>
                    <p className="text-slate-500">Upcoming tournaments and events</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="All">All Categories</option>
                            <option value="U10">U10</option>
                            <option value="U13">U13</option>
                            <option value="Cadet">Cadet (U17)</option>
                            <option value="Junior">Junior (U20)</option>
                            <option value="Senior">Senior</option>
                        </select>
                    </div>

                    {currentUser?.role === 'coach' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Schedule
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {sortedCompetitions.map(comp => {
                    const dateObj = new Date(comp.date);
                    const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                    const isEligible = checkEligibility(comp.category);

                    return (
                        <div
                            key={comp.id}
                            onClick={() => setSelectedCompetition(comp)}
                            className={`flex flex-col md:flex-row md:items-center justify-between p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer ${isPast ? 'opacity-60 grayscale' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`
                            flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex-shrink-0
                            ${isPast ? 'bg-slate-50 text-slate-500 border-slate-100' : ''}
                        `}>
                                    <span className="text-xs font-bold uppercase">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-xl font-bold leading-none">{dateObj.getDate()}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                        {comp.name}
                                        {/* Eligibility Badge for Athletes */}
                                        {currentAthlete && !isPast && (
                                            isEligible ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide">
                                                    <CheckCircle className="w-3 h-3" /> Eligible
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide opacity-75">
                                                    X Ineligible
                                                </span>
                                            )
                                        )}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{comp.location}</span>
                                        <span className="flex items-center"><Trophy className="w-4 h-4 mr-1" />{comp.category}</span>
                                        {comp.type && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${comp.type === 'FIE' ? 'bg-blue-100 text-blue-700' :
                                                comp.type === 'EFC' ? 'bg-indigo-100 text-indigo-700' :
                                                    comp.type === 'National' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {comp.type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 md:mt-0 self-end md:self-center">
                                {currentUser?.role === 'coach' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this competition?')) removeCompetition(comp.id);
                                        }}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Competition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </div>
                        </div>
                    );
                })}

                {sortedCompetitions.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                            <Calendar className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-medium mb-1">No competitions found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting the filter or checking back later.</p>
                    </div>
                )}
            </div>

            {isModalOpen && <CompetitionForm onClose={() => setIsModalOpen(false)} />}
            {selectedCompetition && <TournamentDetail competition={selectedCompetition} onClose={() => setSelectedCompetition(null)} />}
        </div>
    );
};

export default Competitions;
