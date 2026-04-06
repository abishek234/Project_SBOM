import SectionTitle from "@/components/section-title";
import { ShieldCheckIcon, GitCompareIcon, AlertTriangleIcon, PackageIcon, DatabaseIcon, ZapIcon, LockIcon, TrendingUpIcon, FileTextIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function Features() {

    const refs = useRef([]);

    const featuresData = [
        {
            icon: ShieldCheckIcon,
            title: "Project Health Scoring",
            description: "Unified 0-100 health index combining Security, Legal, and Operational risk factors for a complete project overview.",
        },
        {
            icon: AlertTriangleIcon,
            title: "Risk Categorization",
            description: "Grouped analysis of Security vulnerabilities, Legal compliance, and Operational pulse for targeted prioritization.",
        },
        {
            icon: GitCompareIcon,
            title: "Version Risk Delta",
            description: "Track how project health changes between versions. Identify newly introduced risks before they reach production.",
        },
        {
            icon: DatabaseIcon,
            title: "OSV & NVD Integration",
            description: "Real-time vulnerability data from Open Source Vulnerabilities and National Vulnerability Database for comprehensive coverage.",
        },
        {
            icon: FileTextIcon,
            title: "Audit-Ready SBOMs",
            description: "Industry-standard CycloneDX generation compatible with CISA, NTIA, and Executive Order 14028 compliance requirements.",
        },
        {
            icon: ZapIcon,
            title: "Automated Dependency Detection",
            description: "Upload project files or ZIP archives. Automatic parsing of package.json, requirements.txt, pom.xml, go.mod, and other lock files.",
        },
        {
            icon: LockIcon,
            title: "License Compliance Tracking",
            description: "Identify missing, incompatible, or restrictive licenses. Ensure legal compliance and avoid licensing conflicts.",
        },
        {
            icon: TrendingUpIcon,
            title: "CI/CD Pipeline Integration",
            description: "API access for automated SBOM generation in your build pipeline. Set risk thresholds and fail builds based on security policies.",
        }
    ];

    return (
        <section className="mt-32">
            <SectionTitle
                title="Unified Risk & SBOM Intelligence"
                description="Beyond simple dependency lists — an autonomous risk management engine that prioritizes health, explains threats, and secures your supply chain."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-6 max-w-6xl mx-auto">
                {featuresData.map((feature, index) => (
                    <motion.div
                        key={index}
                        ref={(el) => (refs.current[index] = el)}
                        className="hover:-translate-y-0.5 p-6 rounded-xl space-y-4 glass"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: index * 0.08,
                            type: "spring",
                            stiffness: 320,
                            damping: 70,
                            mass: 1
                        }}
                        onAnimationComplete={() => {
                            const card = refs.current[index];
                            if (card) {
                                card.classList.add("transition", "duration-300");
                            }
                        }}
                    >
                        <feature.icon className="size-8.5" />
                        <h3 className="text-base font-medium text-white">
                            {feature.title}
                        </h3>
                        <p className="text-gray-100 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
