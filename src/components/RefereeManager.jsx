import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Plus, Edit2, Trash2, Shield } from 'lucide-react';

const RefereeManager = () => {
    const { referees, addReferee, updateReferee, removeReferee } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        level: 'Regional',
        email: '',
        phone: '',
        weapons: []
    });

    const levels = ['Regional', 'National', 'FIE'];
    const weapons = ['Foil', 'Epee', 'Sabre'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateReferee(editingId, formData);
        } else {
            addReferee(formData);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', level: 'Regional', email: '', phone: '', weapons: [] });
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleEdit = (referee) => {
        setFormData(referee);
        setEditingId(referee.id);
        setIsFormOpen(true);
    };

    const toggleWeapon = (weapon) => {
        setFormData(prev => ({
            ...prev,
            weapons: prev.weapons.includes(weapon)
                ? prev.weapons.filter(w => w !== weapon)
                : [...prev.weapons, weapon]
        }));
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        Referee Management
                    </h1>
                    <p className="text-slate-500 mt-2">Manage referee database and assignments</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Add Referee
                </button>
            </div>

            {/* Referee List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {referees.map(ref => (
                    <div key={ref.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-900">{ref.name}</h3>
                                <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full mt-1">
                                    {ref.level}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(ref)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => removeReferee(ref.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                            <p className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4" />
                                {ref.weapons.join(', ') || 'No weapons'}
                            </p>
                            {ref.email && <p className="text-xs">{ref.email}</p>}
                            {ref.phone && <p className="text-xs">{ref.phone}</p>}
                        </div>
                    </div>
                ))}
                {referees.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No referees added yet. Click "Add Referee" to get started.</p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {editingId ? 'Edit Referee' : 'Add Referee'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                                <select
                                    value={formData.level}
                                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Weapons</label>
                                <div className="flex gap-2">
                                    {weapons.map(weapon => (
                                        <button
                                            key={weapon}
                                            type="button"
                                            onClick={() => toggleWeapon(weapon)}
                                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${formData.weapons.includes(weapon)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {weapon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    {editingId ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefereeManager;
