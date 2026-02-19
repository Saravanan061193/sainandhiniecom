"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
        }
    };

    return (
        <section className="py-24 bg-secondary">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-white rounded-[4rem] px-8 py-16 md:p-20 shadow-2xl overflow-hidden border border-primary/5">
                    {/* Background Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-secondary rounded-full opacity-50 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/10 rounded-full opacity-50 blur-3xl pointer-events-none" />

                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-primary/5 text-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Mail size={30} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-primary-dark tracking-tighter mb-4">
                            Join the <span className="text-brown italic font-serif relative inline-block">
                                Tasty World Club
                                <svg className="absolute -bottom-2 left-0 w-full text-accent/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0 10 Q 50 20, 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-primary/60 font-sans font-medium mb-12 px-8">
                            Get exclusive weekly deals, fresh recipes, and early access to holiday gift hampers direct to your inbox.
                        </p>

                        {!subscribed ? (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-grow bg-secondary/20 rounded-2xl border-2 border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all p-4 flex items-center">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address..."
                                        className="w-full bg-transparent outline-none font-sans font-bold text-sm text-primary-dark placeholder:text-primary/30"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-8 py-5 rounded-2xl font-sans font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 group"
                                >
                                    Subscribe Now <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] text-primary-dark font-sans font-bold"
                            >
                                ✨ Welcome aboard! Check your inbox for 10% off your first order.
                            </motion.div>
                        )}
                        <p className="mt-8 text-[10px] font-sans font-black uppercase tracking-widest text-primary/30">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
