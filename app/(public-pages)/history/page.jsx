'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileTextIcon, GitCompareIcon, DownloadIcon, Trash2Icon, CalendarIcon, SearchIcon, ClockIcon } from 'lucide-react';
import SectionTitle from '@/components/section-title';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            fetchHistory(parsedUser.email);
        } else {
            router.push('/sign-in');
        }
    }, [router]);

    const fetchHistory = async (email) => {
        try {
            const res = await fetch(`https://project-sbom.onrender.com/reports/history?email=${email}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (reportId) => {
        try {
            const res = await fetch(`https://project-sbom.onrender.com/reports/export/${reportId}`);
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cyclonedx-sbom-${reportId}.json`;
            a.click();
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const handleDelete = async (reportId) => {
        if (!confirm("Are you sure you want to delete this scan report?")) return;
        try {
            const res = await fetch(`https://project-sbom.onrender.com/reports/${reportId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setHistory(prev => prev.filter(item => item.id !== reportId));
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleViewAnalysis = (reportId) => {
        router.push(`/sbom?reportId=${reportId}`);
    };

    const filteredHistory = history.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user) return null;

    return (
        <>
            {/* Background Gradients */}
            <motion.div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none"
                initial={{ opacity: 0.4 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute rounded-full top-80 left-2/5 -translate-x-1/2 size-130 bg-[#D10A8A] blur-[100px]" />
                <div className="absolute rounded-full top-80 right-0 -translate-x-1/2 size-130 bg-[#2E08CF] blur-[100px]" />
                <div className="absolute rounded-full top-0 left-1/2 -translate-x-1/2 size-130 bg-[#F26A06] blur-[100px]" />
            </motion.div>

            <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
                <SectionTitle title="Scan History" description="Access and export your previous SBOM intelligence reports." />

                <div className="mt-12">
                    {/* Search and Filter */}
                    <div className="mb-8 relative max-w-md">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <ClockIcon className="size-12 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-400 font-medium">Retrieving history...</p>
                        </div>
                    ) : filteredHistory.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredHistory.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-2xl -z-10 group-hover:scale-110 transition-transform" />

                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-2xl ${item.type === 'single' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                {item.type === 'single' ? <FileTextIcon className="size-6" /> : <GitCompareIcon className="size-6" />}
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-black ${item.score > 70 ? 'text-red-500' : item.score > 30 ? 'text-orange-500' : 'text-green-500'}`}>
                                                    {item.score}
                                                </div>
                                                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Risk Score</div>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white truncate mb-1" title={item.name}>{item.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                                            <CalendarIcon className="size-3" />
                                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleViewAnalysis(item.id)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                                                >
                                                    <SearchIcon className="size-4" />
                                                    View Analysis
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(item.id)}
                                                    className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                                    title="Download CycloneDX"
                                                >
                                                    <DownloadIcon className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    title="Delete entry"
                                                >
                                                    <Trash2Icon className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                            <div className="size-16 rounded-2xl bg-gray-800 text-gray-600 flex items-center justify-center mx-auto mb-6">
                                <SearchIcon className="size-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Reports Found</h3>
                            <p className="text-gray-400">You haven't performed any SBOM scans yet.</p>
                            <button
                                onClick={() => router.push('/sbom')}
                                className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all"
                            >
                                Start Your First Scan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
