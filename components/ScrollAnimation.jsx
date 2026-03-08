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
    const [scrollHintOpacity, setScrollHintOpacity] = useState(1);

    // Dynamic styles for scroll-based color transitions
    const [textColor, setTextColor] = useState("rgb(255, 255, 255)");
    const [bgColor, setBgColor] = useState("rgb(0, 0, 0)");
    const [subtextColor, setSubtextColor] = useState("rgba(255, 255, 255, 0.4)");

    // Draw a specific frame to canvas
    const drawFrame = useCallback((frameIndex) => {
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
        const scaleFactor = isMobile ? 1.0 : 1.70;
        const imgAspect = img.width / img.height;

        // On mobile, use full canvas width for workspace; on desktop, use the 60% side
        const workspaceWidth = isMobile ? rect.width : rect.width * 0.6;
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
            // Center horizontally on mobile
            drawX = (rect.width - drawWidth) / 2;
            // Shift up slightly on mobile to make room for text below
            drawY = (rect.height * 0.45 - drawHeight / 2);
        } else {
            // Desktop: Move into the right section by 470px for editorial proximity
            const leftSectionWidth = rect.width * 0.6;
            drawX = (leftSectionWidth - drawWidth) + 470;
            drawY = (rect.height - drawHeight) / 2;
        }

        // Perfectly Aligned floating shadow
        const shadowX = drawX + drawWidth / 2;
        const shadowY = drawY + drawHeight * 0.95;
        const shadowW = drawWidth * 0.6;
        const shadowH = drawHeight * 0.08;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(shadowX, shadowY, shadowW / 2, shadowH / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.filter = "blur(30px)";
        ctx.fill();
        ctx.restore();

        // Draw Product
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

        const scrollProgress = Math.max(
            0,
            Math.min(1, -containerTop / (containerHeight - windowHeight))
        );

        const frameIndex = Math.min(
            Math.floor(scrollProgress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
        );

        if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
        }

        // Color Transitions (White -> Gray -> Black)
        // Background: 0 -> 255
        // Text: 255 -> 0
        const lightValue = Math.round(scrollProgress * 255);
        const darkValue = Math.round(255 - scrollProgress * 255);

        setBgColor(`rgb(${lightValue}, ${lightValue}, ${lightValue})`);
        setTextColor(`rgb(${darkValue}, ${darkValue}, ${darkValue})`);

        // Subtext gets more subtle
        const opacity = 0.4 - scrollProgress * 0.1;
        setSubtextColor(`rgba(${darkValue}, ${darkValue}, ${darkValue}, ${opacity})`);

        // Scroll hint disappears
        setScrollHintOpacity(scrollProgress < 0.05 ? 1 : 0);
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
            drawFrame(0);
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
        const onResize = () => drawFrame(currentFrameRef.current);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [loading, drawFrame]);

    return (
        <div
            ref={containerRef}
            className="relative"
            style={{
                height: "500vh",
                backgroundColor: bgColor
            }}
        >
            {/* Responsive Container: flex-col on mobile, flex-row on desktop */}
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden z-20">

                {/* Animation Section: Top on mobile (60%), Left on desktop (60%) */}
                <div className="w-full md:w-[60%] h-[60%] md:h-full relative flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-contain pointer-events-none"
                        style={{
                            opacity: loading ? 0 : 1,
                            transition: "opacity 1.2s ease-out",
                        }}
                    />
                </div>

                {/* Content Section: Bottom on mobile (40%), Right on desktop (40%) */}
                <div className="w-full md:w-[40%] h-[40%] md:h-full relative flex flex-col justify-center items-center md:items-start px-6 md:pl-[90px] md:pr-[5vw] z-30">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">

                        {/* Overlapping Typography Headline */}
                        <div className="relative group scale-75 sm:scale-90 md:scale-100">
                            <div className="overflow-hidden">
                                <h1
                                    className="font-display text-6xl md:text-7xl lg:text-[110px] font-black tracking-[-0.05em] leading-[0.8] uppercase animate-reveal-up"
                                    style={{ color: textColor }}
                                >
                                    PREMIUM
                                </h1>
                            </div>
                            <div className="overflow-hidden mt-[-0.15em] ml-[0.3em]">
                                <h1
                                    className="font-display text-6xl md:text-7xl lg:text-[110px] font-black tracking-[-0.05em] leading-[0.8] uppercase animate-reveal-up-delayed relative z-10"
                                    style={{ color: textColor }}
                                >
                                    COTTON
                                </h1>
                            </div>
                            <div className="overflow-hidden mt-[-0.1em]">
                                <h1
                                    className="font-display text-5xl md:text-6xl lg:text-[90px] font-black tracking-[-0.05em] leading-[0.8] uppercase animate-reveal-up-double-delayed"
                                    style={{ color: textColor }}
                                >
                                    T-SHIRT
                                </h1>
                            </div>
                        </div>

                        {/* Subtitle */}
                        <p
                            className="mt-6 md:mt-10 text-xs md:text-base lg:text-lg font-light tracking-[0.2em] md:tracking-[0.3em] uppercase animate-fade-in-long"
                            style={{ color: subtextColor }}
                        >
                            Designed for Comfort & Style
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center gap-4 md:gap-6 pointer-events-auto animate-fade-in-long w-full sm:w-auto">
                            <button
                                className="w-full sm:w-auto px-10 md:px-12 py-3 md:py-4 rounded-full font-display text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl"
                                style={{
                                    backgroundColor: textColor,
                                    color: bgColor
                                }}
                            >
                                Shop Now
                            </button>
                            <button
                                className="w-full sm:w-auto px-10 md:px-12 py-3 md:py-4 border rounded-full font-display text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all hover:opacity-70 active:scale-95"
                                style={{
                                    borderColor: textColor,
                                    color: textColor
                                }}
                            >
                                Explore Collection
                            </button>
                        </div>
                    </div>

                    {/* Minimal Scroll Indicator */}
                    <div
                        className="absolute bottom-[8vh] left-[5vw] transition-opacity duration-700 pointer-events-none"
                        style={{ opacity: scrollHintOpacity }}
                    >
                        <div className="flex flex-col items-start gap-4">
                            <span
                                className="text-[10px] tracking-[0.3em] uppercase font-medium"
                                style={{ color: subtextColor }}
                            >
                                Scroll
                            </span>
                            <div
                                className="w-[1px] h-12 overflow-hidden"
                                style={{ background: `linear-gradient(to bottom, ${textColor}, transparent)` }}
                            >
                                <div
                                    className="w-full h-1/2 animate-scroll-line"
                                    style={{ backgroundColor: textColor }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading screen */}
            {loading && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
                    <div className="w-32 h-[1px] bg-white/10 overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300 ease-out"
                            style={{ width: `${Math.round(progress * 100)}%` }}
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes reveal-up {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(0); }
                }
                @keyframes scroll-line {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-reveal-up {
                    animation: reveal-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-reveal-up-delayed {
                    animation: reveal-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
                }
                .animate-reveal-up-double-delayed {
                    animation: reveal-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
                }
                .animate-fade-in-long {
                    animation: fadeIn 2.5s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
                    opacity: 0;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-scroll-line {
                    animation: scroll-line 3s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                }
            `}</style>
        </div>
    );
}
