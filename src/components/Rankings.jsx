import React from 'react';
import { Trophy, ExternalLink, Globe } from 'lucide-react';

const Rankings = () => {
    const rankingLinks = [
        { id: '113769', url: 'https://fencing.ophardt.online/en/show-ranking/html/113769', label: 'Hellenic Ranking List 1', category: 'General' },
        { id: '113284', url: 'https://fencing.ophardt.online/en/show-ranking/html/113284', label: 'Hellenic Ranking List 2', category: 'General' },
        { id: '113282', url: 'https://fencing.ophardt.online/en/show-ranking/html/113282', label: 'Hellenic Ranking List 3', category: 'General' },
        { id: '114107', url: 'https://fencing.ophardt.online/en/show-ranking/html/114107', label: 'Hellenic Ranking List 4', category: 'General' },
        { id: '113792', url: 'https://fencing.ophardt.online/en/show-ranking/html/113792', label: 'Hellenic Ranking List 5', category: 'General' },
        { id: '113285', url: 'https://fencing.ophardt.online/en/show-ranking/html/113285', label: 'Hellenic Ranking List 6', category: 'General' },
        { id: '113283', url: 'https://fencing.ophardt.online/en/show-ranking/html/113283', label: 'Hellenic Ranking List 7', category: 'General' },
        { id: '114109', url: 'https://fencing.ophardt.online/en/show-ranking/html/114109', label: "Women's Sabre U20 (2025)", category: 'Sabre' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Rankings</h1>
                <p className="text-slate-500">Official Hellenic Federation Ranking Lists</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rankingLinks.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between h-32"
                    >
                        <div className="flex items-start justify-between">
                            <div className="bg-amber-50 p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                <Trophy className="w-6 h-6 text-amber-500 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Ophardt Online
                            </div>
                            <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                {link.label}
                            </h3>
                        </div>
                    </a>
                ))}
            </div>

            <div className="bg-slate-100 p-4 rounded-xl text-center text-sm text-slate-500">
                Data provided by Ophardt Online. Click any card to view the official ranking list.
            </div>
        </div>
    );
};

export default Rankings;
