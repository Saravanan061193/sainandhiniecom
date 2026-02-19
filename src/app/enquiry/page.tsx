import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CorporateEnquiry from "@/components/CorporateEnquiry";

export default function EnquiryPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-10 px-4 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="bg-secondary/30 text-primary-dark px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
                        For Business & Events
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-primary-dark tracking-tighter mb-6">
                        Make it <span className="text-primary italic">Memorable</span>
                    </h1>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Whether it's a corporate gala or an intimate family gathering, we craft culinary experiences that leave a lasting impression.
                    </p>
                </div>

                <CorporateEnquiry />
            </div>

            <Footer />
        </main>
    );
}
