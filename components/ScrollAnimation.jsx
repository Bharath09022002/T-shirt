"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { preloadImages, TOTAL_FRAMES } from "./FrameLoader";

export default function ScrollAnimation() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const imagesRef = useRef([]);
    const currentFrameRef = useRef(0);
    const rafRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Dynamic styles for scroll-based color transitions
    const [textColor, setTextColor] = useState("rgb(255, 255, 255)");
    const [bgColor, setBgColor] = useState("rgb(0, 0, 0)");
    const [subtextColor, setSubtextColor] = useState("rgba(255, 255, 255, 0.5)");

    // Scroll-driven spotlight
    const [spotlightOpacity, setSpotlightOpacity] = useState(0.6);

    // Draw a specific frame to canvas
    const drawFrame = useCallback((frameIndex, scrollProg = 0) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const img = imagesRef.current[frameIndex];
        if (!img) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);

        const isMobile = window.innerWidth < 768;
        // Make mobile scale much larger to fill the space
        const scaleFactor = isMobile ? 1.35 : 0.95;

        const imgAspect = img.width / img.height;
        const workspaceWidth = rect.width;
        const sectionAspect = workspaceWidth / rect.height;

        let drawWidth, drawHeight, drawX, drawY;

        if (imgAspect > sectionAspect) {
            drawWidth = workspaceWidth * scaleFactor;
            drawHeight = (workspaceWidth / imgAspect) * scaleFactor;
        } else {
            drawHeight = rect.height * scaleFactor;
            drawWidth = (rect.height * imgAspect) * scaleFactor;
        }

        if (isMobile) {
            drawX = (rect.width - drawWidth) / 2;
            // Push it slightly down so the larger product anchors nicely to the bottom
            drawY = (rect.height - drawHeight) * 0.8;
        } else {
            drawX = (rect.width - drawWidth) / 2;
            drawY = (rect.height - drawHeight) / 2;
        }

        // --- Spotlight / Radial glow behind product ---
        const glowX = drawX + drawWidth / 2;
        const glowY = drawY + drawHeight * (isMobile ? 0.55 : 0.45);
        const glowRadius = Math.max(drawWidth, drawHeight) * (isMobile ? 0.8 : 0.7);

        ctx.save();
        const spotGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
        const glowAlpha = (0.15 + scrollProg * 0.1).toFixed(3);
        spotGrad.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha})`);
        spotGrad.addColorStop(0.5, `rgba(200, 200, 200, ${(glowAlpha * 0.4).toFixed(3)})`);
        spotGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.restore();

        // --- Floating shadow ---
        const shadowX = drawX + drawWidth / 2;
        const shadowY = drawY + drawHeight * (isMobile ? 0.98 : 0.96);
        const shadowW = drawWidth * (isMobile ? 0.4 : 0.5);
        const shadowH = drawHeight * 0.05;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(shadowX, shadowY, shadowW / 2, shadowH / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.filter = "blur(25px)";
        ctx.fill();
        ctx.restore();

        // --- Draw product ---
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }, []);

    // Handle scroll
    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container || !imagesRef.current.length) return;

        const rect = container.getBoundingClientRect();
        const containerTop = rect.top;
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;

        const sp = Math.max(
            0,
            Math.min(1, -containerTop / (containerHeight - windowHeight))
        );

        setScrollProgress(sp);

        const frameIndex = Math.min(
            Math.floor(sp * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
        );

        if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex, sp));
        }

        // Color Transitions: black → dark grey → light grey → white
        const lightValue = Math.round(sp * 255);
        const darkValue = Math.round(255 - sp * 255);

        setBgColor(`rgb(${lightValue}, ${lightValue}, ${lightValue})`);
        setTextColor(`rgb(${darkValue}, ${darkValue}, ${darkValue})`);

        const opacity = 0.5 - sp * 0.15;
        setSubtextColor(`rgba(${darkValue}, ${darkValue}, ${darkValue}, ${opacity})`);

        // Spotlight
        setSpotlightOpacity(0.6 - sp * 0.3);
    }, [drawFrame]);

    // Preload
    useEffect(() => {
        let mounted = true;
        preloadImages((p) => {
            if (mounted) setProgress(p);
        }).then((images) => {
            if (!mounted) return;
            imagesRef.current = images;
            setLoading(false);
            drawFrame(0, 0);
        });
        return () => { mounted = false; };
    }, [drawFrame]);

    // Listeners
    useEffect(() => {
        if (loading) return;
        const onScroll = () => handleScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [loading, handleScroll]);

    // Resize
    useEffect(() => {
        if (loading) return;
        const onResize = () => drawFrame(currentFrameRef.current, scrollProgress);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [loading, drawFrame, scrollProgress]);

    // Checkmark icon
    const CheckIcon = () => (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-[2px]">
            <circle cx="8" cy="8" r="8" fill="currentColor" fillOpacity="0.15" />
            <path d="M5 8.5L7 10.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <div
            ref={containerRef}
            className="relative"
            style={{
                height: "500vh",
                backgroundColor: bgColor
            }}
        >
            {/* Sticky hero viewport */}
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden z-20">

                {/* Text Content — Top 45% mobile, Left 35% desktop */}
                <div className="w-full md:w-[35%] h-[45%] md:h-full relative flex flex-col justify-end md:justify-center items-center md:items-start px-5 md:px-0 md:pl-[clamp(2rem,5vw,5rem)] md:pr-8 z-30 pb-4 md:pb-0">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-lg">

                        {/* Eyebrow label */}
                        <div
                            className="hero-fade-in mb-4 md:mb-6"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <span
                                className="inline-block text-[10px] md:text-xs font-medium tracking-[0.25em] uppercase px-4 py-1.5 rounded-full border"
                                style={{
                                    color: subtextColor,
                                    borderColor: `rgba(${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, 0.15)`,
                                }}
                            >
                                New Collection
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="relative w-full">
                            <div className="overflow-hidden">
                                <h1
                                    className="hero-reveal-up font-sans text-3xl sm:text-5xl md:text-[clamp(2.8rem,4.5vw,5rem)] font-bold tracking-[-0.04em] leading-[1.05]"
                                    style={{ color: textColor }}
                                >
                                    Premium
                                </h1>
                            </div>
                            <div className="overflow-hidden">
                                <h1
                                    className="hero-reveal-up font-sans text-3xl sm:text-5xl md:text-[clamp(2.8rem,4.5vw,5rem)] font-bold tracking-[-0.04em] leading-[1.05]"
                                    style={{ color: textColor, animationDelay: "0.12s" }}
                                >
                                    Cotton Tee
                                </h1>
                            </div>
                        </div>

                        {/* Subtitle */}
                        <p
                            className="hero-fade-in mt-2 md:mt-6 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-sm"
                            style={{ color: subtextColor, animationDelay: "0.5s" }}
                        >
                            Engineered for comfort and everyday style.
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className="hero-fade-in mt-6 md:mt-10 w-full flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 md:gap-4 pointer-events-auto"
                            style={{ animationDelay: "0.7s" }}
                        >
                            <button
                                className="hero-btn-primary w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3.5 sm:py-3 md:py-3.5 rounded-full text-[11px] md:text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]"
                                style={{
                                    backgroundColor: textColor,
                                    color: bgColor,
                                }}
                            >
                                Shop Now
                            </button>
                            <button
                                className="hero-btn-secondary w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3.5 sm:py-3 md:py-3.5 rounded-full text-[11px] md:text-xs font-semibold uppercase tracking-[0.15em] border transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                                style={{
                                    borderColor: `rgba(${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, ${255 - scrollProgress * 255}, 0.3)`,
                                    color: textColor,
                                    backgroundColor: "transparent",
                                }}
                            >
                                Explore
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div
                            className="hero-fade-in mt-6 md:mt-10 flex flex-row md:flex-col flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 md:gap-2.5 w-full"
                            style={{ animationDelay: "0.9s" }}
                        >
                            {[
                                "100% Premium Cotton",
                                "Breathable Fabric",
                                "7-Day Easy Returns",
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1.5 md:gap-2.5 text-[10px] sm:text-xs md:text-sm font-light"
                                    style={{ color: subtextColor }}
                                >
                                    <CheckIcon />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scroll Indicator — bottom left */}
                    <div
                        className="hidden md:flex absolute bottom-8 left-[clamp(2rem,5vw,5rem)] flex-col items-start gap-3 transition-opacity duration-700 pointer-events-none"
                        style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
                    >
                        <span
                            className="text-[10px] tracking-[0.25em] uppercase font-medium"
                            style={{ color: subtextColor }}
                        >
                            Scroll
                        </span>
                        <div
                            className="w-[1px] h-10 overflow-hidden"
                            style={{ background: `linear-gradient(to bottom, ${textColor}, transparent)` }}
                        >
                            <div
                                className="w-full h-1/2 hero-scroll-line"
                                style={{ backgroundColor: textColor }}
                            />
                        </div>
                    </div>
                </div>

                {/* Product Animation — Bottom 55% mobile, Right 65% desktop */}
                <div className="w-full md:w-[65%] h-[55%] md:h-full relative flex items-center justify-center overflow-hidden">

                    {/* Radial spotlight backdrop */}
                    <div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                            background: `radial-gradient(ellipse 60% 70% at 50% 45%, rgba(255,255,255,${spotlightOpacity * 0.18}) 0%, transparent 70%)`,
                        }}
                    />

                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-contain pointer-events-none relative z-10"
                        style={{
                            opacity: loading ? 0 : 1,
                            transition: "opacity 1.2s ease-out",
                        }}
                    />
                </div>
            </div>

            {/* Loading Screen */}
            {loading && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
                    <div className="flex flex-col items-center gap-6">
                        {/* Brand text */}
                        <span className="text-white/30 text-xs tracking-[0.3em] uppercase font-medium">
                            Loading Experience
                        </span>
                        {/* Progress bar */}
                        <div className="w-40 h-[1px] bg-white/10 overflow-hidden rounded-full">
                            <div
                                className="h-full bg-white transition-all duration-300 ease-out rounded-full"
                                style={{ width: `${Math.round(progress * 100)}%` }}
                            />
                        </div>
                        {/* Percentage */}
                        <span className="text-white/20 text-[10px] tracking-widest font-mono">
                            {Math.round(progress * 100)}%
                        </span>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* --- Entry Animations --- */
                @keyframes heroRevealUp {
                    0% {
                        transform: translateY(110%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes heroFadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scrollLine {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }

                .hero-reveal-up {
                    animation: heroRevealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }

                .hero-fade-in {
                    animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }

                .hero-scroll-line {
                    animation: scrollLine 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                }

                /* Button hover glow */
                .hero-btn-primary:hover {
                    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.15);
                }

                .hero-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.05) !important;
                }
            `}</style>
        </div>
    );
}
