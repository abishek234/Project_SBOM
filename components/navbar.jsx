'use client';

import { MenuIcon, XIcon, UserIcon, LogOutIcon, LayoutDashboardIcon, ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                setUser(null);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const isLoggedIn = !!user;

    const links = [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/features' },
        { name: 'Use Cases', href: '/use-cases' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Docs', href: '/docs' }
    ];

    // Dynamically add SBOM link if logged in
    const activeLinks = isLoggedIn
        ? [...links, { name: 'Risk & SBOM', href: '/sbom' }]
        : links;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <>
            <motion.nav className={`sticky top-0 z-50 flex w-full items-center justify-between px-4 py-3.5 md:px-16 lg:px-24 transition-colors ${isScrolled ? 'bg-white/15 backdrop-blur-lg' : ''}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link href='/'>
                    <Image src='/assets/logo.svg' alt='logo' className='h-8.5 w-auto' width={205} height={48} />
                </Link>

                <div className='hidden items-center space-x-10 md:flex'>
                    {activeLinks.map((link) => (
                        <Link key={link.name} href={link.href} className={`transition hover:text-white ${pathname === link.href ? 'text-white font-medium' : 'text-gray-300'}`}>
                            {link.name}
                        </Link>
                    ))}

                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-all px-3 py-1.5 rounded-full border border-white/10 active:scale-95"
                            >
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#F26A06] to-[#D10A8A] p-[1.5px]">
                                    <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                                        {user.avatar_url ? <img src={user.avatar_url} alt="avatar" /> : user.full_name[0]}
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-white">{user.full_name}</span>
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-3 w-56 bg-[#0a0a10]/80 backdrop-blur-2xl border border-white/10 rounded-2xl py-2 z-20 shadow-2xl overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-white/5 mb-1">
                                                <p className="text-xs text-gray-400">Signed in as</p>
                                                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                            </div>

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <UserIcon className="size-4" />
                                                My Profile
                                            </Link>

                                            <Link
                                                href="/sbom"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <LayoutDashboardIcon className="size-4" />
                                                Risk Management
                                            </Link>

                                            <Link
                                                href="/history"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <ClockIcon className="size-4" />
                                                Scan History
                                            </Link>

                                            <button
                                                onClick={() => { handleLogout(); setShowUserMenu(false); router.push('/'); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition mt-1 border-t border-white/5"
                                            >
                                                <LogOutIcon className="size-4" />
                                                Log Out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href='/sign-in' className='btn glass'>
                            Sign In
                        </Link>
                    )}
                </div>

                <button onClick={() => setIsOpen(true)} className='transition active:scale-90 md:hidden'>
                    <MenuIcon className='size-6.5' />
                </button>
            </motion.nav>

            <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90 text-lg font-medium backdrop-blur-2xl transition duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {activeLinks.map((link) => (
                    <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-white">
                        {link.name}
                    </Link>
                ))}

                {isLoggedIn ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                                <img src={user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="avatar" className="h-full w-full rounded-full bg-black" />
                            </div>
                            <span className="text-gray-200">{user.full_name}</span>
                        </div>
                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-400 text-sm font-bold">Log Out</button>
                    </div>
                ) : (
                    <Link href="/sign-in" onClick={() => setIsOpen(false)} className='btn glass'>
                        Sign In
                    </Link>
                )}

                <button onClick={() => setIsOpen(false)} className='absolute top-6 right-6 p-2 text-gray-400 hover:text-white'>
                    <XIcon className="size-8" />
                </button>
            </div >
        </>
    );
}
