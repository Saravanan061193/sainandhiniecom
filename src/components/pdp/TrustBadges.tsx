"use client";

import { Leaf, ShieldCheck, Zap, Truck, Sparkles, Heart } from "lucide-react";

export default function TrustBadges() {
    const badges = [
        { icon: Leaf, label: "100% Organic", desc: "No Chemicals" },
        { icon: ShieldCheck, label: "Preservative Free", desc: "Pure Ingredients" },
        { icon: Zap, label: "Freshly Baked", desc: "Baked Daily" },
        { icon: Truck, label: "Same Day Delivery", desc: "Chennai Local" }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-12 border-t border-b border-primary/5 py-12">
            {badges.map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                    <div className="w-14 h-14 bg-secondary/30 rounded-2xl flex items-center justify-center text-primary-dark mb-3 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                        <b.icon size={24} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-primary-dark mb-1">{b.label}</h4>
                    <p className="text-[9px] text-primary/40 font-sans font-bold uppercase tracking-tight">{b.desc}</p>
                </div>
            ))}
        </div>
    );
}
