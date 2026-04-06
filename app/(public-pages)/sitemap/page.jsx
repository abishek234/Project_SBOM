'use client';

import { motion } from 'framer-motion';
import SectionTitle from '@/components/section-title';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

export default function SitemapPage() {
    const siteMapData = [
        {
            category: "Main",
            links: [
                { name: "Home", href: "/" },
                { name: "Features", href: "/features" },
                { name: "Use Cases", href: "/use-cases" },
                { name: "Pricing", href: "/pricing" },
                { name: "Documentation", href: "/docs" },
                { name: "Sign In", href: "/sign-in" },
                { name: "Get Started", href: "/sign-up" },
            ]
        },
        {
            category: "Legal & Utility",
            links: [
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Security", href: "/security" },
                { name: "Sitemap", href: "/sitemap" },
            ]
        },
        {
            category: "Socials",
            links: [
                { name: "Twitter", href: "https://twitter.com" },
                { name: "GitHub", href: "https://github.com" },
                { name: "LinkedIn", href: "https://linkedin.com" },
                { name: "Discord", href: "https://discord.com" },
            ]
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
            <main className="px-4 py-32 max-w-4xl mx-auto">
                <SectionTitle
                    title="Sitemap"
                    description="Overview of the Verix website structure."
                />

                <div className="grid md:grid-cols-3 gap-12 mt-16">
                    {siteMapData.map((section, idx) => (
                        <motion.div
                            key={idx}
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">{section.category}</h2>
                            <ul className="space-y-4">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                                        >
                                            <ArrowRightIcon className="size-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-400" />
                                            <span>{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </main>
        </>
    );
}
