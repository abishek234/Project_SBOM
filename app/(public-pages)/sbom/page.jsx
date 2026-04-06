'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadIcon, FileTextIcon, GitCompareIcon, CheckCircleIcon, AlertTriangleIcon, PackageIcon, LockIcon, ChevronDownIcon, InfoIcon, ExternalLinkIcon } from 'lucide-react';
import SectionTitle from '@/components/section-title';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import RiskCharts from '@/components/risk-charts';
import RiskFactorChart from '@/components/risk-factor-chart';

export default function ProjectRiskPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <ProjectRiskContent />
        </Suspense>
    );
}

function ProjectRiskContent() {
    // [Move all logic from original SBOMpage here]
    // State: Auth
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                setUser(null);
            }
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const searchParams = useSearchParams();
    const reportId = searchParams.get('reportId');

    useEffect(() => {
        if (reportId && user) {
            fetchSavedReport(reportId);
        }
    }, [reportId, user]);

    const fetchSavedReport = async (id) => {
        setStep('scanning');
        setScanStatus('Retrieving saved report...');
        try {
            const res = await fetch(`https://project-sbom.onrender.com/reports/${id}`);
            console.log(res);
            if (res.ok) {
                const data = await res.json();
                setMode(data.type);
                // For diffs, we need to ensure the dashboard sees the full component lists
                if (data.type === 'diff') {
                    // Inject components into the results so charts and comparison cards work
                    setResults({
                        ...data,
                        riskScore: data.v2_score || 0, // Normalize for dashboard parity
                        components: data.v2_components || [], // Normalize for dashboard parity
                        components1: data.v1_components || [],
                        components2: data.v2_components || []
                    });
                } else {
                    setResults(data);
                }
                setScanProgress(100);
                setTimeout(() => setStep('results'), 500);
            } else {
                alert("Failed to load report. It might have been deleted.");
                setStep('selection');
            }
        } catch (err) {
            console.error("Fetch saved report failed", err);
            setStep('selection');
        }
    };

    // State: Flow
    const [mode, setMode] = useState(null); // 'single', 'diff', or null (selection)
    const [step, setStep] = useState('selection'); // selection, upload, scanning, results
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatus, setScanStatus] = useState('Extracting...');
    const [results, setResults] = useState(null);
    const [expandedPackage, setExpandedPackage] = useState(null); // Track which package is expanded

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Validation for diff mode
        if (mode === 'diff' && files.length < 2) {
            alert("Please select exactly two zip files for comparison.");
            return;
        }

        setStep('scanning');
        setScanProgress(5); // Start at 5% immediately to avoid "stuck at 0" UX
        setScanStatus('Initializing Genesis Intelligence Engine...');

        try {
            const formData = new FormData();
            formData.append("email", user.email);

            let endpoint = '';
            if (mode === 'single') {
                formData.append("file", files[0]);
                endpoint = 'https://project-sbom.onrender.com/scan/code';
            } else {
                formData.append("file1", files[0]);
                formData.append("file2", files[1]);
                endpoint = 'https://project-sbom.onrender.com/scan/diff';
            }

            // Start Simulated Progress
            const statusMessages = [
                "Parsing directory structure...",
                "Identifying dependency manifests...",
                "Querying OSV.dev vulnerability database...",
                "Calculating transitive risk factors...",
                "Finalizing risk intelligence report..."
            ];

            let curProgress = 5;
            const interval = setInterval(() => {
                curProgress += Math.random() * 10;
                if (curProgress > 95) {
                    clearInterval(interval);
                } else {
                    setScanProgress(Math.round(curProgress));
                    setScanStatus(statusMessages[Math.floor(((curProgress - 5) / 95) * statusMessages.length)] || "Analyzing...");
                }
            }, 600);

            // Real API Call
            const res = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            clearInterval(interval);

            if (res.ok) {
                const data = await res.json();
                setScanProgress(100);
                setScanStatus('Analysis complete!');

                if (mode === 'diff') {
                    setResults({
                        ...data,
                        riskScore: data.v2_score || 0,
                        components: data.v2_components || [],
                        components1: data.v1_components || [],
                        components2: data.v2_components || []
                    });
                } else {
                    setResults(data);
                }

                setTimeout(() => setStep('results'), 500);
            } else {
                const error = await res.json();
                alert(error.detail || 'Analysis failed. Check your connection to https://project-sbom.onrender.com');
                setStep('upload');
            }
        } catch (err) {
            console.error(err);
            alert('Connection error. Is the backend running on https://project-sbom.onrender.com?');
            setStep('upload');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center">
                <SectionTitle title="Project Risk Management System" description="Please log in to access the scanning tools." />
                <button
                    onClick={() => router.push('/sign-in')}
                    className="btn bg-blue-600 hover:bg-blue-500 text-white mt-8 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    Sign In to Continue
                </button>
            </div>
        )
    }

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

            <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <SectionTitle title="Project Risk Management System" description={`Welcome back, ${user.full_name}`} />

                <div className="mt-12">
                    <AnimatePresence mode="wait">

                        {/* Mode Selection Screen */}
                        {step === 'selection' && (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => { setMode('single'); setStep('upload'); }}
                                        className={`p-8 rounded-3xl border-2 transition-all cursor-pointer group ${mode === 'single' ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className="size-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 shadow-inner">
                                            <FileTextIcon className="size-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Single Code Scan</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">Upload a zip file to receive a detailed Project Risk and intelligence report.</p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => { setMode('diff'); setStep('upload'); }}
                                        className={`p-8 rounded-3xl border-2 transition-all cursor-pointer group ${mode === 'diff' ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className="size-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 shadow-inner">
                                            <GitCompareIcon className="size-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Version Risk Audit (Diff)</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">Compare two versions to detect newly introduced risks and generate a difference SBOM.</p>
                                    </motion.div>
                                </div>

                                {/* Examples Section */}
                                <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="size-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                                            <ExternalLinkIcon className="size-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">Ready to Test?</h4>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Use these sample files stored in `/examples`</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { name: 'vulnerable-legacy.zip', desc: 'Tests Risk Scores & CVE flags', color: 'red' },
                                            { name: 'enterprise-app-v1.zip', desc: 'Tests Frontend/Backend Isolation', color: 'blue' },
                                            { name: 'enterprise-app-v2.zip', desc: 'Perfect for Diff comparisons', color: 'purple' },
                                            { name: 'safe-modern.zip', desc: 'Tests Clean/Safe state UI', color: 'green' }
                                        ].map((ex) => (
                                            <div key={ex.name} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-default">
                                                <div className="font-bold text-gray-200 text-xs mb-1 truncate">{ex.name}</div>
                                                <div className="text-[10px] text-gray-500 mb-2">{ex.desc}</div>
                                                <div className={`h-1 w-8 rounded-full bg-${ex.color}-500 opacity-50`} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-600 bg-black/20 p-3 rounded-xl border border-white/5">
                                        <InfoIcon className="size-3 shrink-0" />
                                        <p>Note: These files are generated in the project root under the `/examples` folder. You can drag and drop them from your file explorer into the upload zone.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Upload Screen */}
                        {step === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="max-w-2xl mx-auto"
                            >
                                <button onClick={() => setStep('selection')} className="text-sm text-gray-400 hover:text-white mb-4 flex items-center gap-1">
                                    &larr; Back to Selection
                                </button>

                                <div className="border-2 border-dashed border-gray-700 bg-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                                    <UploadIcon className="size-16 text-gray-600 mb-6" />
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {mode === 'single' ? 'Upload Source Code (Zip)' : 'Upload Version 1 & Version 2 Zips'}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-8">
                                        Supports .zip containing package.json or requirements.txt
                                    </p>
                                    <label className="btn bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
                                        <input type="file" className="hidden" multiple={mode === 'diff'} onChange={handleFileUpload} />
                                        Select Files
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {/* Scanning Animation */}
                        {step === 'scanning' && (
                            <motion.div className="flex flex-col items-center justify-center py-20">
                                <div className="text-4xl font-bold text-white mb-4">{scanProgress}%</div>
                                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                    />
                                </div>
                                <p className="mt-4 text-gray-400 animate-pulse font-medium">
                                    {scanStatus}
                                </p>
                            </motion.div>
                        )}

                        {/* Results View */}
                        {step === 'results' && results && (
                            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex justify-between items-center mb-8 px-2">
                                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                            <CheckCircleIcon className="size-6 text-white" />
                                        </div>
                                        Analysis Results
                                    </h2>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={async () => {
                                                if (!results?.reportId) return;
                                                const res = await fetch(`https://project-sbom.onrender.com/reports/export/${results.reportId}`);
                                                const blob = await res.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `sbom-${results.reportId}.json`;
                                                a.click();
                                            }}
                                            className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-full text-sm font-bold text-blue-400 transition-all flex items-center gap-2"
                                        >
                                            <FileTextIcon className="size-4" />
                                            Export CycloneDX
                                        </button>
                                        <button
                                            onClick={() => { setStep('selection'); setResults(null); }}
                                            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                                        >
                                            Start New Scan
                                        </button>
                                    </div>
                                </div>

                                {/* Top Priority Banner */}
                                {results?.topPriority && (
                                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center">
                                                <AlertTriangleIcon className="size-5" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 block mb-1">Top Priority Action</span>
                                                <span className="text-base text-gray-200 font-bold">{results.topPriority}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {mode === 'diff' && (
                                    <div className="space-y-12 mb-12">
                                        <div className="flex items-center gap-2 mb-2 px-2">
                                            <div className="size-2 rounded-full bg-purple-500" />
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Changes at a Glance</div>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 bg-green-500/5 backdrop-blur-md border border-green-500/10 p-8 rounded-3xl">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-green-400 font-black uppercase tracking-widest text-xs">Added Packages</h3>
                                                    <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-[10px] font-bold">+{(results?.added || []).length}</div>
                                                </div>
                                                <div className="space-y-4">
                                                    {(results?.added || []).map((p, i) => {
                                                        const pId = `added-${i}`;
                                                        return (
                                                            <div key={pId} className={`p-4 bg-black/40 rounded-2xl border transition-all cursor-pointer ${expandedPackage === pId ? 'border-green-500/50' : 'border-white/5'}`} onClick={() => setExpandedPackage(expandedPackage === pId ? null : pId)}>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="text-sm font-bold text-white">{p.name} <span className="text-gray-500 font-normal">v{p.version}</span></div>
                                                                    <div className="flex items-center gap-2">
                                                                        {p.cvss > 0 && (
                                                                            <div className={`text-[10px] font-black px-2 py-0.5 rounded border ${p.cvss >= 9 ? 'bg-red-500/20 text-red-400 border-red-500/30' : p.cvss >= 7 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                                                                CVSS {p.cvss}
                                                                            </div>
                                                                        )}
                                                                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.score >= 50 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>Score: {p.score}</div>
                                                                    </div>
                                                                </div>
                                                                <AnimatePresence>
                                                                    {expandedPackage === pId && (
                                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mt-4 pt-4 border-t border-white/5 space-y-4">
                                                                            <p className="text-[10px] text-gray-400 leading-relaxed">{p.explanation || "No major red-flags identified for this new dependency."}</p>
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                {Object.entries(p.factor_points || {}).map(([label, pts]) => pts > 0 && (
                                                                                    <div key={label} className="bg-white/5 p-2 rounded-lg border border-white/5">
                                                                                        <div className="text-[8px] text-gray-500 uppercase">{label}</div>
                                                                                        <div className="text-xs font-bold text-white">+{pts}</div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex-1 bg-red-500/5 backdrop-blur-md border border-red-500/10 p-8 rounded-3xl">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-red-800 font-black uppercase tracking-widest text-xs">Removed Packages</h3>
                                                    <div className="px-2 py-1 bg-red-800/20 text-red-800 rounded-md text-[10px] font-bold">-{(results?.removed || []).length}</div>
                                                </div>
                                                <div className="space-y-3">
                                                    {(results?.removed || []).map((p, i) => (
                                                        <div key={i} className="p-3 bg-black/20 rounded-xl border border-white/5 flex items-center gap-3">
                                                            <div className="text-red-500 font-bold">-</div>
                                                            <div className="text-sm font-bold text-white truncate">{p.name} <span className="text-gray-500 text-[10px] font-normal">v{p.version}</span></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex-1 bg-yellow-500/5 backdrop-blur-md border border-yellow-500/10 p-8 rounded-3xl">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-yellow-400 font-black uppercase tracking-widest text-xs">Updated Versions</h3>
                                                    <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md text-[10px] font-bold">~{(results?.updated || []).length}</div>
                                                </div>
                                                <div className="space-y-4">
                                                    {(results?.updated || []).map((p, i) => {
                                                        const pId = `updated-${i}`;
                                                        return (
                                                            <div key={pId} className={`p-4 bg-black/40 rounded-2xl border transition-all cursor-pointer ${expandedPackage === pId ? 'border-yellow-500/50' : 'border-white/5'}`} onClick={() => setExpandedPackage(expandedPackage === pId ? null : pId)}>
                                                                <div className="text-sm font-bold text-white mb-2">{p.name}</div>
                                                                <div className="flex items-center gap-2 text-[10px] mb-3">
                                                                    <span className="text-red-400">v{p.oldVersion}</span>
                                                                    <span className="text-gray-600">→</span>
                                                                    <span className="text-green-400">v{p.newVersion}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    {p.cvss > 0 && (
                                                                        <div className={`text-[10px] font-black px-2 py-0.5 rounded border ${p.cvss >= 9 ? 'bg-red-500/20 text-red-400 border-red-500/30' : p.cvss >= 7 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                                                            CVSS {p.cvss}
                                                                        </div>
                                                                    )}
                                                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${p.score >= 50 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>Risk Score: {p.score}</div>
                                                                </div>
                                                                <AnimatePresence>
                                                                    {expandedPackage === pId && (
                                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mt-4 pt-4 border-t border-white/5 space-y-4">
                                                                            <p className="text-[10px] text-gray-400 leading-relaxed">{p.explanation || "No critical risks detected in this version update."}</p>
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                {Object.entries(p.factor_points || {}).map(([label, pts]) => pts > 0 && (
                                                                                    <div key={label} className="bg-white/5 p-2 rounded-lg border border-white/5">
                                                                                        <div className="text-[8px] text-gray-500 uppercase">{label}</div>
                                                                                        <div className="text-xs font-bold text-white">+{pts}</div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Visualization Charts Section (Universal) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2 px-2">
                                            <div className="size-2 rounded-full bg-blue-500" />
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                {mode === 'single' ? 'Intelligence Insights' : 'Overall Project Intelligence'}
                                            </div>
                                        </div>
                                        <RiskCharts packages={results?.components?.flatMap(c => c.packages) || []} overallScore={results?.riskScore} />
                                    </div>

                                    <div className="flex justify-between items-center px-2">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <PackageIcon className="size-5 text-blue-400" />
                                            {mode === 'single' ? 'Component Analysis' : 'Overall Component Analysis'}
                                        </h3>
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                            {results?.components?.length || 0} Components Detected
                                        </span>
                                    </div>

                                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="flex justify-between items-center w-full">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Intelligence</div>
                                                    <h3 className="text-3xl font-black text-white tracking-tighter">Project Health Score</h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className={`text-6xl font-black tracking-tighter ${results.riskScore < 30 ? 'text-green-500' : results.riskScore < 70 ? 'text-orange-500' : 'text-red-500'}`}>
                                                        {Math.round(100 - results.riskScore)}<span className="text-2xl opacity-50">/100</span>
                                                    </div>
                                                    <div className="text-gray-500 font-bold uppercase text-[10px]">Health Index</div>
                                                </div>
                                                <div className={`h-16 w-1 rounded-full ${results.riskScore > 50 ? 'bg-red-500/50' : 'bg-green-500/50'}`} />
                                                {results.riskScore > 50 ? (
                                                    <div className="max-w-[200px] text-red-400 text-sm font-medium leading-tight">
                                                        ⚠ Multiple high-risk dependencies detected. Immediate review recommended.
                                                    </div>
                                                ) : (
                                                    <div className="max-w-[200px] text-green-400 text-sm font-medium leading-tight">
                                                        ✓ Project structure appears stable with no major red-flags.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Risk Categories Grouping */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: "Security Risk", value: `${results?.categories?.security || 0} pts`, desc: "Vulnerabilities & CVEs", color: "text-red-400", border: "border-red-500/30" },
                                            { label: "Legal Risk", value: `${results?.categories?.legal || 0} pts`, desc: "Compliance & Licensing", color: "text-yellow-400", border: "border-yellow-500/30" },
                                            { label: "Operational Risk", value: `${results?.categories?.operational || 0} pts`, desc: "Maintenance & Stale Code", color: "text-blue-400", border: "border-blue-500/30" }
                                        ].map((f, i) => (
                                            <motion.div
                                                key={f.label}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`p-6 bg-white/5 border ${f.border} rounded-3xl flex flex-col gap-2 relative overflow-hidden`}
                                            >
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{f.label}</div>
                                                <div className={`text-4xl font-black ${f.color}`}>
                                                    {f.value}
                                                </div>
                                                <div className="text-xs text-gray-500 font-bold">{f.desc}</div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="space-y-12">
                                        {(results?.components || []).map((comp, ci) => (
                                            <div key={ci} className="space-y-4">
                                                <div className="flex items-center gap-3 px-2">
                                                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase text-blue-400">
                                                        {comp.type}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-white truncate">{comp.name}</h4>
                                                    <div className="h-px flex-1 bg-white/5" />
                                                </div>

                                                <div className="space-y-4">
                                                    {comp.packages.map((pkg, i) => {
                                                        const packageId = `${ci}-${i}`;
                                                        return (
                                                            <motion.div
                                                                key={packageId}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: i * 0.05 }}
                                                                className={`p-6 bg-white/5 border rounded-2xl transition-all hover:bg-white/[0.07] cursor-pointer group/card ${pkg.score >= 50 ? 'border-red-500/30' : 'border-white/10'}`}
                                                                onClick={() => setExpandedPackage(expandedPackage === packageId ? null : packageId)}
                                                            >
                                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="size-12 rounded-xl flex items-center justify-center transition-transform group-hover/card:scale-110 bg-gray-800 text-gray-500">
                                                                            <PackageIcon className="size-6" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-bold text-xl text-white group-hover/card:text-blue-400 transition-colors">{pkg.name}</span>
                                                                                <span className="text-gray-500 text-sm">v{pkg.version}</span>
                                                                            </div>
                                                                            <div className="text-sm text-gray-400 mt-0.5">
                                                                                {pkg.desc || 'Public OSS Package'}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-4">
                                                                        <div className="text-right hidden md:block">
                                                                            <div className="flex items-center justify-end gap-2 mb-1">
                                                                                {pkg.cvss > 0 && (
                                                                                    <div className={`text-[10px] font-black px-2 py-0.5 rounded border ${pkg.cvss >= 9 ? 'bg-red-500/20 text-red-400 border-red-500/30' : pkg.cvss >= 7 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                                                                        CVSS {pkg.cvss}
                                                                                    </div>
                                                                                )}
                                                                                <div className={`text-lg font-black ${pkg.level === 'CRITICAL' ? 'text-red-500' : pkg.level === 'HIGH' ? 'text-orange-500' : pkg.level === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'}`}>
                                                                                    {pkg.level}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-xs text-gray-500 font-medium">Risk Score: {pkg.score}/100</div>
                                                                        </div>
                                                                        <motion.div
                                                                            animate={{ rotate: expandedPackage === packageId ? 180 : 0 }}
                                                                            className="size-8 bg-white/5 rounded-full flex items-center justify-center text-gray-500 group-hover/card:text-white transition-colors"
                                                                        >
                                                                            <ChevronDownIcon className="size-4" />
                                                                        </motion.div>
                                                                    </div>
                                                                </div>

                                                                <AnimatePresence>
                                                                    {expandedPackage === packageId && (
                                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                                            <div className="mt-6 pt-6 border-t border-white/5 space-y-6">
                                                                                <div>
                                                                                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                                                                                        <InfoIcon className="size-3 text-blue-500" />
                                                                                        Package Risk Profile (%)
                                                                                    </h5>
                                                                                    <RiskFactorChart factors={pkg.factor_points} />
                                                                                </div>
                                                                                {pkg.explanation && (
                                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                        <div className={`p-4 rounded-2xl text-sm border ${pkg.score >= 50 ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-blue-500/5 border-blue-500/10 text-gray-400'}`}>
                                                                                            <p className="leading-relaxed text-xs"><b className="text-white block mb-1">Contextual Intel:</b> {pkg.explanation}</p>
                                                                                        </div>
                                                                                        {pkg.remediation && (
                                                                                            <div className="p-4 rounded-2xl text-sm border bg-green-500/10 border-green-500/20 text-green-300">
                                                                                                <p className="leading-relaxed text-xs"><b className="text-white block mb-1">Remediation Advice:</b> {pkg.remediation}</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}