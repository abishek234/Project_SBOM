'use client';

import { motion } from 'framer-motion';
import SectionTitle from '@/components/section-title';

export default function PrivacyPage() {
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
                    title="Privacy Policy"
                    description="We care about your data and how it is used."
                />

                <motion.div
                    className="mt-16 space-y-12 text-gray-300 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            We collect information to provide better services to all our users. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal Information:</strong> When you register, we ask for personal information, like your name and email address.</li>
                            <li><strong>Project Data:</strong> We analyze the dependency files you upload (e.g., package.json, go.mod) to generate SBOMs. We do not persist source code, only the metadata required for analysis.</li>
                            <li><strong>Usage Data:</strong> We collect information about how you interact with our services to improve performance and user experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Information</h2>
                        <p>
                            We use the information we collect to operate, maintain, and improve our services, to develop new features, and to protect Verix and our users. We may also use this information to communicate with you, such as sending you product updates and security alerts.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
                        <p>
                            We work hard to protect Verix and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. In particular:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>We encrypt many of our services using SSL.</li>
                            <li>We review our information collection, storage, and processing practices, including physical security measures, to guard against unauthorized access to systems.</li>
                            <li>We restrict access to personal information to Verix employees, contractors, and agents who need to know that information in order to process it for us, and who are subject to strict contractual confidentiality obligations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Cookies</h2>
                        <p>
                            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Third Party Services</h2>
                        <p>
                            We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Children's Privacy</h2>
                        <p>
                            Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Privacy Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the bottom of this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@verix-sbom.com" className="text-blue-400 hover:text-blue-300">privacy@verix-sbom.com</a>
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                        Effective date: February 3, 2026
                    </div>
                </motion.div>
            </main>
        </>
    );
}
