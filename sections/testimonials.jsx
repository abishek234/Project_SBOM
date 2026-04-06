import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function Testimonials() {

    const ref = useRef([]);
    const data = [
        {
            review: 'SBOM Generator helped us achieve Executive Order 14028 compliance in weeks, not months. The risk scoring feature is a game-changer for prioritizing vulnerabilities.',
            name: 'Sarah Chen',
            about: 'CISO, FinTech Corp',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
        },
        {
            review: 'The SBOM diff feature saved us during a critical security audit. We could instantly show what changed between releases and prove our supply chain security posture.',
            name: 'Michael Rodriguez',
            about: 'VP Engineering, HealthTech Solutions',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
        },
        {
            review: 'Finally, an SBOM tool that explains vulnerabilities in plain English. Our non-security teams can now understand and act on dependency risks without constant hand-holding.',
            name: 'Emily Watson',
            about: 'DevSecOps Lead, CloudScale Inc',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
        },
        {
            review: 'Integrated seamlessly into our CI/CD pipeline. We now block builds with high-risk dependencies automatically. The API is well-documented and reliable.',
            name: 'David Park',
            about: 'Platform Architect, DataFlow Systems',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        },
        {
            review: 'The license compliance tracking alone is worth it. We identified 12 GPL violations in our first scan that could have been legal nightmares down the road.',
            name: 'Jennifer Martinez',
            about: 'Legal & Compliance, Enterprise Software Co',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
        },
        {
            review: 'Best SBOM tool for multi-language projects. Handles our Node.js, Python, Java, and Go services flawlessly. The CycloneDX export works perfectly with our security scanners.',
            name: 'Alex Thompson',
            about: 'Security Engineer, MicroServices Ltd',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
        },
    ];
    return (
        <section className="mt-32 flex flex-col items-center">
            <SectionTitle
                title="Trusted by Security Teams Worldwide"
                description="Organizations across industries rely on SBOM Generator to secure their software supply chain and meet compliance requirements."
            />
            <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {data.map((item, index) => (
                    <motion.div key={index} className='w-full max-w-88 space-y-5 rounded-lg glass p-5 hover:-translate-y-1'
                        initial={{ y: 150, opacity: 0 }}
                        ref={(el) => (ref.current[index] = el)}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        onAnimationComplete={() => {
                            const card = ref.current[index];
                            if (card) {
                                card.classList.add("transition", "duration-300");
                            }
                        }}
                    >
                        <div className='flex items-center justify-between'>
                            <p className="font-medium">{item.about}</p>
                            <img className='size-10 rounded-full' src={item.image} alt={item.name} />
                        </div>
                        <p className='line-clamp-3'>"{item.review}"</p>
                        <p className='text-gray-300'>
                            - {item.name}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}