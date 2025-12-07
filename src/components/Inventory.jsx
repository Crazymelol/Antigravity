import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Plus, Edit2, Trash2, UserCheck, UserX, Search } from 'lucide-react';

const Inventory = () => {
    const { inventory, addInventoryItem, updateInventoryItem, removeInventoryItem, assignEquipment, returnEquipment, athletes } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState('all'); // all, available, assigned
    const [formData, setFormData] = useState({
        name: '',
        type: 'Mask',
        size: '',
        condition: 'Good',
        notes: ''
    });

    const types = ['Mask', 'Jacket', 'Glove', 'Weapon', 'Body Cord', 'Bag', 'Other'];
    const conditions = ['Excellent', 'Good', 'Fair', 'Needs Repair'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateInventoryItem(editingId, formData);
        } else {
            addInventoryItem(formData);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', type: 'Mask', size: '', condition: 'Good', notes: '' });
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleEdit = (item) => {
        setFormData({ name: item.name, type: item.type, size: item.size, condition: item.condition, notes: item.notes || '' });
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    const filteredInventory = inventory.filter(item => {
        if (filter === 'available') return !item.assignedTo;
        if (filter === 'assigned') return item.assignedTo;
        return true;
    });

    const getConditionColor = (condition) => {
        switch (condition) {
            case 'Excellent': return 'bg-emerald-100 text-emerald-700';
            case 'Good': return 'bg-blue-100 text-blue-700';
            case 'Fair': return 'bg-amber-100 text-amber-700';
            case 'Needs Repair': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Package className="w-8 h-8 text-indigo-600" />
                        Inventory & Armory
                    </h1>
                    <p className="text-slate-500 mt-2">Track equipment and manage assignments</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Add Equipment
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { key: 'all', label: 'All Items', count: inventory.length },
                    { key: 'available', label: 'Available', count: inventory.filter(i => !i.assignedTo).length },
                    { key: 'assigned', label: 'Assigned', count: inventory.filter(i => i.assignedTo).length }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === tab.key
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map(item => {
                    const assignedAthlete = item.assignedTo ? athletes.find(a => a.id === item.assignedTo) : null;
                    return (
                        <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                                            {item.type}
                                        </span>
                                        {item.size && (
                                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                                                {item.size}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => removeInventoryItem(item.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className={`inline-block text-xs px-2 py-1 rounded-full ${getConditionColor(item.condition)}`}>
                                    {item.condition}
                                </span>

                                {assignedAthlete ? (
                                    <div className="pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm">
                                                <UserCheck className="w-4 h-4 text-emerald-600" />
                                                <span className="text-slate-700">{assignedAthlete.name}</span>
                                            </div>
                                            <button
                                                onClick={() => returnEquipment(item.id)}
                                                className="text-xs px-2 py-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                            >
                                                Return
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Since {new Date(item.assignedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="pt-2 border-t border-slate-100">
                                        <select
                                            onChange={(e) => e.target.value && assignEquipment(item.id, e.target.value)}
                                            className="w-full text-sm px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            defaultValue=""
                                        >
                                            <option value="">Assign to athlete...</option>
                                            {athletes.map(athlete => (
                                                <option key={athlete.id} value={athlete.id}>{athlete.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {item.notes && (
                                    <p className="text-xs text-slate-500 italic mt-2">{item.notes}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filteredInventory.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No equipment found. Click "Add Equipment" to get started.</p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {editingId ? 'Edit Equipment' : 'Add Equipment'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name/Description</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Blue Mask #3"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="S, M, L, etc."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                                <select
                                    value={formData.condition}
                                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {conditions.map(cond => (
                                        <option key={cond} value={cond}>{cond}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="2"
                                    placeholder="Any additional notes..."
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

export default Inventory;
