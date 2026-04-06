import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

export default function FaqSection() {

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is an SBOM and why do I need one?",
            answer: "A Software Bill of Materials (SBOM) is a comprehensive inventory of all components in your software. It's required for compliance with Executive Order 14028, helps identify vulnerabilities, and is essential for supply chain security audits."
        },
        {
            question: "How does the risk scoring system work?",
            answer: "Each dependency receives a 0-100 risk score based on multiple factors: Known CVEs (+40 points), outdated versions (+20), missing licenses (+15), low popularity (+15), and lack of recent updates (+10). This helps you prioritize which dependencies need immediate attention."
        },
        {
            question: "What SBOM formats do you support?",
            answer: "We generate SBOMs in CycloneDX format, which is widely adopted and compatible with most security tools. CycloneDX is recommended by CISA and supports vulnerability tracking, license compliance, and supply chain transparency."
        },
        {
            question: "Can I integrate this into my CI/CD pipeline?",
            answer: "Yes! Our Professional and Enterprise plans include API access. You can automatically generate SBOMs on every build, track changes over time with SBOM diff, and fail builds based on custom risk thresholds."
        },
        {
            question: "How do you detect vulnerabilities?",
            answer: "We integrate with the OSV (Open Source Vulnerabilities) database and NVD (National Vulnerability Database) to identify known CVEs. Our contextual red flags explain the impact of each vulnerability in plain language."
        },
        {
            question: "What programming languages are supported?",
            answer: "We support JavaScript/Node.js (package.json, package-lock.json), Python (requirements.txt, Pipfile), Java (pom.xml, build.gradle), Go (go.mod), and more. Upload your project files and we'll automatically detect dependencies."
        },
        {
            question: "How does SBOM diff work?",
            answer: "SBOM diff compares two versions of your project to show added, removed, and updated dependencies. This is crucial for tracking supply chain changes, understanding security improvements, and meeting audit requirements."
        },
        {
            question: "Is my code and SBOM data secure?",
            answer: "Yes. We only analyze dependency metadata, not your source code. All SBOMs are encrypted at rest and in transit. Enterprise plans offer on-premise deployment for complete data sovereignty."
        }
    ];

    return (
        <section className="mt-32">
            <SectionTitle
                title="Frequently Asked Questions"
                description="Everything you need to know about SBOM generation and supply chain security."
            />

            <motion.div className="flex flex-col items-center justify-center gap-4 mt-10 max-w-3xl mx-auto px-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        className="w-full glass rounded-xl overflow-hidden"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <button
                            onClick={() => toggleFaq(index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition"
                        >
                            <h3 className="text-base font-medium text-white pr-4">
                                {faq.question}
                            </h3>
                            <ChevronDownIcon
                                className={`size-5 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}
                        >
                            <p className="px-6 pt-2 pb-6 text-gray-100 text-sm leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}