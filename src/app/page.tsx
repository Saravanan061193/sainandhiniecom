import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import AboutUs from "@/components/AboutUs";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CorporateEnquiry from "@/components/CorporateEnquiry";
import { Star } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <Hero />

            {/* Trust Badges */}
            <TrustSection />

            {/* Top Categories */}
            <CategorySection />

            {/* Best Sellers */}
            <FeaturedProducts />

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Customer Reviews Section */}
            <section className="py-32 bg-secondary/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-center md:text-left">
                        <div>
                            <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-4 block">Kind Words</span>
                            <h2 className="text-4xl md:text-6xl font-serif font-black text-primary-dark tracking-tighter">
                                Loved by <span className="text-secondary italic font-serif relative inline-block">
                                    5,000+ Regulars
                                    <svg className="absolute -bottom-2 left-0 w-full text-accent/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0 10 Q 50 20, 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
                                    </svg>
                                </span>
                            </h2>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex gap-1 mb-2 text-accent">
                                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                            </div>
                            <p className="text-xs font-sans font-black uppercase tracking-widest text-primary-dark opacity-60">Combined 4.8 Store Rating</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Jenkins", role: "Weekly Guest", text: "The artisanal sourdough here is world-class! It's our weekly ritual to grab a loaf and some of their traditional sweets. Best bakery in town hands down!" },
                            { name: "Arjun Sharma", role: "Wedding Planner", text: "Ordered my wedding cake from Sai Nandhini. Not only was it stunning to look at, but the taste was incredible. Everyone asked where we got it!" },
                            { name: "Priya Patel", role: "Home Maker", text: "Their mixture and savory snacks are just like the ones my grandmother used to make. Pure, authentic, and perfectly spiced. Pure magic!" }
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-primary/5 hover:translate-y-[-10px] transition-all border border-primary/5 relative group">
                                <span className="absolute top-8 right-8 text-8xl text-secondary/20 pointer-events-none group-hover:scale-110 transition-transform font-serif">“</span>
                                <p className="text-primary/70 font-sans font-medium mb-10 leading-relaxed text-lg relative z-10">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-secondary/20 overflow-hidden border-2 border-white shadow-lg shadow-primary/5 flex items-center justify-center font-serif font-black text-primary-dark italic text-xl">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-black text-primary-dark uppercase tracking-widest text-xs">{t.name}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us */}
            <AboutUs />

            {/* Corporate Enquiry */}
            <CorporateEnquiry />

            {/* Newsletter */}
            <Newsletter />

            <Footer />
        </main>
    );
}
