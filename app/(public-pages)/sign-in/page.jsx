'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MailIcon, LockIcon } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        try {
            const res = await fetch('https://project-sbom.onrender.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Dispatch event so other components (Navbar) update immediately
                window.dispatchEvent(new Event('storage'));

                router.push('/sbom');
            } else {
                const data = await res.json();
                alert(data.detail || 'Login failed');
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
                            Welcome Back
                        </motion.h1>
                        <motion.p className="text-gray-100 mt-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            Sign in to manage project risks and generate SBOMs
                        </motion.p>
                    </div>

                    <motion.div className="glass rounded-2xl p-8"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <form className="space-y-6" onSubmit={handleSubmit}>
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

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span>Remember me</span>
                                </label>
                                <Link href="#" className="text-gray-100 hover:text-white transition">
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" disabled={loading} className="w-full btn bg-white text-gray-800 py-3 disabled:opacity-50">
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-100">Don't have an account? </span>
                            <Link href="/sign-up" className="font-medium hover:underline">
                                Create it
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </>
    );
}
