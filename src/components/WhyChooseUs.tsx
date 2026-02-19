"use client";

import { motion } from "framer-motion";
import { Coffee, Heart, Leaf, Cookie } from "lucide-react";

export default function WhyChooseUs() {
    return (
        <section className="py-32 bg-secondary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-20 opacity-5 hidden lg:block select-none">
                <span className="text-[200px] font-serif font-black italic text-primary">Soul</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-6 block">Our Secret Sauce</span>
                        <h2 className="text-4xl md:text-7xl font-serif font-black text-primary-dark tracking-tighter leading-[0.95] mb-10">
                            No shortcuts. <br />
                            No <span className="text-brown italic relative inline-block">
                                White Sugar.
                                <svg className="absolute -bottom-2 left-0 w-full text-accent/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0 10 Q 50 20, 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                            </span> <br />
                            No Guilt.
                        </h2>
                        <div className="space-y-12">
                            {[
                                {
                                    title: "Heirloom Recipes",
                                    desc: "Our recipes aren't from a lab or an AI. They're heritage bakes we've refined over 15 years to work perfectly with organic grains.",
                                    icon: Coffee
                                },
                                {
                                    title: "The Jaggery Journey",
                                    desc: "We replaced 100% of refined sugar with pure farm jaggery. It's harder to bake with, but your body will thank you.",
                                    icon: Cookie
                                },
                                {
                                    title: "Real Flour, Real Grits",
                                    desc: "We use stone-ground whole wheat and native millets. You'll see the grain, you'll taste the fiber, and you'll feel the difference.",
                                    icon: Leaf
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex gap-6 group"
                                >
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-dark shadow-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6 border border-primary/5">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif font-bold text-primary-dark mb-2">{item.title}</h4>
                                        <p className="text-sm text-primary/60 font-sans font-bold leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="aspect-square rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative rotate-2 group-hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://images.pexels.com/photos/4686958/pexels-photo-4686958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-[2s]"
                                alt="Our kitchen in action"
                            />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity" />
                        </div>
                        {/* Hand-drawn style badge */}
                        <div className="absolute -bottom-10 -left-10 bg-accent p-8 rounded-[3rem] shadow-2xl -rotate-6 group-hover:rotate-3 transition-transform">
                            <p className="text-white text-3xl font-serif italic font-bold leading-tight">Since <br /> Yesterday.</p>
                            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-2">Literally fresh.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
