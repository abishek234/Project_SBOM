'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, MailIcon, CalendarIcon, KeyIcon, LockIcon, ShieldCheckIcon, ArrowRightIcon } from 'lucide-react';
import SectionTitle from '@/components/section-title';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [otpStep, setOtpStep] = useState('none'); // none, request, verify
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            // Fetch fresh data from backend
            fetch(`https://project-sbom.onrender.com/auth/profile/${userData.email}`)
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                    setLoading(false);
                })
                .catch(() => {
                    setUser(userData); // Fallback to local
                    setLoading(false);
                });
        } else {
            router.push('/sign-in');
        }
    }, [router]);

    const handleRequestOTP = async () => {
        setOtpLoading(true);
        try {
            const res = await fetch('https://project-sbom.onrender.com/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });
            if (res.ok) {
                alert('OTP sent to your email! (Check backend logs for demo)');
                setOtpStep('verify');
            } else {
                alert('Failed to request OTP');
            }
        } catch (err) {
            alert('Connection error');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setOtpLoading(true);
        try {
            const res = await fetch('https://project-sbom.onrender.com/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    otp: otpValue,
                    new_password: newPassword
                })
            });
            if (res.ok) {
                alert('Password updated successfully! Please sign in again.');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('storage'));
                router.push('/sign-in');
            } else {
                const data = await res.json();
                alert(data.detail || 'Reset failed');
            }
        } catch (err) {
            alert('Connection error');
        } finally {
            setOtpLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Profile...</div>;

    return (
        <div className="relative isolate min-h-screen">
            {/* Background Gradients */}
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

            <main className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
                <SectionTitle title="User Profile" description="Manage your account settings and security preferences." />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {/* User Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-1 space-y-6"
                    >
                        <div className="glass rounded-3xl p-8 flex flex-col items-center text-center">
                            <div className="size-24 rounded-full bg-gradient-to-tr from-[#F26A06] to-[#D10A8A] p-1 mb-6">
                                <div className="size-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                                    {user.avatar_url ? <img src={user.avatar_url} alt="avatar" /> : <UserIcon className="size-10 text-gray-400" />}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
                            <p className="text-gray-400 text-sm">{user.email}</p>

                            <div className="w-full mt-8 pt-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-left">
                                    <CalendarIcon className="size-4 text-orange-500" />
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Joined</p>
                                        <p className="text-xs text-gray-300">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-left">
                                    <ShieldCheckIcon className="size-4 text-green-500" />
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Status</p>
                                        <p className="text-xs text-green-400">Verified Account</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Account Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 space-y-8"
                    >
                        {/* Security Section */}
                        <div className="glass rounded-3xl p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <LockIcon className="size-5 text-orange-500" />
                                Security Settings
                            </h3>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-medium text-white">Password</h4>
                                        <p className="text-sm text-gray-400">Last changed 3 months ago</p>
                                    </div>
                                    <button
                                        onClick={() => setOtpStep(otpStep === 'none' ? 'request' : 'none')}
                                        className="text-sm font-bold text-orange-500 hover:text-orange-400 transition"
                                    >
                                        Change Password
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {otpStep === 'request' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 mt-4 border-t border-white/10">
                                                <p className="text-sm text-gray-300 mb-4">
                                                    We will send a 6-digit OTP to <strong>{user.email}</strong> to verify your identity.
                                                </p>
                                                <button
                                                    onClick={handleRequestOTP}
                                                    disabled={otpLoading}
                                                    className="btn bg-orange-600 hover:bg-orange-500 text-white w-full py-2.5 flex items-center justify-center gap-2"
                                                >
                                                    {otpLoading ? 'Sending...' : 'Send OTP Code'}
                                                    <ArrowRightIcon className="size-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {otpStep === 'verify' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <form onSubmit={handleResetPassword} className="pt-4 mt-4 border-t border-white/10 space-y-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1.5 font-medium">Enter 6-Digit OTP</label>
                                                    <input
                                                        type="text"
                                                        maxLength={6}
                                                        value={otpValue}
                                                        onChange={(e) => setOtpValue(e.target.value)}
                                                        placeholder="000000"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition text-center text-xl tracking-[12px] font-bold"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1.5 font-medium">New Password</label>
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition"
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={otpLoading}
                                                    className="btn bg-green-600 hover:bg-green-500 text-white w-full py-2.5"
                                                >
                                                    {otpLoading ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Session Section */}
                        <div className="glass rounded-3xl p-8">
                            <h3 className="text-lg font-bold text-white mb-6">Connected Apps</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                            <KeyIcon className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Risk API Key</p>
                                            <p className="text-xs text-gray-500">Active • Used 4h ago</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">Revoke</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
