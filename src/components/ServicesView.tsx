import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code, 
  Palette, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  ChevronDown, 
  Check, 
  Zap
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { getServices } from "../lib/db";
import { SERVICES } from "../data";
import { Service, ViewType } from "../types";

interface ServicesViewProps {
  setView: (v: ViewType) => void;
  initialServiceId?: string | null;
}

export default function ServicesView({ setView, initialServiceId }: ServicesViewProps) {
  const [servicesList, setServicesList] = useState<Service[]>(SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initialServiceId || null);
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(0);

  useEffect(() => {
    async function load() {
      try {
        const list = await getServices();
        if (list && list.length > 0) {
          setServicesList(list);
        } else {
          setServicesList(SERVICES);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setServicesList(SERVICES);
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

  const selectedService = servicesList.find(s => s.id === selectedServiceId);

  return (
    <div className="pt-24 sm:pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto" id="services-view-container">
      <AnimatePresence mode="wait">
        {!selectedService ? (
          /* ALL SERVICES LISTING PAGE */
          <motion.div
            key="services-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-16"
          >
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
                Select any of our core digital pillars below to open its dedicated details page, featuring full deliverables, technology stacks, and FAQs.
              </p>
            </div>

            {/* Grid of Core Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {servicesList.map((service, idx) => {
                const IconComponent = getIcon(service.icon);
                const accent = getAccentColor(service.id);

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setExpandedFaqIdx(0);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`group relative p-6 bg-zinc-950/60 border border-zinc-900 ${accent.hoverBorder} hover:bg-zinc-900/40 transition-all duration-300 cursor-pointer overflow-hidden rounded-none flex flex-col justify-between h-[300px] shadow-xl`}
                  >
                    {/* Top hover accent bar */}
                    <div className={`absolute top-0 left-0 w-full h-[2px] transition-transform origin-left scale-x-0 group-hover:scale-x-100 ${accent.accentLine}`} />

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 flex items-center justify-center border transition-all ${accent.border} ${accent.bg} ${accent.text}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          {service.id === "web-dev" ? "Engineering" : service.id === "graphic-design" ? "Visual Arts" : "Narratives"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-extrabold text-white tracking-tight group-hover:text-brand-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-900 relative z-10 mt-auto">
                      <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-600" /> {service.timeline} Delivery
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 group-hover:translate-x-1 transition-transform ${accent.text}`}>
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Banner */}
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
          </motion.div>
        ) : (
          /* DEDICATED SERVICE DETAILS PAGE */
          <motion.div
            key="service-detail-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-12"
          >
            <Helmet>
              <title>{`${selectedService.title} Details | Nexlify Services`}</title>
              <meta name="description" content={selectedService.description} />
            </Helmet>

            {/* Navigation Header Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-6">
              <button
                onClick={() => setSelectedServiceId(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-850 border border-zinc-800 text-xs font-bold transition-all cursor-pointer shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" /> Back to All Services
              </button>

              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-850 text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                <span>Dedicated Spec Sheet</span>
              </div>
            </div>

            {/* Service Banner Header */}
            <div className="relative border border-zinc-900 bg-zinc-950 p-6 sm:p-10 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
                    <span>{selectedService.id === "web-dev" ? "Software Engineering" : selectedService.id === "graphic-design" ? "Creative Visual Design" : "Content Strategy"}</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{selectedService.title}</h1>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
                    {selectedService.description}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-none shrink-0 space-y-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Guaranteed Delivery</span>
                  <span className="text-white font-extrabold text-sm sm:text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-primary" /> {selectedService.timeline}
                  </span>
                </div>
              </div>

              {/* Service Hero Image preview if available */}
              {selectedService.image && (
                <div className="mt-8 relative aspect-[21/9] sm:h-[300px] w-full border border-zinc-900 overflow-hidden bg-zinc-900">
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                </div>
              )}
            </div>

            {/* Main Details Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column (7 cols): Strategic Focus, Deliverables & Benefits */}
              <div className="lg:col-span-7 space-y-10">
                
                {/* Strategic Focus */}
                <div className="space-y-3 p-6 bg-zinc-950/40 border border-zinc-900">
                  <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.25em] block">
                    Strategic Focus & Execution
                  </span>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-medium">
                    {selectedService.longDescription || selectedService.description}
                  </p>
                </div>

                {/* Core Deliverables & Features */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider block border-b border-zinc-900 pb-3">
                    Core Deliverables & Specification
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedService.features.map((feat, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 bg-zinc-950/60 border border-zinc-900">
                        <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                        <span className="text-zinc-300 text-xs font-semibold leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits / Strategic Advantages */}
                {selectedService.benefits && selectedService.benefits.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-zinc-900">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider block">
                      Strategic Business Advantages
                    </h3>
                    <div className="space-y-3">
                      {selectedService.benefits.map((ben, i) => (
                        <div key={i} className="flex gap-3 items-start p-3 bg-zinc-950/40 border border-zinc-900/60">
                          <div className="p-1 rounded bg-brand-primary/10 text-brand-primary shrink-0">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-zinc-400 text-xs leading-relaxed font-medium">{ben}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column (5 cols): Tech Stack, FAQs & Consultation Action */}
              <div className="lg:col-span-5 space-y-8 lg:border-l lg:border-zinc-900 lg:pl-10">
                
                {/* Tech & Engine Stack */}
                {selectedService.technologies && selectedService.technologies.length > 0 && (
                  <div className="p-6 bg-zinc-950 border border-zinc-900 space-y-3">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                      Technologies & Workflows
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-3 py-1.5 text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs Section */}
                {selectedService.faq && selectedService.faq.length > 0 && (
                  <div className="space-y-4">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                      Service FAQs & Clarifications
                    </span>
                    <div className="space-y-2">
                      {selectedService.faq.map((faq, idx) => {
                        const isOpen = expandedFaqIdx === idx;
                        return (
                          <div key={idx} className="border border-zinc-900 bg-zinc-950/60">
                            <button
                              type="button"
                              onClick={() => setExpandedFaqIdx(isOpen ? null : idx)}
                              className="w-full p-4 flex justify-between items-center text-left hover:bg-zinc-900/40 transition-colors"
                            >
                              <span className="text-white font-bold text-xs pr-4">{faq.q}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${isOpen ? "rotate-180 text-brand-primary" : ""}`} />
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <p className="px-4 pb-4 text-zinc-400 text-xs leading-relaxed pt-2 border-t border-zinc-900/60">
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
                )}

                {/* Direct Booking CTA */}
                <div className="p-6 bg-gradient-to-br from-zinc-950 via-zinc-950 to-brand-primary/10 border border-brand-primary/30 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Ready to build?</h4>
                    <p className="text-zinc-400 text-xs">Consult with our engineering team directly regarding your {selectedService.title} project.</p>
                  </div>
                  <button
                    onClick={() => setView("book-consultation")}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 cursor-pointer"
                  >
                    <span>Inquire About {selectedService.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom Back Button */}
            <div className="pt-8 border-t border-zinc-900 flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedServiceId(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-850 border border-zinc-800 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Return to All Services
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
