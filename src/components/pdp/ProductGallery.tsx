"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[], name: string }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setMousePos({ x, y });
    };

    const displayImages = images?.length > 0 ? images : ["https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1000"];

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 lg:sticky lg:top-32">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto no-scrollbar lg:max-h-[600px]">
                {displayImages.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${i === activeIndex ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-primary/5 opacity-60 hover:opacity-100"}`}
                    >
                        <img src={img} className="w-full h-full object-cover" alt={`${name} view ${i + 1}`} />
                    </button>
                ))}
            </div>

            {/* Main Stage */}
            <div className="relative flex-grow aspect-square bg-secondary/10 rounded-[3rem] overflow-hidden group border border-primary/5 shadow-inner cursor-zoom-in">
                <div
                    className="w-full h-full"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            src={displayImages[activeIndex]}
                            alt={name}
                            className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? "scale-[2.5]" : "scale-100"}`}
                            style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
                        />
                    </AnimatePresence>
                </div>

                {/* Overlays */}
                <div className="absolute top-8 left-8">
                    <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm flex items-center gap-2">
                        <Search size={14} className="text-primary-dark" />
                        <span className="text-[10px] font-sans font-black uppercase tracking-widest text-primary-dark">Hover to Zoom</span>
                    </div>
                </div>

                {/* Navigation */}
                {displayImages.length > 1 && (
                    <div className="absolute bottom-8 right-8 flex gap-2">
                        <button
                            onClick={() => setActiveIndex(prev => (prev - 1 + displayImages.length) % displayImages.length)}
                            className="w-12 h-12 bg-white/80 backdrop-blur-md text-primary-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setActiveIndex(prev => (prev + 1) % displayImages.length)}
                            className="w-12 h-12 bg-white/80 backdrop-blur-md text-primary-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
