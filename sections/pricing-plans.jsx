import SectionTitle from "@/components/section-title";
import { CheckIcon, CrownIcon, RocketIcon, ZapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function PricingPlans() {
    const ref = useRef([]);
    const data = [
        {
            icon: RocketIcon,
            title: 'Starter',
            description: 'For individuals and small projects',
            price: '$19',
            buttonText: 'Get Started',
            features: [
                'Up to 10 SBOM scans/month',
                'Basic risk scoring',
                'CycloneDX format export',
                'Dependency list generation',
                'Email support only',
                'Community resources'
            ],
        },
        {
            icon: ZapIcon,
            title: 'Professional',
            description: 'For growing teams and enterprises',
            price: '$49',
            mostPopular: true,
            buttonText: 'Upgrade Now',
            features: [
                'Unlimited SBOM scans',
                'Advanced risk analysis',
                'SBOM diff comparison',
                'Contextual red flags',
                'Priority support',
                'API access'
            ],
        },
        {
            icon: CrownIcon,
            title: 'Enterprise',
            description: 'For large organizations',
            price: '$149',
            buttonText: 'Contact Sales',
            features: [
                'Custom risk policies',
                'Internal module recognition',
                'Dedicated account manager',
                'On-premise deployment',
                'SLA uptime guarantee',
                '24/7 premium support'
            ],
        },
    ];

    return (
        <section className="mt-20">
            <SectionTitle
                title="Transparent Pricing"
                description="Choose the plan that fits your security needs. No hidden fees, cancel anytime."
            />

            <div className='mt-16 flex flex-wrap items-center justify-center gap-8'>
                {data.map((item, index) => (
                    <motion.div key={index}
                        className={`group w-full max-w-80 p-8 rounded-2xl transition-all duration-300 relative ${item.mostPopular ? 'glass border-blue-400/50 shadow-lg shadow-blue-500/20 scale-105 z-10' : 'glass hover:-translate-y-1'}`}
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        ref={(el) => (ref.current[index] = el)}
                        onAnimationComplete={() => {
                            const card = ref.current[index];
                            if (card) {
                                card.classList.add("transition", "duration-300");
                            }
                        }}
                    >
                        {item.mostPopular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                MOST POPULAR
                            </div>
                        )}

                        <div className={`flex items-center w-max ml-auto text-xs gap-2 rounded-full px-3 py-1 ${item.mostPopular ? 'bg-white/10 text-white' : 'glass'}`}>
                            <item.icon className='size-3.5' />
                            <span>{item.title}</span>
                        </div>
                        <h3 className='mt-6 text-3xl font-bold'>
                            {item.price} <span className={`text-base font-normal ${item.mostPopular ? 'text-gray-200' : 'text-gray-400'}`}>/month</span>
                        </h3>
                        <p className={`mt-3 text-sm ${item.mostPopular ? 'text-gray-100' : 'text-gray-300'}`}>{item.description}</p>

                        <button className={`mt-8 rounded-xl w-full py-3 font-medium transition-transform duration-200 active:scale-95 ${item.mostPopular ? 'bg-white text-gray-900 hover:bg-gray-100' : 'glass hover:bg-white/10'}`}>
                            {item.buttonText}
                        </button>

                        <div className='mt-8 flex flex-col gap-4'>
                            {item.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className='flex items-start gap-3'>
                                    <div className={`mt-0.5 rounded-full p-0.5 ${item.mostPopular ? 'bg-blue-500' : 'glass'}`}>
                                        <CheckIcon className='size-3 text-white' strokeWidth={3} />
                                    </div>
                                    <p className={`text-sm ${item.mostPopular ? 'text-gray-100' : 'text-gray-300'}`}>{feature}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}