"use client";

import { useEffect, useRef, useState } from "react";

/* ────────────────── Intersection Observer Hook ────────────────── */
function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(el);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 1 — Product Features
   ═══════════════════════════════════════════════════════════════════ */

const features = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        title: "Breathable Fabric",
        description: "Engineered with micro-ventilation for all-day airflow and thermoregulation.",
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
        ),
        title: "Premium Stitching",
        description: "Double-needle hems and reinforced seams for exceptional longevity.",
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
        ),
        title: "Lightweight Comfort",
        description: "Ultra-light 180gsm fabric that moves with you, never against you.",
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: "Built to Last",
        description: "Pre-shrunk, color-locked fabric that maintains its form wash after wash.",
    },
];

function ProductFeatures() {
    const [ref, inView] = useInView(0.1);

    return (
        <section ref={ref} className="py-24 md:py-32 px-6 bg-white" id="features">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className={`text-center mb-16 md:mb-20 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                    <span className="text-xs font-medium tracking-[0.4em] uppercase text-brand-400 mb-4 block">
                        THE ÉLEV PHILOSOPHY
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-brand-900 tracking-tighter uppercase">
                        METICULOUSLY
                        <span className="text-gradient"> CRAFTED</span>
                    </h2>
                    <p className="mt-6 text-lg text-brand-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Every thread is a testament to our pursuit of perfection, creating a garment that transcends the ephemeral.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={feature.title}
                            className={`group p-8 rounded-2xl glass-card hover:shadow-xl hover:shadow-brand-900/5 
                         hover:-translate-y-2 transition-all duration-500 cursor-default
                         ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                            style={{
                                transitionDelay: inView ? `${i * 150}ms` : "0ms",
                            }}
                        >
                            <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center
                            text-brand-700 group-hover:bg-brand-900 group-hover:text-white
                            transition-all duration-500 mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="font-display text-lg font-semibold text-brand-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-brand-400 leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 2 — Fabric Quality
   ═══════════════════════════════════════════════════════════════════ */

function FabricQuality() {
    const [ref, inView] = useInView(0.15);

    return (
        <section ref={ref} className="py-24 md:py-32 px-6 bg-brand-50" id="fabric">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                    {/* Left — Text */}
                    <div className={`transition-all duration-1000 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
                        <span className="text-xs font-medium tracking-[0.3em] uppercase text-brand-400 mb-4 block">
                            Material
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-900 tracking-tight mb-6">
                            100% Egyptian
                            <br />
                            <span className="text-gradient">Supima Cotton</span>
                        </h2>
                        <p className="text-brand-500 leading-relaxed mb-6 font-light text-lg">
                            Sourced from the Nile Delta, our long-staple cotton delivers an unmatched
                            softness against your skin. Each fiber is carefully combed to remove
                            impurities, resulting in a smooth, luxurious hand-feel that only improves
                            with every wash.
                        </p>
                        <p className="text-brand-400 leading-relaxed font-light">
                            The 180gsm weight strikes the perfect balance — substantial enough to drape
                            elegantly, yet light enough for year-round comfort. Pre-washed to eliminate
                            shrinkage and ensure a consistent fit from day one.
                        </p>

                        {/* Stats */}
                        <div className="flex gap-10 mt-10">
                            {[
                                { value: "180", unit: "gsm", label: "Weight" },
                                { value: "100%", unit: "", label: "Cotton" },
                                { value: "60+", unit: "", label: "Colors" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="font-display text-3xl font-bold text-brand-900">
                                        {stat.value}
                                        <span className="text-sm text-brand-400 ml-0.5">{stat.unit}</span>
                                    </div>
                                    <div className="text-xs text-brand-400 tracking-wider uppercase mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Image */}
                    <div className={`transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-brand-900/10">
                            <img
                                src="/frames/ezgif-frame-050.jpg"
                                alt="Premium cotton fabric close-up"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 3 — Collar / Style Collection
   ═══════════════════════════════════════════════════════════════════ */

const styles = [
    {
        name: "Classic Round Neck",
        description: "Timeless silhouette for everyday elegance",
        frameIndex: 1,
    },
    {
        name: "Polo Collar",
        description: "Structured collar for a refined, versatile look",
        frameIndex: 60,
    },
    {
        name: "Oversized Fit",
        description: "Relaxed drape for contemporary streetwear style",
        frameIndex: 120,
    },
    {
        name: "Athletic Fit",
        description: "Contoured cut for active performance",
        frameIndex: 180,
    },
];

function CollarStyles() {
    const [ref, inView] = useInView(0.1);

    return (
        <section ref={ref} className="py-24 md:py-32 px-6 bg-white" id="styles">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className={`text-center mb-16 md:mb-20 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                    <span className="text-xs font-medium tracking-[0.4em] uppercase text-brand-400 mb-4 block">
                        THE CURATION
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-brand-900 tracking-tighter uppercase">
                        SIGNATURE
                        <span className="text-gradient"> SILHOUETTES</span>
                    </h2>
                    <p className="mt-6 text-lg text-brand-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Four distinct expressions of modern luxury, each tailored to a different dimension of your lifestyle.
                    </p>
                </div>

                {/* Style cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {styles.map((style, i) => (
                        <div
                            key={style.name}
                            className={`group cursor-pointer transition-all duration-700
                         ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
                            style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4
                            shadow-lg shadow-brand-900/5 group-hover:shadow-2xl 
                            group-hover:shadow-brand-900/15 transition-shadow duration-500">
                                <img
                                    src={`/frames/ezgif-frame-${String(style.frameIndex).padStart(3, "0")}.jpg`}
                                    alt={style.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100
                              translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <span className="text-white text-sm font-light tracking-wider">
                                        Explore →
                                    </span>
                                </div>
                            </div>
                            <h3 className="font-display text-lg font-semibold text-brand-900 group-hover:text-brand-700 transition-colors">
                                {style.name}
                            </h3>
                            <p className="text-sm text-brand-400 font-light mt-1">
                                {style.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 4 — Buy / CTA Section
   ═══════════════════════════════════════════════════════════════════ */

const colors = [
    { name: "Obsidian", value: "#171717" },
    { name: "Marble", value: "#F5F5F5" },
    { name: "Storm", value: "#64748b" },
    { name: "Navy", value: "#1e3a5f" },
    { name: "Olive", value: "#4a5a3c" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

function BuySection() {
    const [ref, inView] = useInView(0.15);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState(2); // M default

    return (
        <section ref={ref} className="py-24 md:py-32 px-6 bg-brand-50" id="buy">
            <div className="max-w-4xl mx-auto">
                <div className={`text-center transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                    {/* Product image */}
                    <div className="w-64 h-64 md:w-80 md:h-80 mx-auto mb-10 relative">
                        <img
                            src="/frames/ezgif-frame-001.jpg"
                            alt="Premium Cotton T-Shirt"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            loading="lazy"
                        />
                    </div>

                    <span className="text-xs font-medium tracking-[0.3em] uppercase text-brand-400 block mb-2">
                        ÉLEV Essentials
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-900 tracking-tight">
                        Premium Cotton T-Shirt
                    </h2>
                    <div className="mt-3 flex items-center justify-center gap-3">
                        <span className="font-display text-3xl font-bold text-brand-900">$89</span>
                        <span className="text-sm text-brand-400 line-through">$129</span>
                        <span className="text-xs px-2 py-1 bg-brand-900 text-white rounded-full font-medium">
                            SAVE 31%
                        </span>
                    </div>

                    {/* Color Selector */}
                    <div className={`mt-10 transition-all duration-1000 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <span className="text-xs text-brand-400 tracking-widest uppercase block mb-4">
                            Color — {colors[selectedColor].name}
                        </span>
                        <div className="flex items-center justify-center gap-3">
                            {colors.map((color, i) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(i)}
                                    className={`w-10 h-10 rounded-full transition-all duration-300 
                            hover:scale-110 active:scale-95
                            ${selectedColor === i
                                            ? "ring-2 ring-offset-4 ring-brand-900"
                                            : "ring-1 ring-brand-200 hover:ring-brand-400"
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    aria-label={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div className={`mt-8 transition-all duration-1000 delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <span className="text-xs text-brand-400 tracking-widest uppercase block mb-4">
                            Size — {sizes[selectedSize]}
                        </span>
                        <div className="flex items-center justify-center gap-2">
                            {sizes.map((size, i) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(i)}
                                    className={`w-12 h-12 rounded-xl font-medium text-sm transition-all duration-300 
                            hover:scale-105 active:scale-95
                            ${selectedSize === i
                                            ? "bg-brand-900 text-white shadow-lg shadow-brand-900/25"
                                            : "bg-white text-brand-600 border border-brand-200 hover:border-brand-400"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Buy Button */}
                    <div className={`mt-10 transition-all duration-1000 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <button
                            className="group relative px-16 py-4 bg-brand-900 text-white rounded-full font-display
                       font-semibold text-lg tracking-wide overflow-hidden
                       hover:shadow-2xl hover:shadow-brand-900/30 transition-all duration-500
                       hover:scale-105 active:scale-[0.98]"
                        >
                            <span className="relative z-10">Buy Now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </button>
                        <p className="text-xs text-brand-400 mt-4 font-light">
                            Free shipping · 30-day returns · Lifetime warranty
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 5 — Footer
   ═══════════════════════════════════════════════════════════════════ */

function Footer() {
    return (
        <footer className="py-16 px-6 bg-brand-900 text-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <span className="font-display text-2xl font-bold tracking-tight">ÉLEV</span>
                        <p className="text-brand-400 text-sm mt-2 font-light">
                            Premium essentials, elevated.
                        </p>
                    </div>
                    <div className="flex gap-8">
                        {["Shop", "About", "Sustainability", "Contact"].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-sm text-brand-400 hover:text-white transition-colors duration-300 font-light"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="border-t border-brand-800 mt-10 pt-8 text-center">
                    <p className="text-xs text-brand-500 font-light">
                        © 2026 ÉLEV. All rights reserved. Designed with precision.
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════ */

export default function ProductSections() {
    return (
        <>
            <ProductFeatures />
            <FabricQuality />
            <CollarStyles />
            <BuySection />
            <Footer />
        </>
    );
}
