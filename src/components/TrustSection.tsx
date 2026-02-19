"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const trustPoints = [
    {
        photo: "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=200",
        title: "Cold-Pressed Purity",
        desc: "0% industrial processing. We strictly use traditional wood-pressed methods for maximum nutrient retention.",
        stats: "100% PURITY",
        bg: "bg-[#FFF9F0]", // Warm Beige
        badge: "bg-[#F3E6D0] text-[#8C7B60]"
    },
    {
        photo: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=200",
        title: "4 AM Fresh Batch",
        desc: "Baked before the city wakes up. From our ovens to your doorstep within 4 hours of preparation.",
        stats: "FRESH DAILY",
        bg: "bg-[#F2F7F5]", // Muted Sage
        badge: "bg-[#E0EBE6] text-[#5C7A6F]"
    },
    {
        photo: "https://images.pexels.com/photos/1105068/pexels-photo-1105068.jpeg?auto=compress&cs=tinysrgb&w=200",
        title: "Native Millets",
        desc: "Sourced directly from 12 partner farms in Tamil Nadu. Supporting sustainable local agriculture.",
        stats: "12+ FARMERS",
        bg: "bg-[#F5F5F7]", // Warm Grey
        badge: "bg-[#E6E6E8] text-[#6B6B75]"
    },
    {
        photo: "https://images.pexels.com/photos/2014705/pexels-photo-2014705.jpeg?auto=compress&cs=tinysrgb&w=200",
        title: "Chennai Soul",
        desc: "Born in Anna Nagar. Delivered with the warmth of true Southern hospitality to your home.",
        stats: "LOCAL FOCUS",
        bg: "bg-[#FFF0F0]", // Dusty Rose
        badge: "bg-[#FFE0E0] text-[#9E6B6B]"
    }
];

export default function TrustSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trustPoints.map((point, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className={`${point.bg} rounded-[24px] p-6 relative group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]`}
                        >
                            <div className="flex justify-between items-start mb-5">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm shadow-black/5">
                                    <img
                                        src={point.photo}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        alt={point.title}
                                    />
                                </div>
                                <span className={`${point.badge} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                                    {point.stats}
                                </span>
                            </div>

                            <h3 className="text-xl font-sans font-bold text-gray-900 mb-2">
                                {point.title}
                            </h3>

                            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 min-h-[60px]">
                                {point.desc}
                            </p>

                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 opacity-60 group-hover:opacity-100 transition-all group-hover:gap-3">
                                Explore <ArrowRight size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
