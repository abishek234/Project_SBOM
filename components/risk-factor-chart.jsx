'use client';

import { motion } from 'framer-motion';

export default function RiskFactorChart({ factors = {} }) {
    const data = [
        { label: "Vulnerabilities", key: "Known CVE", max: 80, color: "#ef4444" },
        { label: "Outdated", key: "Outdated Version", max: 20, color: "#f97316" },
        { label: "Compliance", key: "Missing License", max: 15, color: "#eab308" },
        { label: "Community", key: "Low Popularity", max: 15, color: "#a855f7" },
        { label: "Maintenance", key: "No Recent Update", max: 10, color: "#6366f1" }
    ];

    const size = 200;
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / data.length;

    // Generate path for the data polygon
    const points = data.map((item, i) => {
        const value = factors[item.key] || 0;
        const normalizedValue = Math.min((value / item.max), 1.1) * radius; // Allow slight overflow for visual impact
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * normalizedValue;
        const y = center + Math.sin(angle) * normalizedValue;
        return `${x},${y}`;
    }).join(' ');

    // Generate axis lines and labels
    const axes = data.map((item, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x2 = center + Math.cos(angle) * radius;
        const y2 = center + Math.sin(angle) * radius;
        const lx = center + Math.cos(angle) * (radius + 25);
        const ly = center + Math.sin(angle) * (radius + 15);

        return { x2, y2, lx, ly, ...item };
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-12 py-4">
            {/* Radar Chart SVG */}
            <div className="relative size-[250px] flex items-center justify-center">
                <svg width={size + 160} height={size + 100} viewBox={`-80 -50 ${size + 160} ${size + 100}`} className="overflow-visible">
                    {/* Background Polygons (Grid) */}
                    {[0.2, 0.4, 0.6, 0.8, 1].map((tick) => (
                        <polygon
                            key={tick}
                            points={axes.map((a, i) => {
                                const angle = i * angleStep - Math.PI / 2;
                                const x = center + Math.cos(angle) * (radius * tick);
                                const y = center + Math.sin(angle) * (radius * tick);
                                return `${x},${y}`;
                            }).join(' ')}
                            fill="transparent"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Axis Lines */}
                    {axes.map((axis, i) => (
                        <line
                            key={i}
                            x1={center} y1={center}
                            x2={axis.x2} y2={axis.y2}
                            stroke="rgba(255,255,255,0.1)"
                            strokeDasharray="2,2"
                        />
                    ))}

                    {/* Data Polygon */}
                    <motion.polygon
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        points={points}
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />

                    {/* Data Points */}
                    {data.map((item, i) => {
                        const value = factors[item.key] || 0;
                        const normalizedValue = Math.min((value / item.max), 1.1) * radius;
                        const angle = i * angleStep - Math.PI / 2;
                        const x = center + Math.cos(angle) * normalizedValue;
                        const y = center + Math.sin(angle) * normalizedValue;

                        return (
                            <motion.circle
                                key={i}
                                initial={{ r: 0 }}
                                animate={{ r: value > 0 ? 4 : 0 }}
                                cx={x} cy={y}
                                fill={item.color}
                                className="drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                            />
                        );
                    })}

                    {/* Labels */}
                    {axes.map((axis, i) => (
                        <text
                            key={i}
                            x={axis.lx} y={axis.ly}
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-gray-500 uppercase tracking-tighter"
                        >
                            {axis.label}
                        </text>
                    ))}
                </svg>
            </div>

            {/* Legend / Info */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {data.map((item) => {
                    const value = factors[item.key] || 0;
                    const percent = Math.round((value / item.max) * 100);

                    return (
                        <div key={item.key} className={`p-4 rounded-2xl border transition-all ${value > 0 ? 'bg-white/5 border-white/10' : 'bg-transparent border-transparent opacity-20'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-bold text-white uppercase">{item.label}</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-black text-white">+{value}</div>
                                <div className="text-[10px] font-medium text-gray-500 mb-1">Impact Level: {Math.min(percent, 100)}%</div>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(percent, 100)}%` }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
