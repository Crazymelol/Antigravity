import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Download, Printer } from 'lucide-react';

const BadgeGenerator = () => {
    const { athletes, referees } = useApp();
    const [selectedType, setSelectedType] = useState('athlete');
    const [selectedIds, setSelectedIds] = useState([]);
    const printRef = useRef();

    const people = selectedType === 'athlete' ? athletes : referees;

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const generateQRPattern = (id) => {
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const pattern = [];
        for (let i = 0; i < 16; i++) {
            pattern.push((hash * (i + 1)) % 2 === 0);
        }
        return pattern;
    };

    const handlePrint = () => {
        window.print();
    };

    const selectedPeople = people.filter(p => selectedIds.includes(p.id));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 print:hidden">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-rose-600" />
                    Badge Generator
                </h1>
                <p className="text-slate-500 mt-2">Create printable accreditation badges with QR codes</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 print:hidden">
                <div className="flex gap-4 items-center mb-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Badge Type</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setSelectedType('athlete'); setSelectedIds([]); }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === 'athlete'
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                Athletes
                            </button>
                            <button
                                onClick={() => { setSelectedType('referee'); setSelectedIds([]); }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedType === 'referee'
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                Referees
                            </button>
                        </div>
                    </div>
                    <div className="flex-1"></div>
                    <button
                        onClick={handlePrint}
                        disabled={selectedIds.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Printer className="w-5 h-5" />
                        Print {selectedIds.length} Badge{selectedIds.length !== 1 ? 's' : ''}
                    </button>
                </div>

                {/* Selection List */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {people.map(person => (
                        <button
                            key={person.id}
                            onClick={() => toggleSelection(person.id)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedIds.includes(person.id)
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-slate-200 hover:border-rose-200 hover:bg-rose-50/30'
                                }`}
                        >
                            <div className="font-medium text-slate-900">{person.name}</div>
                            <div className="text-xs text-slate-500">
                                {selectedType === 'athlete' ? person.weapon : person.level}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Badge Preview / Print Area */}
            <div ref={printRef} className="print:p-0">
                {selectedPeople.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                        {selectedPeople.map(person => (
                            <div key={person.id} className="bg-white rounded-xl border-4 border-slate-900 p-6 shadow-lg print:break-inside-avoid print:shadow-none">
                                {/* Header */}
                                <div className="text-center mb-4 pb-4 border-b-2 border-slate-200">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Official Accreditation
                                    </div>
                                    <div className={`inline-block px-4 py-1 rounded-full text-white font-bold ${selectedType === 'athlete' ? 'bg-indigo-600' : 'bg-emerald-600'
                                        }`}>
                                        {selectedType === 'athlete' ? 'ATHLETE' : 'REFEREE'}
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="flex justify-center mb-4">
                                    <div className="bg-white p-3 rounded-lg border-2 border-slate-900">
                                        <div className="grid grid-cols-4 gap-1 w-24 h-24">
                                            {generateQRPattern(person.id).map((filled, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`${filled ? 'bg-slate-900' : 'bg-white'} rounded-sm`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Person Info */}
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-900">{person.name}</h2>
                                    {selectedType === 'athlete' ? (
                                        <>
                                            <div className="text-lg text-slate-600">{person.weapon}</div>
                                            <div className="text-sm text-slate-500">
                                                Born: {new Date(person.dob).getFullYear()}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-lg font-semibold text-emerald-700">{person.level}</div>
                                            <div className="text-sm text-slate-600">
                                                {person.weapons?.join(', ')}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* ID */}
                                <div className="mt-4 pt-4 border-t-2 border-slate-200 text-center">
                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">ID</div>
                                    <div className="text-xs font-mono text-slate-600">{person.id.slice(0, 12)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm text-center print:hidden">
                        <CreditCard className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 text-lg">Select people to generate badges</p>
                    </div>
                )}
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:p-0, .print\\:p-0 * {
                        visibility: visible;
                    }
                    .print\\:p-0 {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BadgeGenerator;
