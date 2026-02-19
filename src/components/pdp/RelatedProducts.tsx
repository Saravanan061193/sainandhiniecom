"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function RelatedProducts({ currentId }: { currentId: string }) {
    // Mocking related products for now. In a real app, fetch by category.
    const products = [
        { id: "1", name: "Ragi Almond Cookies", price: 220, rating: 4.8, image: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=400", slug: "ragi-almond-cookies" },
        { id: "2", name: "Sourdough Baguette", price: 150, rating: 4.9, image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400", slug: "sourdough-baguette" },
        { id: "3", name: "Choco Fudge Brownie", price: 95, rating: 4.7, image: "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=400", slug: "choco-fudge-brownie" },
        { id: "4", name: "Spicy Madras Mixture", price: 85, rating: 4.5, image: "https://images.pexels.com/photos/4051610/pexels-photo-4051610.jpeg?auto=compress&cs=tinysrgb&w=400", slug: "madras-mixture" },
    ];

    return (
        <section className="py-24 border-t border-primary/5 mt-20">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-4 block">Complete your treat</span>
                    <h2 className="text-4xl font-serif font-black text-primary-dark tracking-tighter">You May Also <span className="text-brown italic">Love</span></h2>
                </div>
                <Link href="/shop" className="text-xs font-sans font-black uppercase tracking-widest text-primary-dark hover:text-accent transition-colors flex items-center gap-2 group">
                    Browse All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group"
                    >
                        <Link href={`/shop/${p.slug}`}>
                            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-secondary/10 mb-6 relative border border-primary/5">
                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt={p.name} />
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-accent shadow-lg group-hover:bg-primary-dark group-hover:text-white transition-all">
                                    <Star size={14} fill="currentColor" />
                                </div>
                            </div>
                            <h3 className="text-lg font-serif font-black text-primary-dark mb-1 group-hover:text-primary transition-colors leading-tight">{p.name}</h3>
                            <div className="flex justify-between items-center">
                                <span className="font-sans font-black text-brown">₹{p.price}</span>
                                <span className="text-[10px] font-sans font-black uppercase tracking-widest text-primary/40 group-hover:text-primary-dark transition-colors">View Details</span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
