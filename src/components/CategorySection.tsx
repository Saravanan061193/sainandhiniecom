"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CategorySection() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setCategories(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return null;
    if (categories.length === 0) return null;

    return (
        <section className="py-24 bg-secondary/30">
            <div className="w-full px-4 sm:px-6 lg:px-10">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Our Collection</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-primary-dark tracking-tighter">
                        Curated for Every <br className="hidden lg:block" /> <span className="text-brown italic italic-font">Taste & Occasion</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10"
                        >
                            <img
                                src={cat.image || "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800"}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                alt={cat.name}
                            />
                            {/* Layered Gradient for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-secondary/80 mb-2 block group-hover:text-secondary transition-colors line-clamp-1">
                                    {cat.description || "Fresh & Authentic"}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-serif font-black text-white mb-6 leading-tight group-hover:scale-105 transition-transform origin-left line-clamp-2">
                                    {cat.name}
                                </h3>
                                <Link
                                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                    className="inline-flex items-center text-[10px] font-sans font-black uppercase tracking-widest text-white group-hover:text-secondary transition-colors"
                                >
                                    Explore Collection <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>

                            {/* Accent border on hover */}
                            <div className="absolute inset-0 border-0 group-hover:border-[8px] border-accent/20 transition-all pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
