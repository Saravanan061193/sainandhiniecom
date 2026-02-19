"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X, ChevronDown, Heart, Package, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const { cartCount } = useCart();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<{ _id: string, name: string, slug: string }[]>([]);

    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const fetchData = async () => {
            try {
                const [catRes, setRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/admin/settings')
                ]);

                if (catRes.ok) {
                    const data = await catRes.json();
                    if (Array.isArray(data)) setCategories(data);
                }

                if (setRes.ok) {
                    const sData = await setRes.json();
                    setSettings(sData);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    return (
        <>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <div className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "top-0" : "top-0"}`}>
                {/* Announcement Bar & Contact Info */}
                {!isScrolled && (
                    <div className="bg-primary-dark text-secondary py-2 border-b border-white/5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] font-sans font-medium uppercase tracking-widest">
                            <div className="flex items-center gap-6 pl-4">
                                {settings?.contactPhone && (
                                    <a href={`tel:${settings.contactPhone}`} className="hover:text-accent transition-colors flex items-center gap-2">
                                        <Phone size={12} className="text-accent" /> {settings.contactPhone}
                                    </a>
                                )}
                                {settings?.contactEmail && (
                                    <a href={`mailto:${settings.contactEmail}`} className="hidden sm:flex hover:text-accent transition-colors items-center gap-2">
                                        <Mail size={12} className="text-accent" /> {settings.contactEmail}
                                    </a>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="hidden md:block opacity-60">Follow Us:</span>
                                {settings?.socialMedia?.facebook && (
                                    <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                        <Facebook size={14} />
                                    </a>
                                )}
                                {settings?.socialMedia?.instagram && (
                                    <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                        <Instagram size={14} />
                                    </a>
                                )}
                                {settings?.socialMedia?.twitter && (
                                    <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                        <Twitter size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <nav className={`transition-all duration-300 ${isScrolled ? "bg-primary/95 backdrop-blur-md shadow-xl py-2" : "bg-primary py-4"}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Mobile Menu Button */}
                            <button className="lg:hidden p-2 text-secondary" onClick={() => setIsMenuOpen(true)}>
                                <Menu size={24} />
                            </button>

                            {/* Brand Logo - Premium Style */}
                            <Link href="/" className="flex flex-col items-center group">
                                <span className="text-2xl md:text-3xl font-serif font-black text-secondary tracking-normal leading-none group-hover:text-accent transition-colors">
                                    Sai Nandhini
                                </span>
                                <span className="text-[10px] uppercase font-sans font-bold tracking-[0.3em] text-accent leading-none mt-1">
                                    Tasty World – Madurai
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center gap-8">
                                <div className="relative group">
                                    <button className="flex items-center gap-1 text-[13px] font-sans font-semibold text-secondary hover:text-accent transition-colors">
                                        Shop Categories <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                                    </button>
                                    <div className="absolute top-full -left-4 w-56 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all">
                                        <div className="bg-white rounded-xl shadow-xl overflow-hidden py-2 ring-1 ring-primary/5">
                                            {categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <Link
                                                        key={cat._id}
                                                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                                        className="block px-6 py-2.5 text-sm font-bold text-primary/70 hover:bg-secondary/20 hover:text-primary-dark transition-colors font-sans"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="px-6 py-3 text-xs text-primary/40 font-medium italic">No categories found</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Link href="/shop" className="text-[13px] font-sans font-semibold text-secondary hover:text-accent transition-colors">All Products</Link>
                                <Link href="/shop?category=Combos" className="text-[13px] font-sans font-semibold text-accent hover:text-white transition-colors">Combos</Link>
                                <Link href="/enquiry" className="text-[13px] font-sans font-semibold text-secondary hover:text-accent transition-colors">Corporate Orders</Link>
                            </div>

                            {/* Action Icons */}
                            <div className="flex items-center gap-2 md:gap-4">
                                <button className="hidden sm:block p-2 text-secondary hover:text-accent transition-colors">
                                    <Search size={20} />
                                </button>
                                {session ? (
                                    <Link href="/admin/dashboard" className="p-2 text-secondary hover:text-accent transition-colors">
                                        <User size={20} />
                                    </Link>
                                ) : (
                                    <Link href="/login" className="p-2 text-secondary hover:text-accent transition-colors">
                                        <User size={20} />
                                    </Link>
                                )}
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="p-2 text-secondary hover:text-accent relative group transition-colors"
                                >
                                    <ShoppingCart size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-accent text-primary-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Sidebar Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] p-8 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div className="flex flex-col">
                                    <span className="text-xl font-serif font-black text-primary-dark italic tracking-tighter">Tasty World</span>
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-primary/40 hover:text-primary-dark transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6 flex-grow overflow-y-auto">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest border-b border-primary/5 pb-2">Menu</p>
                                    <Link href="/shop" className="block text-xl font-bold text-primary-dark" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                                    <Link href="/shop?category=Combos" className="block text-xl font-bold text-brown" onClick={() => setIsMenuOpen(false)}>Combo Offers</Link>
                                    <Link href="/enquiry" className="block text-xl font-bold text-primary-dark" onClick={() => setIsMenuOpen(false)}>Corporate Orders</Link>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest border-b border-primary/5 pb-2">Categories</p>
                                    {categories.length > 0 ? (
                                        categories.map(cat => (
                                            <Link
                                                key={cat._id}
                                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                                className="block text-lg font-medium text-primary/60 hover:text-primary-dark transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {cat.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-primary/40 italic">No categories available</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-primary/5 flex flex-col gap-4">
                                <Link href={session ? "/admin/dashboard" : "/login"} className="flex items-center gap-3 text-primary-dark font-bold" onClick={() => setIsMenuOpen(false)}>
                                    <User size={20} /> {session ? "My Dashboard" : "Login / Register"}
                                </Link>
                                <Link href="/checkout" className="flex items-center gap-3 text-primary-dark font-bold" onClick={() => setIsMenuOpen(false)}>
                                    <Package size={20} /> Track Orders
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
