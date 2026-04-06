import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';

export default function RiskCharts({ packages, overallScore }) {
    if (!packages || packages.length === 0) return null;

    // Data Aggregation
    const counts = {
        CRITICAL: packages.filter(p => p.level === 'CRITICAL').length,
        HIGH: packages.filter(p => p.level === 'HIGH').length,
        MEDIUM: packages.filter(p => p.level === 'MEDIUM').length,
        LOW: packages.filter(p => p.level === 'LOW').length,
        SAFE: packages.filter(p => p.level === 'SAFE').length,
    };

    const maxCount = Math.max(...Object.values(counts));
    const levels = [
        { name: 'Critical', key: 'CRITICAL', color: '#ef4444' },
        { name: 'High', key: 'HIGH', color: '#f97316' },
        { name: 'Medium', key: 'MEDIUM', color: '#eab308' },
        { name: 'Low', key: 'LOW', color: '#22c55e' },
        { name: 'Safe', key: 'SAFE', color: '#3b82f6' },
    ];

    const healthIndex = Math.round(100 - overallScore);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Chart 1: Risk Distribution Bar Chart */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <h4 className="text-white font-bold mb-8 flex items-center gap-2">
                    <span className="size-2 bg-blue-500 rounded-full animate-pulse" />
                    Dependency Distribution
                </h4>

                <div className="space-y-6">
                    {levels.map((level, i) => {
                        const count = counts[level.key];
                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                        return (
                            <div key={level.key} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest transition-colors group-hover:text-white">
                                    <span style={{ color: level.color }}>{level.name}</span>
                                    <span className="text-white-500">{count} packages</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                        style={{ backgroundColor: level.color }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chart 2: Security Health Gauge (Custom SVG) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="flex justify-between items-center w-full mb-4">
                    <h4 className="text-white font-bold flex items-center gap-2">
                        <span className="size-2 bg-purple-500 rounded-full animate-pulse" />
                        Security Health Gauge
                    </h4>

                    {/* Calculation Info Tooltip */}
                    <div className="relative group/info">
                        <InfoIcon className="size-4 text-gray-400 group-hover/info:text-white transition-colors cursor-help" />
                        <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl z-50 pointer-events-none opacity-0 group-hover/info:opacity-100 transition-opacity">
                            <div className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Calculation Model</div>
                            <div className="text-xs text-white-500 leading-relaxed font-medium">
                                The <span className="text-white">Health Index</span> is the inverse of your total project risk.
                                <div className="mt-2 p-2 bg-white/5 rounded-lg font-mono text-[10px] text-white/70">
                                    Health = 100 - (MaxRisk*0.8 + AvgRisk*0.2)
                                </div>
                                <p className="mt-2 text-[10px] opacity-60 italic">Weighted 80% towards your most vulnerable package to prevent "Safety Dilution".</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative size-48 md:size-64 mt-4">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background Track */}
                        <circle
                            cx="50" cy="50" r="45"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-white/5"
                        />
                        {/* Progress Circle (Health) */}
                        <motion.circle
                            cx="50" cy="50" r="45"
                            fill="transparent"
                            stroke={healthIndex < 35 ? '#ef4444' : healthIndex < 70 ? '#f97316' : '#22c55e'}
                            strokeWidth="8"
                            strokeDasharray="282.7"
                            initial={{ strokeDashoffset: 282.7 }}
                            animate={{ strokeDashoffset: 282.7 - (282.7 * healthIndex) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                        />
                    </svg>

                    {/* Inner Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-5xl md:text-6xl font-black text-white tracking-tighter"
                        >
                            {healthIndex}
                        </motion.span>
                        <span className="text-[10px] font-bold text-white-500 uppercase tracking-widest mt-1">Health Index</span>
                    </div>
                </div>

                <p className="text-center text-xs text-white-500 mt-6 max-w-[200px]">
                    {healthIndex < 35
                        ? "Critical risk detected. System requires urgent patches."
                        : healthIndex < 70
                            ? "Moderate warnings. Review outdated versions."
                            : "System architecture is exceptionally healthy."}
                </p>
            </div>
        </div>
    );
}
