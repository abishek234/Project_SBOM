'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, ShieldIcon, FileCheckIcon, ScaleIcon, TrendingUpIcon, SearchIcon, UsersIcon } from 'lucide-react';
import WorkflowSteps from '@/sections/workflow-steps';


export default function UseCasesPage() {
    const useCases = [
        {
            icon: ShieldIcon,
            title: "Supply Chain Risk Audits",
            description: "Identify risks across your entire dependency tree. Track Security, Legal, and Operational factors with contextual explanations."
        },
        {
            icon: FileCheckIcon,
            title: "Compliance & Regulatory Requirements",
            description: "Generate SBOMs for NTIA, Executive Order 14028, and other compliance frameworks. Export in CycloneDX format."
        },
        {
            icon: SearchIcon,
            title: "Remediation Management",
            description: "Prioritize actions with Health Scores. Focus on high-impact remediation first instead of treating all warnings equally."
        },
        {
            icon: ScaleIcon,
            title: "License Compliance Tracking",
            description: "Identify missing or incompatible licenses. Ensure your dependencies meet legal and organizational requirements."
        },
        {
            icon: TrendingUpIcon,
            title: "Strategic Update Planning",
            description: "Use Version Risk Delta to track health changes between releases. Plan updates strategically based on risk reduction."
        },
        {
            icon: UsersIcon,
            title: "Security Risk Prioritization",
            description: "Explain threats in plain language for non-security teams. Make supply chain security accessible to everyone."
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
                        <p>Real-World Applications</p>
                        <button className="btn glass py-1 px-3 text-xs">
                            Industry Proven
                        </button>
                    </motion.div>
                    <motion.h1 className="text-center text-4xl/13 md:text-6xl/19 mt-4 font-semibold tracking-tight max-w-3xl"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        Project Risk Management Use Cases
                    </motion.h1>
                    <motion.p className="text-center text-gray-100 text-base/7 max-w-2xl mt-6 px-4"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        From regulatory compliance to proactive risk mitigation, discover how organizations leverage our Risk Management System to secure their software supply chain and generate audit-ready SBOMs.
                    </motion.p>

                    <motion.div className="flex flex-col md:flex-row max-md:w-full items-center gap-4 md:gap-3 mt-6"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <Link href="/sign-in" className="btn max-md:w-full bg-white text-gray-800 py-3">
                            Get Started
                        </Link>
                        <Link href="/features" className="btn max-md:w-full glass py-3">
                            View Features
                        </Link>
                    </motion.div>
                </motion.section>

                {/* Workflow Visualization */}
                <WorkflowSteps />

                {/* Common Use Cases */}
                <section className="mt-32">
                    <div className="text-center mb-16">
                        <motion.h2 className="text-3xl font-semibold max-w-lg mx-auto mt-4 text-white"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            Common Use Cases
                        </motion.h2>
                        <motion.p className="mt-4 text-center text-sm/7 text-gray-100 max-w-2xl mx-auto"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                        >
                            Real-world scenarios where our Risk Management System ensures project health and compliance.
                        </motion.p>
                    </div>

                    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                        {useCases.map((useCase, index) => (
                            <motion.div
                                key={index}
                                className="glass p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 group border border-white/5 hover:border-blue-500/30 relative overflow-hidden"
                                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="size-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex flex-shrink-0 items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 z-10">
                                    <useCase.icon className="size-8 text-white/80 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <div className="flex-1 z-10 text-center md:text-left">
                                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-200 transition-colors">{useCase.title}</h3>
                                    <p className="text-gray-200 text-sm leading-relaxed">{useCase.description}</p>
                                </div>
                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0 z-10">
                                    <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
                                        <span>View Details</span>
                                        <ArrowRightIcon className="size-5" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
                        Start securing your supply chain
                    </motion.h2>
                    <motion.p className="mt-4 text-sm/7 max-w-md"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
                    >
                        Join organizations already using the Project Risk Management System to meet security requirements and generate compliant SBOMs.
                    </motion.p>
                    <motion.div className="flex flex-col md:flex-row items-center gap-3 mt-8"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                    >
                        <Link href="/sign-in" className="btn bg-white text-gray-800 flex items-center gap-2">
                            Try It Free
                            <ArrowRightIcon className="size-4" />
                        </Link>
                        <Link href="/pricing" className="btn glass">
                            View Pricing
                        </Link>
                    </motion.div>
                </motion.div>
            </main>
        </>
    );
}
