"use client";

import { motion } from "framer-motion";
import { Star, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setProducts(data.slice(0, 8)); // Display top 8 products
                    }
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <section className="py-24 bg-[#FAF9F6] flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </section>
    );

    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-secondary/30">
            <div className="w-full px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3 block">Real Food from Real People</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-primary-dark tracking-tighter">
                            The <span className="text-brown italic">Bakers'</span> Favorites
                        </h2>
                    </div>
                    <Link href="/shop" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-dark hover:text-primary transition-colors pb-1 border-b-2 border-primary/10">
                        Explore Full Oven <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Wide Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-10">
                    {products.map((product, i) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className="flex flex-col h-full bg-transparent group"
                        >
                            <div className="relative rounded-[2rem] overflow-hidden bg-white aspect-[4/5] mb-6 shadow-xl shadow-black/5 border border-primary/5 hover:border-accent transition-all group-hover:shadow-2xl">
                                <Link href={`/shop/${product.slug}`}>
                                    <img
                                        src={product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/400x500?text=No+Image"}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                    />
                                </Link>

                                {product.tag && (
                                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-primary-dark">{product.tag}</span>
                                    </div>
                                )}

                                <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product, 1);
                                        }}
                                        className="w-full bg-accent text-primary-dark py-3 rounded-xl font-sans font-bold uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
                                    >
                                        <ShoppingBag size={14} /> Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="px-2 flex flex-col flex-grow">
                                <Link href={`/shop/${product.slug}`} className="cursor-pointer block mb-2">
                                    <h3 className="text-lg font-serif font-bold text-primary-dark leading-tight line-clamp-2 hover:text-accent transition-colors">{product.name}</h3>
                                </Link>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-sans font-bold text-brown">₹{product.price}</span>
                                            {product.mrp && product.mrp > product.price && <span className="text-xs font-sans text-gray-400 line-through">₹{product.mrp}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-lg">
                                        <Star size={12} className="text-accent fill-accent" />
                                        <span className="text-xs font-sans font-bold text-primary-dark">{product.rating || "4.8"}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
