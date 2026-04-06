'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, ShieldCheckIcon, GitCompareIcon, AlertTriangleIcon, FileTextIcon, ZapIcon, PackageIcon, DatabaseIcon, TrendingUpIcon, LockIcon } from 'lucide-react';

export default function FeaturesPage() {
    const features = [
        {
            icon: ShieldCheckIcon,
            title: "Multi-Factor Risk Scoring",
            description: "Comprehensive 0-100 risk assessment based on CVEs, version age, license status, package popularity, and maintenance activity. Prioritize security efforts effectively."
        },
        {
            icon: AlertTriangleIcon,
            title: "Contextual Threat Explanations",
            description: "Plain-language security insights instead of generic warnings. Example: 'log4j in your logging module could allow remote code execution if exploited.'"
        },
        {
            icon: GitCompareIcon,
            title: "SBOM Version Comparison",
            description: "Track dependency changes between releases. Identify newly added libraries, removed packages, and version updates to understand supply chain evolution."
        },
        {
            icon: FileTextIcon,
            title: "CycloneDX Standard Format",
            description: "Industry-standard SBOM generation compatible with CISA guidelines, NTIA requirements, and major security scanning tools."
        },
        {
            icon: ZapIcon,
            title: "Automated Dependency Detection",
            description: "Upload project files or ZIP archives. Automatic parsing of package.json, requirements.txt, pom.xml, go.mod, and other lock files."
        },
        {
            icon: DatabaseIcon,
            title: "OSV & NVD Integration",
            description: "Real-time vulnerability data from Open Source Vulnerabilities database and National Vulnerability Database. Stay updated on emerging threats."
        },
        {
            icon: TrendingUpIcon,
            title: "License Compliance Tracking",
            description: "Identify missing, incompatible, or restrictive licenses. Ensure legal compliance and avoid licensing conflicts in your supply chain."
        },
        {
            icon: LockIcon,
            title: "API Access for CI/CD",
            description: "Integrate SBOM generation into your build pipeline. Automate scans, set risk thresholds, and fail builds based on custom security policies."
        }
    ];

    return (
        <>
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

            <main className='px-4'>
                {/* Hero Section */}
                <motion.section className="flex flex-col items-center">
                    <motion.div className="flex items-center gap-3 mt-32"
                        initial={{ y: -20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <p>Risk-Aware Analysis</p>
                        <button className="btn glass py-1 px-3 text-xs">
                            Intelligent
                        </button>
                    </motion.div>
                    <motion.h1 className="text-center text-4xl/13 md:text-6xl/19 mt-4 font-semibold tracking-tight max-w-3xl"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        Risk Management Features
                    </motion.h1>
                    <motion.p className="text-center text-gray-100 text-base/7 max-w-2xl mt-6 px-4"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        Our Risk Management System goes beyond basic dependency lists. With intelligent risk analysis, contextual threat explanations, and seamless CI/CD integration, you get actionable security insights that help your team prioritize vulnerabilities and maintain compliance with industry standards like Executive Order 14028.
                    </motion.p>

                    <motion.div className="flex flex-col md:flex-row max-md:w-full items-center gap-4 md:gap-3 mt-6"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <Link href="/sign-in" className="btn max-md:w-full bg-white text-gray-800 py-3">
                            Try It Now
                        </Link>
                        <Link href="/pricing" className="btn max-md:w-full glass py-3">
                            View Pricing
                        </Link>
                    </motion.div>
                </motion.section>

                {/* Key Features - Alternating Layout for ALL items */}
                <section className="mt-32 space-y-32">
                    {features.map((feature, index) => {
                        const isEven = index % 2 === 0;

                        // Define custom visual renderers for features without unique images
                        const renderVisual = (idx) => {
                            switch (idx) {
                                case 4: // Automated Dependency Detection
                                    return (
                                        <div className="w-full aspect-video bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-8 flex flex-col justify-center gap-4 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                            {/* File Tree Animation */}
                                            {['package.json', 'go.mod', 'pom.xml', 'requirements.txt'].map((file, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 transform transition-transform group-hover:translate-x-2" style={{ transitionDelay: `${i * 100}ms` }}>
                                                    <div className="size-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                        <FileTextIcon className="size-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm text-gray-200 font-mono">{file}</div>
                                                        <div className="h-1.5 w-12 bg-gray-700/50 rounded-full mt-1.5" />
                                                    </div>
                                                    <div className="text-xs text-green-400 font-mono">Parsed</div>
                                                </div>
                                            ))}
                                        </div>
                                    );

                                case 5: // OSV & NVD Integration
                                    return (
                                        <div className="w-full aspect-video bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
                                            <div className="relative z-10 grid grid-cols-2 gap-8">
                                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-3 backdrop-blur-xl group-hover:-translate-y-2 transition-transform duration-500">
                                                    <DatabaseIcon className="size-10 text-orange-400" />
                                                    <span className="font-bold text-white">NVD</span>
                                                </div>
                                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-3 backdrop-blur-xl group-hover:translate-y-2 transition-transform duration-500">
                                                    <DatabaseIcon className="size-10 text-purple-400" />
                                                    <span className="font-bold text-white">OSV</span>
                                                </div>
                                            </div>
                                            {/* Connecting Lines */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                            </div>
                                        </div>
                                    );
                                case 6: // License Compliance
                                    return (
                                        <div className="w-full aspect-video bg-black/40 backdrop-blur-md rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center group">
                                            <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
                                            <div className="bg-white/95 text-gray-900 w-64 h-80 rounded-lg shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 p-6 flex flex-col">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="size-12 rounded-full border-4 border-yellow-500/30 flex items-center justify-center">
                                                        <ShieldCheckIcon className="size-6 text-yellow-600" />
                                                    </div>
                                                    <div className="text-xs font-mono text-gray-400">MIT-01</div>
                                                </div>
                                                <div className="space-y-3 flex-1">
                                                    <div className="h-2 w-3/4 bg-gray-200 rounded" />
                                                    <div className="h-2 w-full bg-gray-200 rounded" />
                                                    <div className="h-2 w-5/6 bg-gray-200 rounded" />
                                                </div>
                                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2">
                                                    <div className="size-4 rounded-full bg-green-500" />
                                                    <span className="text-xs font-bold text-green-700">COMPLIANT</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                case 7: // API Access
                                    return (
                                        <div className="w-full aspect-video bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden font-mono text-xs md:text-sm p-4 relative group shadow-2xl">
                                            <div className="flex items-center gap-1.5 mb-4 border-b border-white/10 pb-4">
                                                <div className="size-3 rounded-full bg-red-500" />
                                                <div className="size-3 rounded-full bg-yellow-500" />
                                                <div className="size-3 rounded-full bg-green-500" />
                                                <div className="ml-auto text-gray-500">bash</div>
                                            </div>
                                            <div className="text-green-400">
                                                <span className="text-pink-400">$</span> curl -X POST https://api.verix.sbom/v1/scan \
                                            </div>
                                            <div className="pl-4 text-green-400 mb-2">
                                                -H "Authorization: Bearer <span className="text-yellow-300">sk_live_...</span>" \
                                            </div>
                                            <div className="text-gray-400 animate-pulse">
                                                Scanning dependencies... <br />
                                                [+] Found 243 packages <br />
                                                [!] Critical vulnerability detected: log4j-core <br />
                                                <span className="text-blue-400">Report generated: sbom-1289.json</span>
                                            </div>
                                        </div>
                                    );
                                case 0: // Multi-Factor Risk Scoring
                                    return (
                                        <div className="w-full aspect-video bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-8 flex items-center justify-center relative overflow-hidden">
                                            {/* Radar Sweep Background */}
                                            <motion.div
                                                className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(239,68,68,0.1)_360deg)]"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            />

                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="size-40 rounded-full border-8 border-white/5 flex items-center justify-center relative bg-black/20 backdrop-blur-sm">
                                                    <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                        <motion.circle
                                                            cx="50" cy="50" r="46"
                                                            stroke="currentColor"
                                                            strokeWidth="8"
                                                            fill="transparent"
                                                            className="text-red-500"
                                                            strokeLinecap="round"
                                                            initial={{ pathLength: 0 }}
                                                            animate={{ pathLength: [0, 0.85, 0.85, 0] }}
                                                            transition={{ duration: 4, times: [0, 0.5, 0.8, 1], repeat: Infinity, ease: "easeInOut" }}
                                                        />
                                                    </svg>
                                                    <div className="flex flex-col items-center">
                                                        <motion.span
                                                            className="text-5xl font-bold text-white tracking-tighter"
                                                            animate={{ opacity: [0.5, 1, 1, 0.5] }}
                                                            transition={{ duration: 4, repeat: Infinity }}
                                                        >
                                                            85
                                                        </motion.span>
                                                        <motion.span
                                                            className="text-xs text-red-400 font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20"
                                                            animate={{ opacity: [0, 1, 1, 0] }}
                                                            transition={{ duration: 4, times: [0.4, 0.5, 0.9, 1], repeat: Infinity }}
                                                        >
                                                            Critical
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );

                                case 1: // Contextual Threat Explanations
                                    return (
                                        <div className="w-full aspect-video bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col justify-center relative overflow-hidden">
                                            {/* Phase 1: Raw CVE */}
                                            <motion.div
                                                className="absolute inset-0 flex flex-col items-center justify-center p-6"
                                                animate={{ opacity: [1, 1, 0, 0], scale: [1, 1, 0.9, 0.9], filter: ["blur(0px)", "blur(0px)", "blur(10px)", "blur(10px)"] }}
                                                transition={{ duration: 6, times: [0, 0.4, 0.5, 1], repeat: Infinity }}
                                            >
                                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg w-full max-w-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <AlertTriangleIcon className="size-4 text-red-400" />
                                                        <span className="text-xs font-mono text-red-300">CVE-2021-44228</span>
                                                    </div>
                                                    <div className="space-y-2 opacity-50">
                                                        <div className="h-1.5 w-full bg-red-400/20 rounded-full" />
                                                        <div className="h-1.5 w-2/3 bg-red-400/20 rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="mt-4 text-xs text-gray-500 font-mono animate-pulse">Analyzing signature...</div>
                                            </motion.div>

                                            {/* Phase 2: Human Explanation */}
                                            <motion.div
                                                className="absolute inset-0 flex flex-col items-center justify-center p-6"
                                                animate={{ opacity: [0, 0, 1, 1], scale: [1.1, 1.1, 1, 1], filter: ["blur(10px)", "blur(10px)", "blur(0px)", "blur(0px)"] }}
                                                transition={{ duration: 6, times: [0, 0.45, 0.55, 1], repeat: Infinity }}
                                            >
                                                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl shadow-2xl w-full max-w-sm backdrop-blur-xl">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <ShieldCheckIcon className="size-5 text-green-400" />
                                                        <span className="text-sm font-bold text-green-300">Analysis Complete</span>
                                                    </div>
                                                    <p className="text-sm text-gray-200 leading-relaxed">
                                                        "Log4j vulnerability in <span className="text-yellow-300 font-mono">auth-service</span> allows remote code execution."
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );

                                case 2: // SBOM Version Comparison
                                    return (
                                        <div className="w-full aspect-video bg-[#1e1e1e] rounded-xl border border-white/10 p-4 flex flex-col relative overflow-hidden font-mono text-xs">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2 z-10 bg-[#1e1e1e]">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <GitCompareIcon className="size-3" />
                                                    <span>diff --git a/package.json</span>
                                                </div>
                                            </div>

                                            {/* Auto-Scrolling Content */}
                                            <div className="relative overflow-hidden flex-1 mask-linear-gradient">
                                                <motion.div
                                                    className="absolute w-full space-y-2"
                                                    animate={{ y: ["0%", "-50%"] }}
                                                    transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                                                >
                                                    {[...Array(2)].map((_, i) => (
                                                        <div key={i} className="space-y-2 pb-2">
                                                            <div className="flex gap-2 opacity-50"><span className="text-gray-600"> 12</span> <span> "react": "18.2.0",</span></div>
                                                            <div className="flex gap-2 opacity-50"><span className="text-gray-600"> 13</span> <span> "react-dom": "18.2.0",</span></div>
                                                            <div className="flex gap-2 bg-red-500/10 text-red-300"><span className="text-red-500">-14</span> <span> "lodash": "4.17.20",</span></div>
                                                            <div className="flex gap-2 bg-green-500/10 text-green-300"><span className="text-green-500">+14</span> <span> "lodash": "4.17.21",</span></div>
                                                            <div className="flex gap-2 opacity-50"><span className="text-gray-600"> 15</span> <span> "axios": "1.5.0",</span></div>
                                                            <div className="flex gap-2 bg-green-500/10 text-green-300"><span className="text-green-500">+16</span> <span> "zod": "3.22.4",</span></div>
                                                            <div className="flex gap-2 opacity-50"><span className="text-gray-600"> 17</span> <span> "framer-motion": "10.0.0",</span></div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            </div>
                                        </div>
                                    );

                                case 3: // Vulnerability Depth Analysis
                                    return (
                                        <div className="w-full aspect-video bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-8 flex flex-col justify-center gap-4 relative overflow-hidden">
                                            {/* Sub-dependency Tree */}
                                            <div className="space-y-3 relative z-10">
                                                <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 opacity-50">
                                                    <PackageIcon className="size-4 text-gray-500" />
                                                    <div className="h-2 w-32 bg-gray-700 rounded" />
                                                </div>

                                                <motion.div
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 ml-8"
                                                    animate={{ opacity: [1, 0.7, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <AlertTriangleIcon className="size-4 text-red-500" />
                                                    <div className="flex-1">
                                                        <div className="text-white font-medium text-xs">transitive-vuln-pkg</div>
                                                        <div className="text-[8px] text-red-400">HIDDEN THREAT</div>
                                                    </div>
                                                </motion.div>

                                                <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 opacity-50 ml-16">
                                                    <PackageIcon className="size-4 text-gray-500" />
                                                    <div className="h-2 w-24 bg-gray-700 rounded" />
                                                </div>
                                            </div>

                                            {/* Pulse Animation */}
                                            <motion.div
                                                className="absolute inset-0 bg-red-500/5"
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            />
                                        </div>
                                    );

                                case 3: // CycloneDX Standard Format
                                    return (
                                        <div className="w-full aspect-video bg-[#1e1e1e] rounded-xl border border-white/10 p-6 flex flex-col relative overflow-hidden shadow-2xl">
                                            <div className="absolute top-4 right-4 flex gap-1.5">
                                                <div className="size-2 rounded-full bg-white/20" />
                                                <div className="size-2 rounded-full bg-white/20" />
                                            </div>

                                            {/* Typewriter text */}
                                            <div className="font-mono text-xs md:text-sm leading-6 text-gray-400">
                                                <div>{"{"}</div>
                                                <motion.div
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={{
                                                        visible: { transition: { staggerChildren: 0.2, repeat: Infinity, repeatDelay: 2 } }
                                                    }}
                                                >
                                                    {[
                                                        { label: '"bomFormat"', val: '"CycloneDX"' },
                                                        { label: '"specVersion"', val: '"1.4"' },
                                                        { label: '"serialNumber"', val: '"urn:uuid:..."' },
                                                        { label: '"components"', val: '[ ... ]' }
                                                    ].map((line, i) => (
                                                        <motion.div
                                                            key={i}
                                                            variants={{
                                                                hidden: { opacity: 0, x: -10 },
                                                                visible: { opacity: 1, x: 0 }
                                                            }}
                                                            className="pl-4 flex gap-2"
                                                        >
                                                            <span className="text-blue-400">{line.label}:</span>
                                                            <span className="text-green-400">{line.val},</span>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                                <div>{"}"}</div>
                                            </div>

                                            <motion.div
                                                className="absolute bottom-4 right-4 text-xs font-mono text-green-500 flex items-center gap-1.5 bg-green-950/30 px-2 py-1 rounded border border-green-500/20"
                                                animate={{ opacity: [0, 1, 1, 0] }}
                                                transition={{ duration: 4, times: [0.5, 0.6, 0.9, 1], repeat: Infinity }}
                                            >
                                                <div className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]" />
                                                Video Generated
                                            </motion.div>
                                        </div>
                                    );
                            }
                        };

                        return (
                            <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 max-w-6xl mx-auto`}>
                                <motion.div className="flex-1 space-y-6"
                                    initial={{ x: isEven ? -50 : 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 border bg-white/5 border-white/10`}>
                                        <feature.icon className="size-7 text-blue-400" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-semibold text-white">{feature.title}</h2>
                                    <p className="text-gray-100 text-lg leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-blue-300">
                                        <span>Learn more</span>
                                        <ArrowRightIcon className="size-4" />
                                    </div>
                                </motion.div>
                                <motion.div className="flex-1"
                                    initial={{ x: isEven ? 50 : -50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {renderVisual(index)}
                                </motion.div>
                            </div>
                        );
                    })}
                </section>

                {/* Real-World Impact */}
                <section className="mt-32">
                    <div className="text-center mb-12">
                        <motion.h2 className="text-3xl font-semibold max-w-lg mx-auto mt-4 text-white"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            Real-World Impact
                        </motion.h2>
                        <motion.p className="mt-4 text-center text-sm/7 text-gray-100 max-w-2xl mx-auto"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                        >
                            Organizations using our Risk Management System have reduced vulnerability response time by 60%, achieved compliance with Executive Order 14028, and prevented supply chain attacks through proactive dependency monitoring.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <motion.div className="glass p-6 rounded-xl text-center"
                            initial={{ y: 150, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            <div className="text-4xl font-bold text-white mb-2">60%</div>
                            <p className="text-gray-100 text-sm">Faster vulnerability response</p>
                        </motion.div>
                        <motion.div className="glass p-6 rounded-xl text-center"
                            initial={{ y: 150, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            <div className="text-4xl font-bold text-white mb-2">100%</div>
                            <p className="text-gray-100 text-sm">Compliance with EO 14028</p>
                        </motion.div>
                        <motion.div className="glass p-6 rounded-xl text-center"
                            initial={{ y: 150, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            <div className="text-4xl font-bold text-white mb-2">10K+</div>
                            <p className="text-gray-100 text-sm">Dependencies analyzed daily</p>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <motion.div className="flex flex-col max-w-5xl mt-40 px-4 mx-auto items-center justify-center text-center py-16 rounded-xl glass"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <motion.h2 className="text-2xl md:text-4xl font-medium mt-2"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                    >
                        Ready to analyze your dependencies?
                    </motion.h2>
                    <motion.p className="mt-4 text-sm/7 max-w-md"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
                    >
                        Start managing project risks with intelligent health scoring today.
                    </motion.p>
                    <motion.div className="flex flex-col md:flex-row items-center gap-3 mt-8"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                    >
                        <Link href="/sign-in" className="btn bg-white text-gray-800 flex items-center gap-2">
                            Get Started
                            <ArrowRightIcon className="size-4" />
                        </Link>
                        <Link href="/docs" className="btn glass">
                            View Documentation
                        </Link>
                    </motion.div>
                </motion.div>
            </main >
        </>
    );
}
