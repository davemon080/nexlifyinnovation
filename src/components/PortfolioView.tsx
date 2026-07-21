import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Clock, Code, LayoutGrid, CheckCircle2, MessageSquare, ExternalLink, Search, X, Monitor, Palette } from "lucide-react";
import { getProjects } from "../lib/db";
import { Project } from "../types";
import GraphicDesignViewer from "./GraphicDesignViewer";
import { Helmet } from "react-helmet-async";

// Progressive Lazy Loaded Image Component with subtle fade-in transition
function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
      {!loaded && <div className="absolute inset-0 bg-zinc-950 animate-pulse" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

// Skeleton loading layout that matches actual card layout structure exactly
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10" id="portfolio-skeletons">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col h-full rounded-none">
          <div className="aspect-[4/3] bg-zinc-900/80 rounded-none w-full mb-4" />
          <div className="h-4 bg-zinc-800 rounded-none w-3/4 mb-2.5" />
          <div className="h-3 bg-zinc-900 rounded-none w-full mb-1.5" />
          <div className="h-3 bg-zinc-900 rounded-none w-5/6 mb-4" />
          <div className="mt-auto pt-2 border-t border-zinc-900/60 flex items-center">
            <div className="flex gap-1">
              <div className="h-3.5 bg-zinc-900 rounded-none w-10" />
              <div className="h-3.5 bg-zinc-900 rounded-none w-12" />
              <div className="h-3.5 bg-zinc-900 rounded-none w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PortfolioView() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const prjs = await getProjects();
        setProjectsList(prjs);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["All", "Websites", "Graphic Designs"];

  const normalizedProjects = (projectsList || []).map(p => {
    let cat = p.category;
    if (cat === "Web Development" || cat === "Web Platform" || cat === "Software") {
      cat = "Websites";
    } else if (cat === "Brand Identity" || cat === "Mobile Apps" || cat === "Mobile App" || cat === "Corporate Solution") {
      cat = "Graphic Designs";
    }
    // Safeguard to only allow Websites and Graphic Designs
    if (cat !== "Websites" && cat !== "Graphic Designs") {
      cat = "Websites"; // default fallback
    }
    return { ...p, category: cat };
  });

  const filteredProjects = normalizedProjects.filter(p => {
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    if (!matchesCategory) return false;
    
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const matchesTitle = p.title.toLowerCase().includes(query);
    const matchesProblem = p.problem.toLowerCase().includes(query);
    const matchesSolution = (p.solution || "").toLowerCase().includes(query);
    const matchesCategoryName = p.category.toLowerCase().includes(query);
    const matchesTech = p.tech.some(t => t.toLowerCase().includes(query));
    
    return matchesTitle || matchesProblem || matchesSolution || matchesCategoryName || matchesTech;
  });

  const dropdownMatches = searchQuery.trim() === "" ? [] : normalizedProjects.filter(p => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = p.title.toLowerCase().includes(query);
    const matchesProblem = p.problem.toLowerCase().includes(query);
    const matchesSolution = (p.solution || "").toLowerCase().includes(query);
    const matchesCategoryName = p.category.toLowerCase().includes(query);
    const matchesTech = p.tech.some(t => t.toLowerCase().includes(query));
    
    return matchesTitle || matchesProblem || matchesSolution || matchesCategoryName || matchesTech;
  });

  return (
    <div className="pt-24 sm:pt-36 pb-16 px-4 sm:px-6 max-w-7xl mx-auto" id="portfolio-view-container">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-12"
          >
            {/* Header section */}
            <div className="text-center max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-880 backdrop-blur-md mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Our Works</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Creative <span className="bg-gradient-to-r from-brand-secondary to-brand-accent bg-clip-text text-transparent">Portfolio</span>.
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Explore real, deployed case studies where our custom software architectures drove measurable revenue leaps and absolute system stability.
              </p>
            </div>

            {/* Search Bar & Premium Interactive Category Filters */}
            <div className="space-y-6 max-w-md mx-auto">
              {/* Search input field */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                </span>
                <input
                  type="text"
                  placeholder="Search websites, graphic designs, technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-brand-secondary text-white pl-10 pr-10 py-2.5 rounded-none text-xs focus:outline-none transition-all placeholder-zinc-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Suggestions Match Dropdown */}
                {searchFocused && dropdownMatches.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-950 border border-zinc-850 z-50 shadow-2xl divide-y divide-zinc-900 rounded-none max-h-60 overflow-y-auto">
                    {dropdownMatches.slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSelectedProject(p);
                          setSearchQuery("");
                          setSearchFocused(false);
                        }}
                        className="px-4 py-2.5 hover:bg-zinc-900 cursor-pointer flex items-center gap-3 justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-grow">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-7 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-white truncate">{p.title}</span>
                            <span className="text-[10px] text-zinc-500 truncate">{p.problem}</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-none shrink-0">
                          {p.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap justify-center gap-2 border-b border-zinc-850 pb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      filterCategory === cat
                        ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/15"
                        : "bg-zinc-900/60 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-850 rounded-none bg-zinc-950/20 max-w-md mx-auto">
                <p className="text-zinc-500 text-xs font-medium">No results found matching your search query.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("All");
                  }}
                  className="mt-3 text-brand-secondary hover:underline text-xs font-bold"
                >
                  Clear search and filters
                </button>
              </div>
            ) : (
              /* Grid display */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {(filteredProjects || []).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className="group rounded-none transition-all duration-500 cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 shrink-0 rounded-none">
                      <LazyImage
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Floating Tech Tag */}
                      <span className={`absolute top-3 left-3 bg-zinc-950/90 border ${p.category === "Websites" ? "border-brand-secondary/40 text-brand-secondary" : "border-pink-500/40 text-pink-400"} backdrop-blur-md px-2 py-1 rounded-none text-[8px] font-bold uppercase tracking-wider pointer-events-none flex items-center gap-1.5`}>
                        {p.category === "Websites" ? (
                          <>
                            <Monitor className="w-2.5 h-2.5" />
                            Web Application
                          </>
                        ) : (
                          <>
                            <Palette className="w-2.5 h-2.5" />
                            Visual Design
                          </>
                        )}
                      </span>
                    </div>

                    <div className="pt-4 flex flex-col flex-grow">
                      <h3 className="text-base font-bold text-white mb-1.5 tracking-tight group-hover:text-brand-secondary transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-3 mb-4">
                        {p.problem}
                      </p>

                      <div className="mt-auto flex justify-between items-center pt-2 border-t border-zinc-900">
                        <div className="flex gap-1 flex-wrap">
                          {p.tech.slice(0, 3).map((t) => (
                            <span key={t} className="text-[7px] font-bold tracking-wider uppercase bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded-none text-zinc-400">
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className={`text-[8px] font-extrabold uppercase tracking-widest ${p.category === "Websites" ? "text-brand-secondary" : "text-pink-400"}`}>
                          {p.category === "Websites" ? "Web" : "Design"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : selectedProject.category === "Graphic Designs" ? (
          <motion.div
            key="graphic-design-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <GraphicDesignViewer 
              project={selectedProject} 
              onBack={() => setSelectedProject(null)} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="case-study"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            {/* Dynamic SEO Meta Tags Overrides */}
            <Helmet>
              <title>{`${selectedProject.title} | Case Study | Nexlify`}</title>
              <meta name="description" content={`Case study of "${selectedProject.title}" designed for ${selectedProject.client}. Live metrics: ${selectedProject.outcome}`} />
              <meta property="og:title" content={`${selectedProject.title} | Case Study`} />
              <meta property="og:description" content={`Case study of "${selectedProject.title}" designed for ${selectedProject.client}. Live metrics: ${selectedProject.outcome}`} />
              <meta property="og:image" content={selectedProject.image} />
              <meta name="twitter:title" content={`${selectedProject.title} | Case Study`} />
              <meta name="twitter:description" content={`Case study of "${selectedProject.title}" designed for ${selectedProject.client}. Live metrics: ${selectedProject.outcome}`} />
            </Helmet>

            {/* Navigation & Live Site Action */}
            <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800 text-xs font-bold transition-all w-fit cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Case Studies
              </button>

              {selectedProject.category === "Websites" && (
                <a
                  href={selectedProject.url || `https://${selectedProject.id}.nexlify.io`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-secondary hover:bg-brand-secondary/90 text-white font-bold text-xs transition-all shadow-md shadow-brand-secondary/25 cursor-pointer"
                >
                  Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="space-y-8">
              {/* Immersive Case Study Banner Header */}
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover absolute inset-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 max-w-xl">
                  <span className="text-xs font-semibold text-brand-secondary uppercase tracking-widest block mb-2">Featured Case Study</span>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">{selectedProject.title}</h1>
                  <p className="text-zinc-300 text-xs sm:text-sm font-medium mt-1">Client: {selectedProject.client}</p>
                </div>
              </div>

              {/* Core Blueprint grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-5 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Deployment Sector</span>
                  <span className="text-white text-sm font-bold mt-1 block">{selectedProject.category}</span>
                </div>
                <div className="glass-card p-5 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Engineering Timeline</span>
                  <span className="text-white text-sm font-bold mt-1 block">{selectedProject.timeline}</span>
                </div>
                <div className="glass-card p-5 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Framework Systems</span>
                  <div className="flex gap-1 flex-wrap mt-1.5">
                    {selectedProject.tech.map((t) => (
                      <span key={t} className="text-[8px] font-bold uppercase bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Solution and Problem Layout block */}
              <div className="space-y-6">
                <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] space-y-6">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">The Challenge</h3>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                      {selectedProject.problem}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-zinc-850">
                    <h3 className="text-white font-bold text-lg mb-2">The Technical Solution</h3>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>
                </div>

                {/* Outcomes Metres block */}
                <div className="bg-brand-secondary/15 border border-brand-secondary/30 p-6 sm:p-10 rounded-[2.5rem]">
                  <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest block mb-2">Key Outcome Metrics</span>
                  <p className="text-white font-bold text-lg sm:text-xl leading-relaxed">
                    {selectedProject.outcome}
                  </p>
                </div>

                {/* Client Feedback Card */}
                {selectedProject.feedback && (
                  <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                    <div className="absolute top-4 right-6 text-brand-secondary opacity-25 text-5xl font-black font-serif">
                      ”
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-3">Client Feedback</span>
                      <p className="text-zinc-300 italic text-sm leading-relaxed mb-4">
                        "{selectedProject.feedback.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-secondary/15 flex items-center justify-center text-brand-secondary font-bold text-xs">
                          {selectedProject.feedback.author[0]}
                        </div>
                        <div>
                          <h5 className="text-white font-bold text-xs">{selectedProject.feedback.author}</h5>
                          <p className="text-zinc-500 text-[10px]">{selectedProject.feedback.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visit Site Prompt Card */}
                {selectedProject.category === "Websites" && (
                  <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6 border border-brand-secondary/20 bg-gradient-to-r from-zinc-950 to-brand-secondary/5">
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Experience the Platform Live</h4>
                      <p className="text-zinc-400 text-xs sm:text-sm">Explore the fully deployed, highly optimized system in real-time.</p>
                    </div>
                    <a
                      href={selectedProject.url || `https://${selectedProject.id}.nexlify.io`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-secondary hover:bg-brand-secondary/90 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-brand-secondary/20 cursor-pointer w-full sm:w-auto justify-center"
                    >
                      Launch Website <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
