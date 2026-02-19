"use client";

import Link from "next/link";
import {
    Instagram,
    Facebook,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    ArrowUp,
    MessageCircle,
    ShoppingCart,
    Send
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goldColor = "#C8A951";

    return (
        <footer className="relative bg-[#FCFCFA]">


            {/* Main Footer Background */}
            <div className="bg-primary pt-16 pb-12 relative overflow-hidden">
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #FAF3E0 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-16">
                        {/* Column 1: Brand Info */}
                        <div className="space-y-6">
                            <Link href="/">
                                <h2 className="text-3xl font-serif font-black text-secondary tracking-wide">
                                    Sai Nandhini
                                </h2>
                            </Link>
                            <p className="text-accent font-serif italic text-lg opacity-90">
                                "Crafting Sweet Memories in Every Bite"
                            </p>
                            <p className="text-secondary/80 text-sm leading-relaxed max-w-xs font-sans">
                                Authentic traditional sweets and savories made with pure ingredients, tailored for your premium taste.
                            </p>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-start gap-4 group cursor-pointer text-secondary/80 hover:text-white transition-colors">
                                    <div className="p-2 rounded-full bg-secondary/10 group-hover:bg-accent group-hover:text-primary-dark transition-all">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-60">Call Us</p>
                                        <p className="text-sm font-medium">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group cursor-pointer text-secondary/80 hover:text-white transition-colors">
                                    <div className="p-2 rounded-full bg-secondary/10 group-hover:bg-accent group-hover:text-primary-dark transition-all">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-60">Email Us</p>
                                        <p className="text-sm font-medium">hello@sainandhini.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group cursor-pointer text-secondary/80 hover:text-white transition-colors">
                                    <div className="p-2 rounded-full bg-secondary/10 group-hover:bg-accent group-hover:text-primary-dark transition-all">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-60">Visit Us</p>
                                        <p className="text-sm font-medium">Anna Nagar, Chennai, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Our Policies */}
                        <div>
                            <h4 className="text-secondary font-serif font-bold text-xl mb-8 relative inline-block">
                                Our Policies
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                            </h4>
                            <ul className="space-y-4">
                                {['Privacy Policy', 'Shipping Policy', 'Return & Refund'].map((item) => (
                                    <li key={item}>
                                        <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-secondary/70 hover:text-accent hover:pl-2 transition-all flex items-center gap-2 text-sm font-medium font-sans">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Information */}
                        <div>
                            <h4 className="text-secondary font-serif font-bold text-xl mb-8 relative inline-block">
                                Information
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'Our Outlets', link: '/outlets' },
                                    { name: 'Track Your Order', link: '/track' },
                                    { name: 'About Us', link: '/about' },
                                    { name: 'Contact Us', link: '/contact' },
                                    { name: "FAQ's", link: '/faq' },
                                    { name: 'Combos', link: '/shop?category=Combos' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.link} className="text-secondary/70 hover:text-accent hover:pl-2 transition-all flex items-center gap-2 text-sm font-medium font-sans">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Made For You + Socials */}
                        <div>
                            <h4 className="text-secondary font-serif font-bold text-xl mb-8 relative inline-block">
                                Made For You
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                            </h4>
                            <ul className="space-y-4 mb-8">
                                {[
                                    { name: 'Customizable Packs', link: '/custom' },
                                    { name: 'Personalized Branding', link: '/branding' },
                                    { name: 'Bulk Orders', link: '/bulk' },
                                    { name: 'Corporate Gifting', link: '/corporate' },
                                    { name: 'Event Gifting', link: '/events' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.link} className="text-secondary/70 hover:text-accent hover:pl-2 transition-all flex items-center gap-2 text-sm font-medium font-sans">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Social Media */}
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary hover:bg-accent hover:border-accent hover:text-primary-dark transition-all transform hover:-translate-y-1">
                                    <Instagram size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary hover:bg-accent hover:border-accent hover:text-primary-dark transition-all transform hover:-translate-y-1">
                                    <Facebook size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Premium CTA Section */}
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        {[
                            { label: "Order Now", link: "/shop" },
                            { label: "Bulk Enquiry", link: "/bulk" },
                            { label: "Special Offers", link: "/offers" }
                        ].map(btn => (
                            <Link
                                key={btn.label}
                                href={btn.link}
                                className="px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 border border-accent text-accent hover:bg-accent hover:text-primary-dark font-sans"
                            >
                                {btn.label}
                            </Link>
                        ))}
                    </div>

                    {/* Copyright & Bottom */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center border-t border-white/10 pt-8">
                        <p className="text-secondary/40 text-xs font-medium uppercase tracking-widest font-sans">
                            © {new Date().getFullYear()} Sai Nandhini Tasty World. All Rights Reserved.
                        </p>
                        <div className="flex gap-6 text-secondary/40 text-xs font-bold uppercase tracking-widest font-sans">
                            <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
                            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Actions */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
                <button
                    onClick={scrollToTop}
                    className="w-10 h-10 bg-accent text-primary-dark backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:text-primary-dark transition-all border border-white/10"
                >
                    <ArrowUp size={20} />
                </button>
            </div>
        </footer>
    );
}
