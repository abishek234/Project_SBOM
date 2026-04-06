'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, BookOpenIcon, CodeIcon, ShieldIcon, FileTextIcon, SearchIcon } from 'lucide-react';
import FaqSection from '@/sections/faq-section';

export default function DocsPage() {
    const docCategories = [
        {
            icon: BookOpenIcon,
            title: "Getting Started",
            description: "Learn how to upload projects, generate SBOMs, and understand risk scores.",
            links: ["Quick Start Guide", "Upload Methods", "Understanding Risk Scores"]
        },
        {
            icon: ShieldIcon,
            title: "Risk Scoring Logic",
            description: "Deep dive into how we calculate the 0-100 risk score for each dependency.",
            links: ["Risk Factors Explained", "CVE Integration", "License Analysis"]
        },
        {
            icon: CodeIcon,
            title: "API Documentation",
            description: "Integrate SBOM generation into your CI/CD pipeline with our REST API.",
            links: ["Authentication", "API Endpoints", "Code Examples"]
        },
        {
            icon: FileTextIcon,
            title: "SBOM Formats",
            description: "Learn about CycloneDX, SPDX, and other SBOM format specifications.",
            links: ["CycloneDX Format", "Export Options", "Compliance Standards"]
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
                        <p>Knowledge Base</p>
                        <button className="btn glass py-1 px-3 text-xs">
                            v2.4.0
                        </button>
                    </motion.div>
                    <motion.h1 className="text-center text-4xl/13 md:text-6xl/19 mt-4 font-semibold tracking-tight max-w-3xl"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        Documentation Hub
                    </motion.h1>
                    <motion.p className="text-center text-gray-100 text-base/7 max-w-2xl mt-6 px-4"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        Everything you need to integrate, configure, and master SBOM Generator.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div className="w-full max-w-xl mt-8 relative px-4"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon className="size-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search documentation (e.g., 'API keys', 'CI/CD')..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-black-500 text-white"
                        />
                    </motion.div>

                    <motion.div className="flex flex-col md:flex-row max-md:w-full items-center gap-4 md:gap-3 mt-8"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <Link href="/sign-in" className="btn max-md:w-full bg-white text-gray-800 py-3">
                            Get API Key
                        </Link>
                        <Link href="/features" className="btn max-md:w-full glass py-3">
                            View Features
                        </Link>
                    </motion.div>
                </motion.section>

                {/* Documentation Categories */}
                <section className="mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {docCategories.map((category, index) => (
                            <motion.div
                                key={index}
                                className="glass p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group border border-white/5 hover:border-blue-500/30"
                                initial={{ y: 150, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                        <category.icon className="size-6" />
                                    </div>
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/5">
                                        {category.links.length} articles
                                    </span>
                                </div>

                                <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-blue-200 transition-colors">{category.title}</h3>
                                <p className="text-gray-300 text-sm mb-6 leading-relaxed h-10">{category.description}</p>

                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    {category.links.map((link, linkIndex) => (
                                        <Link key={linkIndex} href="#" className="flex items-center justify-between group/link hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors">
                                            <span className="text-sm text-gray-200 group-hover/link:text-white transition-colors">{link}</span>
                                            <ArrowRightIcon className="size-3 text-gray-500 group-hover/link:text-blue-400 transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Risk Scoring Example */}
                <section className="mt-32">
                    <div className="text-center mb-12">
                        <motion.h2 className="text-3xl font-semibold max-w-lg mx-auto mt-4 text-white"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            Risk Scoring Breakdown
                        </motion.h2>
                        <motion.p className="mt-4 text-center text-sm/7 text-gray-100 max-w-md mx-auto"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                        >
                            Understanding how we calculate the 0-100 risk score
                        </motion.p>
                    </div>

                    <motion.div className="glass p-8 rounded-2xl max-w-3xl mx-auto"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <div>
                                    <h4 className="font-semibold">Known CVE</h4>
                                    <p className="text-sm text-gray-100">Critical or high severity vulnerabilities</p>
                                </div>
                                <span className="text-2xl font-bold text-red-400">+40</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <div>
                                    <h4 className="font-semibold">Outdated Version</h4>
                                    <p className="text-sm text-gray-100">More than 2 major versions behind</p>
                                </div>
                                <span className="text-2xl font-bold text-orange-400">+20</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <div>
                                    <h4 className="font-semibold">Missing License</h4>
                                    <p className="text-sm text-gray-100">No license information available</p>
                                </div>
                                <span className="text-2xl font-bold text-yellow-400">+15</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <div>
                                    <h4 className="font-semibold">Low Popularity</h4>
                                    <p className="text-sm text-gray-100">Less than 1000 weekly downloads</p>
                                </div>
                                <span className="text-2xl font-bold text-yellow-400">+15</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">No Recent Update</h4>
                                    <p className="text-sm text-gray-100">No updates in the last 12 months</p>
                                </div>
                                <span className="text-2xl font-bold text-green-400">+10</span>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* FAQ Section */}
                <FaqSection />

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
                        Ready to get started?
                    </motion.h2>
                    <motion.p className="mt-4 text-sm/7 max-w-md"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
                    >
                        Start generating SBOMs with intelligent risk analysis today.
                    </motion.p>
                    <motion.div className="flex flex-col md:flex-row items-center gap-3 mt-8"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                    >
                        <Link href="/sign-in" className="btn bg-white text-gray-800 flex items-center gap-2">
                            Start Building
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
