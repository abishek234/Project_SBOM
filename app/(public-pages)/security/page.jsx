'use client';

import { motion } from 'framer-motion';
import SectionTitle from '@/components/section-title';
import { ShieldCheckIcon, LockIcon, KeyIcon, FileCodeIcon, ServerIcon, EyeIcon } from 'lucide-react';

export default function SecurityPage() {
    const securityFeatures = [
        {
            title: "SOC 2 Compliance",
            description: "Verix is pursuing SOC 2 Type II compliance to ensure we meet the highest standards of security, availability, and confidentiality.",
            icon: ShieldCheckIcon,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            title: "End-to-End Encryption",
            description: "All data transfers specifically upload artifacts are encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.",
            icon: LockIcon,
            color: "text-green-400",
            bg: "bg-green-500/10"
        },
        {
            title: "Role-Based Access Control",
            description: "Granular permission settings allow you to control exactly who can view, edit, or manage your organization's SBOM data.",
            icon: KeyIcon,
            color: "text-amber-400",
            bg: "bg-amber-500/10"
        },
        {
            title: "SSO Integration",
            description: "Support for SAML and OIDC Single Sign-On providers including Okta, Auth0, and Google Workspace for enterprise security.",
            icon: EyeIcon,
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            title: "Ephemeral Analysis",
            description: "We analyze your dependency files in ephemeral environments. Source code is never retained after the analysis is complete.",
            icon: FileCodeIcon,
            color: "text-red-400",
            bg: "bg-red-500/10"
        },
        {
            title: "Regular Audits",
            description: "We conduct regular third-party penetration testing and vulnerability assessments to identify and patch potential weaknesses.",
            icon: ServerIcon,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10"
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
            <main className="px-4 py-32 max-w-6xl mx-auto">
                <SectionTitle
                    title="Risk Management Security"
                    description="Our commitment to protecting your project risk data and software supply chain integrity."
                />

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {securityFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors"
                        >
                            <div className={`size-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg} ${feature.color}`}>
                                <feature.icon className="size-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.section
                    className="mt-32 max-w-3xl mx-auto text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-semibold text-white mb-4">Responsible Disclosure</h2>
                    <p className="text-gray-300 mb-8">
                        If you believe you have found a security vulnerability in Verix, please report it to us immediately. We offer a bug bounty program for valid critical vulnerabilities.
                    </p>
                    <a
                        href="mailto:security@verix-sbom.com"
                        className="btn bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                        Contact Security Team
                    </a>
                </motion.section>
            </main>
        </>
    );
}
