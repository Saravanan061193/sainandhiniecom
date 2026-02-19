"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Users, Calendar, Briefcase, CheckCircle2 } from "lucide-react";

export default function CorporateEnquiry() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "Corporate Booking",
        message: "",
        date: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
                setFormData({ name: "", email: "", phone: "", type: "Corporate Booking", message: "", date: "" });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-100 p-8 rounded-3xl text-center"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Request Received!</h3>
                <p className="text-green-600">Thank you for considering Sai Nandhini. Our corporate team will contact you within 24 hours.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-green-700 font-bold hover:underline"
                >
                    Send another request
                </button>
            </motion.div>
        );
    }

    return (
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="bg-white/50 backdrop-blur-sm border border-primary/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-dark">
                            Partner With Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-primary-dark tracking-tighter">
                            Bulk Orders & <br /> <span className="text-primary italic">Event Catering</span>
                        </h2>
                        <p className="text-gray-600 leading-relaxed max-w-md font-medium">
                            From office celebrations to grand weddings, bring the authentic taste of Chennai to your special occasions.
                        </p>

                        <div className="grid gap-4 mt-8">
                            {[
                                { icon: Briefcase, title: "Corporate Gifting", desc: "Custom hampers for employees & clients" },
                                { icon: Users, title: "Large Gatherings", desc: "Live counters & bulk sweet boxes" },
                                { icon: Calendar, title: "Festival Specials", desc: "Pre-booking for Diwali, Pongal & more" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-white/50">
                                    <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center text-primary-dark shrink-0">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-bold text-primary-dark text-lg mb-1">{item.title}</h4>
                                        <p className="text-xs text-primary/60 font-sans font-bold">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-primary/5 border border-white relative">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-sans font-black uppercase tracking-widest text-primary/40 ml-2">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-secondary/10 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-sans font-bold text-primary-dark outline-none transition-all placeholder:text-primary/20"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-sans font-black uppercase tracking-widest text-primary/40 ml-2">Company</label>
                                    <input
                                        type="text"
                                        className="w-full bg-secondary/10 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-sans font-bold text-primary-dark outline-none transition-all placeholder:text-primary/20"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-primary/40 ml-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-secondary/10 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-sans font-bold text-primary-dark outline-none transition-all placeholder:text-primary/20"
                                    placeholder="john@company.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-sans font-black uppercase tracking-widest text-primary/40 ml-2">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-secondary/10 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-sans font-bold text-primary-dark outline-none transition-all placeholder:text-primary/20"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-sans font-black uppercase tracking-widest text-primary/40 ml-2">Enquiry Type</label>
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-secondary/10 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-sans font-bold text-primary-dark outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option>Corporate Booking</option>
                                            <option>Event Catering</option>
                                            <option>Bulk Order</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-primary/40 ml-2">Requirements</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-secondary/10 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-sans font-bold text-primary-dark outline-none transition-all min-h-[120px] resize-none placeholder:text-primary/20"
                                    placeholder="Tell us about the event size, date, and specific preferences..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-lg hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 group"
                            >
                                {loading ? "Sending..." : (
                                    <>Send Enquiry <Send size={16} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
