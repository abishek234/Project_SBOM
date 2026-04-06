'use client';
import { motion } from "framer-motion";

export default function TrustedCompanies() {
    const logos = [
        '/assets/company-logo-1.svg',
        '/assets/company-logo-2.svg',
        '/assets/company-logo-3.svg',
        '/assets/company-logo-4.svg',
        '/assets/company-logo-5.svg',
    ]

    // Triple the logos for truly seamless loop
    const duplicatedLogos = [...logos, ...logos, ...logos];

    return (
        <motion.section className="mt-14 overflow-hidden"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
        >
            <p className="py-6 mt-14 text-center">Securing software supply chains for leading organizations —</p>

            <div className="relative w-full overflow-hidden py-4">
                <div className="flex">
                    <motion.div
                        className="flex gap-16 flex-shrink-0"
                        animate={{
                            x: [0, -100 * logos.length],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 25,
                                ease: "linear",
                            },
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <img
                                key={index}
                                src={logo}
                                alt="logo"
                                className="h-7 w-auto flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                            />
                        ))}
                    </motion.div>
                    {/* Second set for seamless loop */}
                    <motion.div
                        className="flex gap-16 flex-shrink-0"
                        animate={{
                            x: [0, -100 * logos.length],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 25,
                                ease: "linear",
                            },
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <img
                                key={`duplicate-${index}`}
                                src={logo}
                                alt="logo"
                                className="h-7 w-auto flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}