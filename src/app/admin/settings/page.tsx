"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Store, Truck, ShieldCheck, Globe, Plus, Trash2, Mail, Phone, MapPin, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Shipping Rates State
    const [shippingRates, setShippingRates] = useState<any[]>([]);
    const [newRate, setNewRate] = useState({ min: "", max: "", rate: "" });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [settingsRes, ratesRes] = await Promise.all([
                    fetch("/api/admin/settings"),
                    fetch("/api/admin/shipping-rates")
                ]);

                const sData = await settingsRes.json();
                const rData = await ratesRes.json();

                setSettings(sData);
                setShippingRates(Array.isArray(rData) ? rData.sort((a: any, b: any) => a.minWeight - b.minWeight) : []);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAll();
    }, []);

    const addRate = async () => {
        if (!newRate.min || !newRate.max || !newRate.rate) return;
        try {
            const res = await fetch("/api/admin/shipping-rates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    minWeight: Number(newRate.min),
                    maxWeight: Number(newRate.max),
                    rate: Number(newRate.rate)
                })
            });
            if (res.ok) {
                const rate = await res.json();
                setShippingRates([...shippingRates, rate].sort((a: any, b: any) => a.minWeight - b.minWeight));
                setNewRate({ min: "", max: "", rate: "" });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteRate = async (id: string) => {
        try {
            await fetch(`/api/admin/shipping-rates/${id}`, { method: "DELETE" });
            setShippingRates(shippingRates.filter((r) => r._id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                setMessage("Configuration Saved");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-[#C6A75E]" size={40} /></div>;

    return (
        <div className="space-y-12 pb-20 font-sans">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[#2F3E2C]/5 pb-6">
                <div>
                    <span className="text-[#C6A75E] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">Configuration</span>
                    <h1 className="text-4xl font-serif font-black text-[#2F3E2C] tracking-tight">System Settings</h1>
                </div>
                {message && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#2F3E2C] text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                        <Save size={14} /> {message}
                    </motion.div>
                )}
            </header>

            <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <Store size={150} className="text-[#2F3E2C]" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 bg-[#2F3E2C]/5 rounded-2xl flex items-center justify-center text-[#2F3E2C]">
                            <Store size={22} />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-[#2F3E2C]">Brand Identity</h2>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                            <input
                                type="text"
                                value={settings.shopName}
                                onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                                className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-bold text-[#2F3E2C] placeholder:text-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Hero Banner Image URL</label>
                            <input
                                type="text"
                                value={settings.heroBanner || ""}
                                onChange={(e) => setSettings({ ...settings, heroBanner: e.target.value })}
                                placeholder="Paste Pexels/Image URL here..."
                                className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-medium text-[#2F3E2C] placeholder:text-gray-300"
                            />
                            {settings.heroBanner && (
                                <div className="mt-2 rounded-xl overflow-hidden h-20 border border-gray-100">
                                    <img src={settings.heroBanner} className="w-full h-full object-cover" alt="Banner Preview" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Secondary Banner Image URL</label>
                            <input
                                type="text"
                                value={settings.secondaryBanner || ""}
                                onChange={(e) => setSettings({ ...settings, secondaryBanner: e.target.value })}
                                placeholder="Paste Pexels/Image URL here..."
                                className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-medium text-[#2F3E2C] placeholder:text-gray-300"
                            />
                            {settings.secondaryBanner && (
                                <div className="mt-2 rounded-xl overflow-hidden h-20 border border-gray-100">
                                    <img src={settings.secondaryBanner} className="w-full h-full object-cover" alt="Banner Preview" />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Support Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="email"
                                        value={settings.contactEmail}
                                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                        className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-medium text-[#2F3E2C]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Support Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={settings.contactPhone}
                                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                        className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-medium text-[#2F3E2C]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-6 top-6 text-gray-400" size={16} />
                                <textarea
                                    rows={3}
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-medium text-[#2F3E2C] resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financials & Shipping */}
                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <Truck size={150} className="text-[#C6A75E]" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 bg-[#C6A75E]/10 rounded-2xl flex items-center justify-center text-[#C6A75E]">
                            <Truck size={22} />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-[#2F3E2C]">Logistics & Tax</h2>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    value={settings.taxRate}
                                    onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                                    className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-bold text-[#2F3E2C]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Base Shipping (₹)</label>
                                <input
                                    type="number"
                                    value={settings.shippingFee}
                                    onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                                    className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-bold text-[#2F3E2C]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Free Shipping Threshold (₹)</label>
                            <input
                                type="number"
                                value={settings.freeShippingThreshold}
                                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                                className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-bold text-[#2F3E2C]"
                            />
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#2F3E2C] mb-4">Payment Gateway</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    placeholder="Razorpay Key ID"
                                    value={settings.payment?.razorpayKeyId || ""}
                                    onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, razorpayKeyId: e.target.value } })}
                                    className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 font-mono text-xs text-[#2F3E2C]"
                                />
                                <input
                                    type="password"
                                    placeholder="Razorpay Key Secret"
                                    value={settings.payment?.razorpayKeySecret || ""}
                                    onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, razorpayKeySecret: e.target.value } })}
                                    className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 font-mono text-xs text-[#2F3E2C]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Experience */}
                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#2F3E2C]/5 rounded-2xl flex items-center justify-center text-[#2F3E2C]">
                            <ShieldCheck size={22} />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-[#2F3E2C]">Checkout Rules</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Weight Based Shipping", desc: "Calculate fees based on total cart weight", key: "shippingByWeight" },
                            { label: "Order Cancellation", desc: "Allow customers to cancel pending orders", key: "allowOrderCancellation" },
                            { label: "Scheduled Delivery", desc: "Enable delivery date selection at checkout", key: "allowScheduledOrders" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-[#F8F6F2] rounded-2xl border border-transparent hover:border-[#C6A75E]/20 transition-all cursor-pointer" onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}>
                                <div>
                                    <h4 className="font-bold text-[#2F3E2C] text-sm mb-1">{item.label}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.desc}</p>
                                </div>
                                <div className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${settings[item.key] ? 'bg-[#2F3E2C]' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        ))}

                        <AnimatePresence>
                            {settings.shippingByWeight && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 overflow-hidden">
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <h4 className="font-black text-[#2F3E2C] text-xs uppercase tracking-widest mb-4">Weight Rate Table</h4>
                                        <div className="space-y-2 mb-4">
                                            {shippingRates.map((rate) => (
                                                <div key={rate._id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                    <span className="text-xs font-bold text-gray-500">{rate.minWeight}kg - {rate.maxWeight}kg</span>
                                                    <span className="text-xs font-black text-[#2F3E2C]">₹{rate.rate}</span>
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); deleteRate(rate._id); }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                                </div>
                                            ))}
                                            {shippingRates.length === 0 && <p className="text-xs text-gray-400 italic">No custom rates defined.</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <input placeholder="Min" type="number" className="w-full p-3 rounded-xl border-none bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#C6A75E]/30" value={newRate.min} onChange={(e) => setNewRate({ ...newRate, min: e.target.value })} onClick={(e) => e.stopPropagation()} />
                                            <input placeholder="Max" type="number" className="w-full p-3 rounded-xl border-none bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#C6A75E]/30" value={newRate.max} onChange={(e) => setNewRate({ ...newRate, max: e.target.value })} onClick={(e) => e.stopPropagation()} />
                                            <input placeholder="₹" type="number" className="w-full p-3 rounded-xl border-none bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#C6A75E]/30" value={newRate.rate} onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })} onClick={(e) => e.stopPropagation()} />
                                            <button type="button" onClick={(e) => { e.stopPropagation(); addRate(); }} className="bg-[#2F3E2C] text-white p-3 rounded-xl shadow-lg hover:bg-[#1f2b1d]"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 xl:col-span-2 space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#2F3E2C]/5 rounded-2xl flex items-center justify-center text-[#2F3E2C]">
                            <Globe size={22} />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-[#2F3E2C]">Search Logic (SEO)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={settings.seo?.metaTitle || ""}
                                    onChange={(e) => setSettings({ ...settings, seo: { ...(settings.seo || {}), metaTitle: e.target.value } })}
                                    className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-bold text-[#2F3E2C]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Meta Keywords</label>
                                <input
                                    type="text"
                                    value={settings.seo?.keywords || ""}
                                    onChange={(e) => setSettings({ ...settings, seo: { ...(settings.seo || {}), keywords: e.target.value } })}
                                    className="w-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-medium text-[#2F3E2C]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Meta Description</label>
                            <textarea
                                rows={5}
                                value={settings.seo?.metaDescription || ""}
                                onChange={(e) => setSettings({ ...settings, seo: { ...(settings.seo || {}), metaDescription: e.target.value } })}
                                className="w-full h-full bg-[#F8F6F2] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#C6A75E]/30 transition-all font-medium text-[#2F3E2C] resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* System Actions */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#2F3E2C] p-8 rounded-[32px] text-white flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-serif font-bold mb-1">Maintenance Mode</h4>
                            <p className="text-[10px] uppercase tracking-widest opacity-60">Take store offline temporarily</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSettings({ ...settings, isMaintenanceMode: !settings.isMaintenanceMode })}
                            className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${settings.isMaintenanceMode ? 'bg-[#C6A75E]' : 'bg-white/20'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 flex items-center justify-between group">
                        <div>
                            <h4 className="text-lg font-serif font-bold text-red-700 mb-1 flex items-center gap-2"><AlertTriangle size={18} /> Danger Zone</h4>
                            <p className="text-[10px] uppercase tracking-widest text-red-400">Irreversible Data Loss</p>
                        </div>
                        <button
                            type="button"
                            onClick={async () => {
                                if (confirm("DELETE ALL DATA? This cannot be undone.")) {
                                    const res = await fetch("/api/admin/reset-demo-data", { method: "POST" });
                                    if (res.ok) window.location.reload();
                                }
                            }}
                            className="px-6 py-3 bg-white text-red-500 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            Reset Data
                        </button>
                    </div>
                </div>

                <div className="xl:col-span-2 flex justify-end sticky bottom-6 z-20 pointer-events-none">
                    <button
                        type="submit"
                        disabled={saving}
                        className="pointer-events-auto bg-[#C6A75E] text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-[#b0934e] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
