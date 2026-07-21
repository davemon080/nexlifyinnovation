import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Code, Palette, Sparkles, ArrowRight } from "lucide-react";
import { ViewType } from "../types";

interface HeroServiceShowcaseProps {
  setView: (v: ViewType) => void;
}

interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  viewTarget: ViewType;
}

export default function HeroServiceShowcase({ setView }: HeroServiceShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const services: ServiceCardData[] = [
    {
      id: "graphic-design",
      title: "Graphic Designing",
      description: "Stunning brand identities, marketing assets, and vector materials.",
      icon: Palette,
      accentColor: "text-purple-500",
      glowColor: "rgba(168, 85, 247, 0.35)",
      borderColor: "from-purple-500/40 via-pink-500/20 to-rose-500/40",
      viewTarget: "services",
    },
    {
      id: "web-dev",
      title: "Web Development",
      description: "High-performance architectures built with next-gen web technologies.",
      icon: Code,
      accentColor: "text-blue-500",
      glowColor: "rgba(59, 130, 246, 0.35)",
      borderColor: "from-blue-500/40 via-indigo-500/20 to-purple-500/40",
      viewTarget: "services",
    },
    {
      id: "content-writing",
      title: "Content Writing",
      description: "High-impact copy, SEO-optimized articles, and compelling brand stories.",
      icon: Sparkles,
      accentColor: "text-pink-500",
      glowColor: "rgba(236, 72, 153, 0.35)",
      borderColor: "from-pink-500/40 via-rose-500/20 to-amber-500/40",
      viewTarget: "services",
    },
  ];

  // 1. Auto-rotation timer: runs every 6 seconds, paused on hover
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovered, services.length]);

  // 2. 3D Tilt handler for the active card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    // Tilt capped at 5 degrees
    setTilt({
      x: -normY * 10, 
      y: normX * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // 3. Touch handlers for mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    
    if (Math.abs(diff) > 50) { // swipe threshold
      if (diff > 0) {
        // Swipe left -> next card
        setActiveIndex((prev) => (prev + 1) % services.length);
      } else {
        // Swipe right -> previous card
        setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
      }
    }
    touchStartRef.current = null;
  };

  // 4. Keyboard handlers for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % services.length);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[0.9] sm:aspect-[1.0] md:aspect-[0.9] lg:aspect-[0.95] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Nexlify interactive service cards showcase"
    >
      {/* 1. Dynamic Ambient Radial Glow behind the cards */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: `radial-gradient(circle, ${services[activeIndex].glowColor} 0%, rgba(0,0,0,0) 70%)`
          }}
          className="w-[110%] h-[110%] rounded-full filter blur-[50px] transition-all duration-1000"
        />
      </div>

      {/* 1b. Premium Purple Light shining from the bottom */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[85%] h-[140px] bg-purple-600/25 rounded-full filter blur-[50px] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-[70px] bg-fuchsia-500/20 rounded-full filter blur-[35px] pointer-events-none z-0 mix-blend-screen" />

      {/* 2. Three cards rendered in stack / 3D fan */}
      <div className="relative w-full h-full flex items-center justify-center">
        {services.map((service, index) => {
          const isActive = index === activeIndex;
          
          // Determine relative card position state
          // 0: active, 1: right (next), 2: left (prev)
          const diff = (index - activeIndex + services.length) % services.length;
          const isLeft = diff === 2;
          const isRight = diff === 1;

          // GPU-Accelerated Positioning Rules based on State
          let xValue = "0%";
          let yValue = "0px";
          let rotateYVal = 0;
          let rotateZVal = 0;
          let zIndexVal = 10;
          let scaleValue = 1;
          let opacityValue = 1;

          if (shouldReduceMotion) {
            // Simplified flat states for reduced motion
            if (isActive) {
              zIndexVal = 30;
              scaleValue = 1;
              opacityValue = 1;
            } else {
              zIndexVal = 10;
              scaleValue = 0.85;
              opacityValue = 0.3;
              xValue = isLeft ? "-40%" : "40%";
            }
          } else {
            // High fidelity 3D Fan configurations
            if (isActive) {
              xValue = "0%";
              yValue = "0px";
              rotateYVal = 0;
              rotateZVal = 0;
              zIndexVal = 30;
              scaleValue = 1.06;
              opacityValue = 1;
            } else if (isLeft) {
              xValue = "-32%";
              yValue = "32px";
              rotateYVal = 24; // fan rotated outward
              rotateZVal = -6; // slightly fanned left
              zIndexVal = 10;
              scaleValue = 0.86;
              opacityValue = 0.55;
            } else if (isRight) {
              xValue = "32%";
              yValue = "32px";
              rotateYVal = -24; // fan rotated outward
              rotateZVal = 6; // slightly fanned right
              zIndexVal = 10;
              scaleValue = 0.86;
              opacityValue = 0.55;
            }
          }

          const IconComponent = service.icon;

          return (
            <motion.div
              key={service.id}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => {
                if (!isActive) {
                  setActiveIndex(index);
                }
              }}
              // Master card coordinate and transform styles
              animate={{
                x: xValue,
                y: yValue,
                rotateY: isActive ? tilt.y : rotateYVal,
                rotateX: isActive ? tilt.x : 0,
                rotateZ: rotateZVal,
                scale: scaleValue,
                opacity: opacityValue,
                zIndex: zIndexVal,
              }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 20,
                mass: 1,
              }}
              // Hover effect for 3D card tilt & interaction pause
              onMouseMove={isActive ? handleMouseMove : undefined}
              onMouseLeave={isActive ? handleMouseLeave : undefined}
              className={`absolute w-[75%] sm:w-[62%] md:w-[70%] lg:w-[62%] aspect-[0.8] max-w-[420px] rounded-[32px] cursor-pointer transition-shadow duration-500 group focus-visible:ring-2 focus-visible:ring-brand-primary outline-none ${
                isActive 
                  ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]" 
                  : "shadow-lg hover:opacity-80"
              }`}
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Subtle infinite floating animation, offset for organic look */}
              <motion.div
                animate={shouldReduceMotion ? {} : {
                  y: [0, index === 0 ? -6 : index === 1 ? -4 : -5, 0],
                }}
                transition={{
                  duration: index === 0 ? 5.5 : index === 1 ? 6.2 : 5.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full relative rounded-[32px] overflow-hidden"
              >
                {/* 1. Dynamic Flowing Gradient Border for the Active Card */}
                {isActive && (
                  <div className="absolute -inset-[1.5px] rounded-[32px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-0" />
                )}
                {!isActive && (
                  <div className="absolute -inset-[1px] rounded-[32px] bg-white/5 z-0" />
                )}

                {/* 2. Card Body Panel (Authentic Glassmorphism) */}
                <div 
                  className={`relative w-full h-full rounded-[31.5px] p-6 sm:p-8 flex flex-col justify-between z-10 select-none overflow-hidden border border-white/5 ${
                    isActive 
                      ? "bg-zinc-950/80 backdrop-blur-[24px]" 
                      : "bg-zinc-900/50 backdrop-blur-[16px]"
                  }`}
                  style={{
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.12)",
                  }}
                >
                  {/* Backdrop glass glare reflect effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />

                  {/* Active Soft Corner Light Glow Accent */}
                  {isActive && (
                    <div 
                      className="absolute -top-12 -left-12 w-32 h-32 rounded-full blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-60" 
                      style={{ backgroundColor: service.glowColor }}
                    />
                  )}

                  {/* Card Content Elements */}
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      {/* Premium Circle Icon Frame */}
                      <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                        isActive 
                          ? "bg-white/5 border-white/10 text-white shadow-md shadow-black/30" 
                          : "bg-zinc-950/40 border-zinc-900 text-zinc-400"
                      }`}>
                        <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? service.accentColor : "text-zinc-400 group-hover:text-zinc-200"}`} />
                      </div>

                      {/* Tiny Active / Service Tag */}
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "text-brand-primary" : "text-zinc-500"}`}>
                        {isActive ? "FEATURED" : "NEXLIFY"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                        {service.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 transition-colors duration-300 ${
                        isActive ? "text-zinc-300" : "text-zinc-500"
                      }`}>
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Button row at bottom */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Explore Service
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView(service.viewTarget);
                      }}
                      className={`h-8 px-4 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                        isActive 
                          ? "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/25 scale-100 group-hover:scale-105 active:scale-95" 
                          : "bg-zinc-950/40 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-700"
                      }`}
                    >
                      <span className="hidden sm:inline">Go</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Tiny pagination indicators at bottom center */}
      <div className="absolute bottom-1 flex gap-2 z-20">
        {services.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex 
                ? "w-6 bg-brand-primary" 
                : "w-1.5 bg-zinc-800 hover:bg-zinc-600"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
