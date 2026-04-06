import { PlayCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {

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
            <motion.section className="flex flex-col items-center">
                <motion.div className="flex items-center gap-3 mt-32"
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <p>Supply Chain Security</p>
                    <button className="btn glass py-1 px-3 text-xs">
                        CycloneDX Format
                    </button>
                </motion.div>
                <motion.h1 className="text-center text-4xl/13 md:text-6xl/19 mt-4 font-semibold tracking-tight max-w-4xl"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    Unified Project Risk Management & Intelligent SBOM Generation
                </motion.h1>
                <motion.p className="text-center text-gray-100 text-base/7 max-w-2xl mt-6"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    Identify Security, Legal, and Operational risks with precision. Generate compliance-ready CycloneDX SBOMs & receive prioritized remediation steps in seconds.
                </motion.p>

                <motion.div className="flex flex-col md:flex-row max-md:w-full items-center gap-4 md:gap-3 mt-6"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <Link href="/sign-in" className="btn max-md:w-full bg-white text-gray-800 py-3 px-8">
                        Secure Your Project Free
                    </Link>
                    <Link href="/features" className="btn max-md:w-full glass flex items-center justify-center gap-2 py-3">
                        <PlayCircleIcon className="size-4.5" />
                        View Features
                    </Link>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl w-full"
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    <div className="glass p-6 rounded-xl text-center">
                        <div className="text-4xl font-bold text-white mb-2">10K+</div>
                        <p className="text-gray-300 text-sm">Dependencies Analyzed Daily</p>
                    </div>
                    <div className="glass p-6 rounded-xl text-center">
                        <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                        <p className="text-gray-300 text-sm">Vulnerability Detection Rate</p>
                    </div>
                    <div className="glass p-6 rounded-xl text-center">
                        <div className="text-4xl font-bold text-white mb-2">60%</div>
                        <p className="text-gray-300 text-sm">Faster Compliance Audits</p>
                    </div>
                </motion.div>
            </motion.section>
        </>
    );
}