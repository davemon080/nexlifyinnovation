import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code, 
  Palette, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Check, 
  HelpCircle, 
  Zap, 
  Layers, 
  Calendar, 
  Shield 
} from "lucide-react";
import { getServices } from "../lib/db";
import { SERVICES } from "../data";
import { Service, ViewType } from "../types";

interface ServicesViewProps {
  setView: (v: ViewType) => void;
}

export default function ServicesView({ setView }: ServicesViewProps) {
  const [servicesList, setServicesList] = useState<Service[]>(SERVICES);
  const [activeTab, setActiveTab] = useState<string>("web-dev");
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const list = await getServices();
        // Strict filter to only include exactly the 3 requested services to ensure clean visual focus
        const filtered = list.filter(s => ["web-dev", "graphic-design", "content-writing"].includes(s.id));
        if (filtered.length > 0) {
          setServicesList(filtered);
        } else {
          setServicesList(SERVICES);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setServicesList(SERVICES);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case "Code": return Code;
      case "Palette": return Palette;
      case "Sparkles": return Sparkles;
      default: return Code;
    }
  };

  const selectedService = servicesList.find(s => s.id === activeTab) || servicesList[0];
  const ActiveIcon = selectedService ? getIcon(selectedService.icon) : Code;

  // Custom accent colors based on service variant
  const getAccentColor = (id: string) => {
    switch (id) {
      case "web-dev":
        return {
          text: "text-brand-primary",
          bg: "bg-brand-primary/10",
          border: "border-brand-primary/20",
          hoverBorder: "hover:border-brand-primary/40",
          glow: "from-brand-primary/20 via-transparent to-transparent",
          accentLine: "bg-brand-primary"
        };
      case "graphic-design":
        return {
          text: "text-brand-secondary",
          bg: "bg-brand-secondary/10",
          border: "border-brand-secondary/20",
          hoverBorder: "hover:border-brand-secondary/40",
          glow: "from-brand-secondary/20 via-transparent to-transparent",
          accentLine: "bg-brand-secondary"
        };
      case "content-writing":
        return {
          text: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          hoverBorder: "hover:border-amber-500/40",
          glow: "from-amber-500/20 via-transparent to-transparent",
          accentLine: "bg-amber-500"
        };
      default:
        return {
          text: "text-brand-primary",
          bg: "bg-brand-primary/10",
          border: "border-brand-primary/20",
          hoverBorder: "hover:border-brand-primary/40",
          glow: "from-brand-primary/20 via-transparent to-transparent",
          accentLine: "bg-brand-primary"
        };
    }
  };

  return (
    <div className="pt-24 sm:pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-16" id="services-view-container">
      
      {/* Top Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-850 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Our Pillars of Excellence</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
          What We <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Perfect</span>.
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
          We intentionally limit our agency scope to exactly three core digital pillars, guaranteeing absolute mastery, pristine code execution, and stunning layouts.
        </p>
      </div>

      {/* Grid of the Exactly Three Main Core Services (Sleek cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {servicesList.map((service, idx) => {
          const IconComponent = getIcon(service.icon);
          const accent = getAccentColor(service.id);
          const isSelected = activeTab === service.id;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              onClick={() => {
                setActiveTab(service.id);
                setExpandedFaqIdx(0);
              }}
              className={`group relative p-6 bg-zinc-950/40 border transition-all duration-300 cursor-pointer overflow-hidden rounded-none flex flex-col justify-between h-[280px] ${
                isSelected 
                  ? `${accent.border} bg-zinc-950 shadow-xl shadow-brand-primary/5 border-l-2 border-l-brand-primary` 
                  : `border-zinc-900 hover:border-zinc-800`
              }`}
            >
              {/* Radial gradient background accent on active */}
              {isSelected && (
                <div className={`absolute -top-12 -left-12 w-32 h-32 bg-gradient-to-br ${accent.glow} rounded-full blur-2xl pointer-events-none opacity-60`} />
              )}

              {/* Accent top-border color */}
              <div className={`absolute top-0 left-0 w-full h-[2px] transition-transform origin-left scale-x-0 group-hover:scale-x-100 ${accent.accentLine}`} />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  {/* Icon Frame */}
                  <div className={`w-12 h-12 flex items-center justify-center border transition-all ${
                    isSelected ? `${accent.border} ${accent.bg} ${accent.text}` : `border-zinc-900 bg-zinc-900/40 text-zinc-400 group-hover:text-white group-hover:border-zinc-700`
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Tiny sector tag */}
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    {service.id === "web-dev" ? "Engineering" : service.id === "graphic-design" ? "Visual Arts" : "Narratives"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-base sm:text-lg font-extrabold tracking-tight transition-colors ${
                    isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"
                  }`}>
                    {service.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Action row at bottom */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60 mt-auto relative z-10">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-600" /> {service.timeline} Delivery
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
                  isSelected ? accent.text : "text-zinc-500 group-hover:text-zinc-300"
                }`}>
                  <span>Specs</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Spec Sheet Area */}
      {selectedService && (
        <div className="border border-zinc-900 bg-zinc-950/30 p-6 sm:p-10 rounded-none relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12 relative z-10"
            >
              {/* Specification Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center border ${getAccentColor(selectedService.id).bg} ${getAccentColor(selectedService.id).border} ${getAccentColor(selectedService.id).text}`}>
                    <ActiveIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Active Specification Sheet</span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{selectedService.title} Detailed Focus</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-900 text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                  <span>Guaranteed delivery: {selectedService.timeline}</span>
                </div>
              </div>

              {/* Main Content Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Side (7 columns): Detailed description & Deliverables checklist */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Detailed paragraph */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.25em]">Strategic Focus</span>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-medium">
                      {selectedService.longDescription}
                    </p>
                  </div>

                  {/* What you get / Deliverables Checklist */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-white uppercase tracking-wider block border-b border-zinc-900 pb-2">
                      Core Deliverables & Features
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedService.features.map((feat, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                          <span className="text-zinc-300 text-xs font-semibold leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Benefits */}
                  <div className="space-y-4 pt-4 border-t border-zinc-900/60">
                    <span className="text-[10px] font-extrabold text-white uppercase tracking-wider block">
                      Strategic Advantages & Outcomes
                    </span>
                    <div className="space-y-3">
                      {selectedService.benefits.map((ben, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="p-0.5 rounded-full bg-brand-primary/10 text-brand-primary mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-zinc-400 text-xs leading-relaxed font-medium">{ben}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Side (5 columns): Tech Stack badges, FAQ dropdowns, direct CTA */}
                <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-zinc-900 lg:pl-10">
                  
                  {/* Tech stack box */}
                  <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-none space-y-3">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                      {selectedService.id === "web-dev" ? "Technologies & Engine Stacks" : selectedService.id === "graphic-design" ? "Professional Creative Tools" : "Methodologies & Strategy"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedService.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-2.5 py-1 text-[10px] font-bold bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* FAQs list specific to service */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                      Service FAQ Clarifications
                    </span>
                    
                    <div className="space-y-2">
                      {selectedService.faq.map((faq, idx) => {
                        const isOpen = expandedFaqIdx === idx;
                        return (
                          <div key={idx} className="border border-zinc-900 bg-zinc-950/40">
                            <button
                              type="button"
                              onClick={() => setExpandedFaqIdx(isOpen ? null : idx)}
                              className="w-full p-3.5 flex justify-between items-center text-left hover:bg-zinc-900/20 transition-colors"
                            >
                              <span className="text-white font-bold text-xs pr-4">{faq.q}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${isOpen ? "rotate-180 text-brand-primary" : ""}`} />
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <p className="px-3.5 pb-3.5 text-zinc-400 text-xs leading-relaxed pt-1.5 border-t border-zinc-900/40">
                                    {faq.a}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inline micro-CTA connecting directly to Contact page */}
                  <div className="pt-4 border-t border-zinc-900/60">
                    <button
                      onClick={() => setView("contact")}
                      className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-brand-primary/10 cursor-pointer"
                    >
                      <span>Inquire about {selectedService.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Elegant Trust / Capability Banner */}
      <section className="bg-zinc-950/20 border border-zinc-900 p-8 sm:p-12 rounded-none max-w-7xl mx-auto shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-8 space-y-4">
            <span className="text-brand-primary font-bold text-[9px] uppercase tracking-[0.25em] block">Our Promise</span>
            <h3 className="text-white font-extrabold text-xl sm:text-2xl tracking-tight">Need a custom enterprise project scope built?</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              We collaborate with you through meticulous wireframes, custom prototype designs, and rapid software testing intervals. Schedule a free diagnostic call with our team.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button
              onClick={() => setView("contact")}
              className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-brand-primary/40 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-none w-full md:w-auto text-center cursor-pointer"
            >
              Start Your Inquiry
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
