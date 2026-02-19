"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, MapPin } from "lucide-react";
import Link from "next/link";

import { useState, useEffect } from "react";

export default function Hero() {
    const [banner, setBanner] = useState("https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=1600");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.heroBanner) {
                        setBanner(data.heroBanner);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch hero settings", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-secondary">
            {/* Background Image with more natural blending */}
            <div className="absolute inset-0 z-0">
                <img
                    src={banner}
                    className="w-full h-full object-cover opacity-80"
                    alt="Madurai bakery atmosphere"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent lg:to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary to-transparent" />
            </div>

            <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-6"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark/60">
                            Loved by <span className="text-primary-dark">2,400+ Families</span> in Chennai
                        </p>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-black text-primary-dark leading-[1.1] tracking-tight mb-6"
                    >
                        Freshly Baked with <br />
                        <span className="text-brown italic relative inline-block px-2">
                            Love
                            <svg className="absolute -bottom-1 left-0 w-full text-secondary/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <path d="M0 10 Q 25 20, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
                            </svg>
                        </span> in Madurai.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-primary-dark/80 font-sans font-medium mb-10 leading-relaxed max-w-lg"
                    >
                        Our traditional wood-fired kitchen brings you the authentic taste of <span className="text-primary font-bold underline decoration-accent/50">homemade goodness</span>, crafted fresh every single morning.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link href="/shop" className="bg-accent text-primary-dark px-10 py-5 rounded-full font-sans font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-black hover:text-white transition-all active:scale-95 flex items-center gap-2 group">
                            Order Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="bg-white/80 backdrop-blur-sm text-primary-dark px-10 py-5 rounded-full font-sans font-bold uppercase tracking-widest text-[11px] shadow-sm border border-primary/10 hover:border-primary transition-all active:scale-95 flex items-center gap-2 group">
                            <Play size={14} fill="currentColor" /> Our Story
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 flex items-center gap-8"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary-dark font-serif font-black bg-white">SN</div>
                            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary-dark/60 leading-tight">
                                Heritage Baking <br /> <span className="text-primary-dark">Est. 2024</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-primary/20" />
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-accent" />
                            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary-dark/60">Delivering Fresh <br /> Across Madurai</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Subtle Brand Imperfections - Floating elements */}
            <div className="absolute top-1/4 right-10 hidden lg:block opacity-10">
                <img src="https://img.icons8.com/ios/100/000000/wheat.png" className="w-24 h-24 rotate-12" alt="" />
            </div>
        </section>
    );
}
