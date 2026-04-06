'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MailIcon, LockIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            full_name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };

        try {
            const res = await fetch('https://project-sbom.onrender.com/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Account created! Please sign in.');
                router.push('/sign-in');
            } else {
                const data = await res.json();
                alert(data.detail || 'Signup failed');
            }
        } catch (err) {
            console.error(err);
            alert('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

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

            <main className='px-4 flex items-center justify-center' style={{ minHeight: 'calc(100vh - 80px)' }}>
                <motion.div className="w-full max-w-md my-20"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <div className="text-center mb-8">
                        <motion.h1 className="text-4xl font-semibold tracking-tight"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            Create Account
                        </motion.h1>
                        <motion.p className="text-gray-100 mt-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            Start securing your software supply chain today
                        </motion.p>
                    </div>

                    <motion.div className="glass rounded-2xl p-8"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-lg glass border-white/20 bg-white/5 focus:bg-white/10 focus:border-white/40 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-lg glass border-white/20 bg-white/5 focus:bg-white/10 focus:border-white/40 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-lg glass border-white/20 bg-white/5 focus:bg-white/10 focus:border-white/40 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-sm">
                                <input type="checkbox" className="mt-1 rounded" id="terms" required />
                                <label htmlFor="terms" className="text-gray-100">
                                    I agree to the <Link href="#" className="hover:text-white transition">Terms of Service</Link> and <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                                </label>
                            </div>

                            <button type="submit" disabled={loading} className="w-full btn bg-white text-gray-800 py-3 disabled:opacity-50">
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-100">Already have an account? </span>
                            <Link href="/sign-in" className="font-medium hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </>
    );
}
