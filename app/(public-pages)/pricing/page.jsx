'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PricingPlans from '@/sections/pricing-plans';
import { ArrowRightIcon, CheckCircle2Icon, ShieldIcon, ZapIcon, UsersIcon } from 'lucide-react';

export default function PricingPage() {
    const benefits = [
        {
            icon: ShieldIcon,
            title: "Enterprise-Grade Security",
            description: "Bank-level encryption for all SBOM data. SOC 2 Type II certified infrastructure with 99.9% uptime SLA. Your supply chain data is always protected."
        },
        {
            icon: ZapIcon,
            title: "Lightning-Fast Analysis",
            description: "Generate comprehensive SBOMs in under 60 seconds. Real-time vulnerability scanning with instant risk scoring. No waiting, no delays."
        },
        {
            icon: UsersIcon,
            title: "Dedicated Support",
            description: "24/7 technical support for Enterprise plans. Dedicated account manager and priority response times. We're here when you need us."
        }
    ];

    const comparisonFeatures = [
        { feature: "SBOM Generation (CycloneDX)", free: true, pro: true, enterprise: true },
        { feature: "Vulnerability Detection (OSV/NVD)", free: true, pro: true, enterprise: true },
        { feature: "Project Health Scoring", free: true, pro: true, enterprise: true },
        { feature: "Projects per Month", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
        { feature: "Version Risk Delta", free: false, pro: true, enterprise: true },
        { feature: "API Access", free: false, pro: true, enterprise: true },
        { feature: "CI/CD Integration", free: false, pro: true, enterprise: true },
        { feature: "Custom Risk Thresholds", free: false, pro: true, enterprise: true },
        { feature: "Team Collaboration", free: false, pro: "Up to 10", enterprise: "Unlimited" },
        { feature: "Priority Support", free: false, pro: false, enterprise: true },
        { feature: "On-Premise Deployment", free: false, pro: false, enterprise: true },
        { feature: "Custom SLA", free: false, pro: false, enterprise: true },
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
                        <p>Flexible Plans</p>
                        <button className="btn glass py-1 px-3 text-xs">
                            No Hidden Fees
                        </button>
                    </motion.div>
                    <motion.h1 className="text-center text-4xl/13 md:text-6xl/19 mt-4 font-semibold tracking-tight max-w-3xl"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        Choose the Perfect Plan
                    </motion.h1>
                    <motion.p className="text-center text-gray-100 text-base/7 max-w-2xl mt-6 px-4"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                    Whether you're an individual developer, a growing startup, or an enterprise organization, we have a plan that fits your project risk management and SBOM generation needs. All plans include automated health scoring and CycloneDX format exports.
                    </motion.p>

                    <motion.div className="flex flex-col md:flex-row max-md:w-full items-center gap-4 md:gap-3 mt-6"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <Link href="/sign-in" className="btn max-md:w-full bg-white text-gray-800 py-3">
                            Start Free Trial
                        </Link>
                        <Link href="/features" className="btn max-md:w-full glass py-3">
                            Compare Features
                        </Link>
                    </motion.div>
                </motion.section>

                {/* Pricing Plans */}
                <PricingPlans />

                {/* Benefits Section */}
                <section className="mt-32">
                    <div className="text-center mb-12">
                        <motion.h2 className="text-4xl font-semibold max-w-lg mx-auto mt-4 text-white"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            Why Choose Our Risk Management System?
                        </motion.h2>
                        <motion.p className="mt-4 text-center text-base text-gray-100 max-w-2xl mx-auto"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                        >
                            Industry-leading features that set us apart from the competition
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                className="glass p-8 rounded-xl hover:-translate-y-1 transition duration-300"
                                initial={{ y: 150, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                            >
                                <benefit.icon className="size-10 mb-4 text-blue-400" />
                                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                                <p className="text-gray-100 text-base leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Feature Comparison Table */}
                <section className="mt-32">
                    <div className="text-center mb-12">
                        <motion.h2 className="text-4xl font-semibold max-w-lg mx-auto mt-4 text-white"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            Detailed Feature Comparison
                        </motion.h2>
                    </div>

                    <motion.div className="glass p-8 rounded-2xl max-w-5xl mx-auto overflow-x-auto"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <table className="w-full text-base">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                                    <th className="text-center py-4 px-4 font-semibold">Free</th>
                                    <th className="text-center py-4 px-4 font-semibold">Professional</th>
                                    <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((item, index) => (
                                    <tr key={index} className="border-b border-white/10">
                                        <td className="py-4 px-4 text-gray-100">{item.feature}</td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof item.free === 'boolean' ? (
                                                item.free ? <CheckCircle2Icon className="size-5 text-green-400 mx-auto" /> : <span className="text-gray-500">—</span>
                                            ) : (
                                                <span className="text-sm">{item.free}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof item.pro === 'boolean' ? (
                                                item.pro ? <CheckCircle2Icon className="size-5 text-green-400 mx-auto" /> : <span className="text-gray-500">—</span>
                                            ) : (
                                                <span className="text-sm">{item.pro}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof item.enterprise === 'boolean' ? (
                                                item.enterprise ? <CheckCircle2Icon className="size-5 text-green-400 mx-auto" /> : <span className="text-gray-500">—</span>
                                            ) : (
                                                <span className="text-sm">{item.enterprise}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </section>

                {/* CTA Section */}
                <motion.div className="flex flex-col max-w-5xl mt-40 px-4 mx-auto items-center justify-center text-center py-16 rounded-xl glass"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <motion.h2 className="text-3xl md:text-5xl font-medium mt-2"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                    >
                        Still have questions?
                    </motion.h2>
                    <motion.p className="mt-4 text-base leading-relaxed max-w-md"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
                    >
                        Contact our sales team to discuss custom enterprise solutions and volume pricing.
                    </motion.p>
                    <motion.div className="flex flex-col md:flex-row items-center gap-3 mt-8"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                    >
                        <Link href="/sign-in" className="btn bg-white text-gray-800 flex items-center gap-2">
                            Contact Sales
                            <ArrowRightIcon className="size-4" />
                        </Link>
                        <Link href="/docs" className="btn glass">
                            View Documentation
                        </Link>
                    </motion.div>
                </motion.div>
            </main>
        </>
    );
}
