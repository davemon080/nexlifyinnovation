import React, { useState, useEffect } from "react";
import { 
  Home,
  Layers,
  Briefcase,
  Users,
  GraduationCap,
  BookOpen,
  UserPlus,
  Mail,
  Calendar,
  ArrowRight, 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Phone,
  MapPin,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { ViewType, Service } from "./types";

// Import modular pages
import HomeView from "./components/HomeView";
import ServicesView from "./components/ServicesView";
import PortfolioView from "./components/PortfolioView";
import AboutView from "./components/AboutView";
import TrainingView from "./components/TrainingView";
import BlogView from "./components/BlogView";
import CareersView from "./components/CareersView";
import ContactView from "./components/ContactView";
import BookConsultationView from "./components/BookConsultationView";
import ServiceDetailModal from "./components/ServiceDetailModal";
import AdminDashboardView from "./components/AdminDashboardView";

// Custom TikTok Icon
const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 0 0-3.32.92 6.34 6.34 0 0 0-2.8 5.23 6.34 6.34 0 0 0 6.33 6.33c3.5 0 6.33-2.83 6.33-6.33V9a8.16 8.16 0 0 0 4.78 1.53V7.08a4.85 4.85 0 0 1-1.21-.39z"/>
  </svg>
);

const SEO = ({ title, description }: { title?: string, description?: string }) => {
  const siteTitle = title ? `${title} | Nexlify Innovation` : "Nexlify Innovation | Premium Enterprise Software & Training Agency";
  const siteDesc = description || "Nexlify Innovation is Nigeria's premier creative software engineering agency specializing in high-performance Web Development, Custom Apps, Brand Design, and Academy Training.";
  const siteLogo = "https://iili.io/Bp0LZ3Q.jpg";

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDesc} />
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content="web development nigeria, nexlify innovation, digital transformation, creative agency, graphic design, fullstack training, nasarawa tech" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDesc} />
      <meta property="og:image" content={siteLogo} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDesc} />
      <meta name="twitter:image" content={siteLogo} />
      <meta name="twitter:site" content="@NexlifyInn55" />
      <meta name="twitter:creator" content="@NexlifyInn55" />
    </Helmet>
  );
};

export default function App() {
  const [view, setView] = useState<ViewType>("home");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // WhatsApp bubble state
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Map pathname to ViewType
  const getPathFromView = (v: ViewType): string => {
    switch (v) {
      case "home": return "/";
      case "services": return "/services";
      case "portfolio": return "/portfolio";
      case "about": return "/about";
      case "training": return "/training";
      case "blog": return "/blog";
      case "careers": return "/careers";
      case "contact": return "/contact";
      case "book-consultation": return "/book-consultation";
      case "admin-dashboard": return "/adminnexlify";
      default: return "/";
    }
  };

  const getViewFromPath = (path: string): ViewType => {
    const cleanPath = path.replace(/\/$/, ""); // remove trailing slash
    switch (cleanPath) {
      case "":
      case "/": 
        return "home";
      case "/services": 
        return "services";
      case "/portfolio": 
        return "portfolio";
      case "/about": 
        return "about";
      case "/training": 
        return "training";
      case "/blog": 
        return "blog";
      case "/careers": 
        return "careers";
      case "/contact": 
        return "contact";
      case "/book-consultation":
      case "/booking":
        return "book-consultation";
      case "/adminnexlify": 
        return "admin-dashboard";
      default: 
        return "home";
    }
  };

  // Synchronize view state when URL path is directly hit (/adminnexlify)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setView(getViewFromPath(path));
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    
    // Initial check on mount
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // Update browser URL path cleanly when view state updates
  useEffect(() => {
    const currentPath = window.location.pathname;
    const targetPath = getPathFromView(view);
    if (currentPath !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [view]);

  const inquiries = [
    "Learn Graphic Design with us!",
    "Consult for custom SaaS systems",
    "Request custom React builds",
    "Enroll in Fullstack Web Academies",
    "UI/UX Design consultations open"
  ];

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Navbar scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Periodic WhatsApp Bubble trigger
  useEffect(() => {
    const triggerBubble = () => {
      const randomText = inquiries[Math.floor(Math.random() * inquiries.length)];
      setBubbleText(randomText);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 3500);
    };

    const interval = setInterval(triggerBubble, 6500);
    const initialTimeout = setTimeout(triggerBubble, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const navLinks: { name: string; value: ViewType; icon: React.ElementType }[] = [
    { name: "Home", value: "home", icon: Home },
    { name: "Services", value: "services", icon: Layers },
    { name: "Portfolio", value: "portfolio", icon: Briefcase },
    { name: "About Us", value: "about", icon: Users },
    { name: "Training", value: "training", icon: GraduationCap },
    { name: "Insights", value: "blog", icon: BookOpen },
    { name: "Careers", value: "careers", icon: UserPlus },
    { name: "Contact", value: "contact", icon: Mail }
  ];

  if (view === "admin-dashboard") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-brand-primary selection:text-white">
        <SEO title="Admin Portal" />
        <AdminDashboardView setView={setView} />
      </div>
    );
  }

  const getPageSEO = (currentView: ViewType) => {
    switch (currentView) {
      case "home":
        return {
          title: "Premium Enterprise Software & Academy Training",
          description: "Nexlify Innovation is Nigeria's premier creative software engineering agency. We specialize in high-performance Web Development, Custom Apps, Brand Designs, and Elite Academy Training."
        };
      case "services":
        return {
          title: "Bespoke Engineering Services",
          description: "Explore our range of corporate technology services including Custom Software, Web Portals, Cloud Orchestrations, and high-fidelity Brand Identity Designs."
        };
      case "portfolio":
        return {
          title: "Our Work & Case Studies Portfolio",
          description: "Browse the Nexlify portfolio of premium custom software platforms, cloud applications, and exquisite brand graphic designs. Inspect live website previews right on our platform."
        };
      case "about":
        return {
          title: "About Our Craftsmanship & Tech Standards",
          description: "Learn about the mission, values, and world-class software engineering and design standards of Nigeria's leading boutique tech and design agency."
        };
      case "training":
        return {
          title: "Fullstack Academy & Graphic Design Training",
          description: "Accelerate your career with premium, mentor-led courses at Nexlify Academy. Learn Fullstack Web Development, Mobile Engineering, and Graphic Design."
        };
      case "blog":
        return {
          title: "Tech Insights & Engineering Blog",
          description: "Stay ahead of industry shifts with deep-dive technical articles, tutorials, and corporate insights from our veteran software developers and designers."
        };
      case "careers":
        return {
          title: "Careers & Open Engineering Positions",
          description: "Join Nigeria's elite software agency. We are always hiring talented designers, front-end developers, backend architects, and training instructors."
        };
      case "contact":
        return {
          title: "Get in Touch | Contact Our Tech Advisors",
          description: "Ready to launch your platform or start your learning journey? Reach out to our customer relations teams and technical architects."
        };
      case "book-consultation":
        return {
          title: "Book a Professional Tech Consultation",
          description: "Schedule a high-intensity professional consulting session with our principal engineers to scope, audit, and design your product pipelines."
        };
      default:
        return {
          title: currentView.charAt(0).toUpperCase() + currentView.slice(1),
          description: ""
        };
    }
  };

  const seoData = getPageSEO(view);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-brand-primary selection:text-white flex flex-col">
      <SEO title={seoData.title} description={seoData.description} />

      {/* --- FLOATING NAV ELEMENTS (NO FULL HEADER BAR) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Name Floating Pill */}
          <div 
            className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/85 border border-zinc-800/80 backdrop-blur-md shadow-xl cursor-pointer select-none hover:border-brand-primary/40 transition-all"
            onClick={() => {
              setView("home");
              setIsMenuOpen(false);
            }}
          >
            <div className="w-7 h-7 bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden border border-white/10 shadow-sm shrink-0">
              <img 
                src="https://iili.io/Bp0LZ3Q.jpg" 
                alt="Nexlify Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = 'N';
                  e.currentTarget.parentElement!.className = "w-7 h-7 bg-brand-primary rounded-full flex items-center justify-center font-bold text-xs text-white border border-white/10";
                }}
              />
            </div>
            <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-white">
              Nexlify <span className="text-brand-primary">Innovation</span>
            </span>
          </div>

          {/* Desktop Nav links Floating Capsule */}
          <div className="pointer-events-auto hidden lg:flex items-center gap-1 bg-zinc-950/85 border border-zinc-800/80 rounded-full p-1 shadow-xl backdrop-blur-md">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const isActive = view === link.value;
              return (
                <button
                  key={link.value}
                  onClick={() => setView(link.value)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? "bg-brand-primary text-white shadow-sm" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                  }`}
                >
                  <LinkIcon className={`w-3 h-3 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  <span>{link.name}</span>
                </button>
              );
            })}
            <button
              onClick={() => setView("book-consultation")}
              className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1 whitespace-nowrap ml-0.5"
            >
              <Calendar className="w-3 h-3" />
              <span>Consult Now</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu Trigger Floating Button */}
          <button 
            className="pointer-events-auto lg:hidden p-2.5 rounded-full bg-zinc-950/85 border border-zinc-800/80 backdrop-blur-md text-zinc-300 hover:text-white shadow-xl transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Floating Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="pointer-events-auto lg:hidden mt-3 max-w-md mx-auto bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl p-4 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col p-5 gap-2">
                {navLinks.map((link) => {
                  const LinkIcon = link.icon;
                  const isActive = view === link.value;
                  return (
                    <button
                      key={link.value}
                      onClick={() => {
                        setView(link.value);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 text-xs font-bold text-left py-2.5 px-4 rounded-xl transition-all uppercase tracking-wider ${
                        isActive 
                          ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30" 
                          : "text-zinc-300 hover:text-white hover:bg-zinc-900/60 border border-zinc-900/40"
                      }`}
                    >
                      <LinkIcon className={`w-4 h-4 ${isActive ? "text-brand-primary" : "text-zinc-500"}`} />
                      <span>{link.name}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    setView("book-consultation");
                    setIsMenuOpen(false);
                  }}
                  className="bg-brand-primary text-white p-3.5 rounded-xl text-center font-bold shadow-lg mt-2 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- FLOATING CHAT CHANNELS --- */}
      <div className="fixed bottom-6 right-6 z-[95] flex flex-col items-end gap-2.5 pointer-events-none">
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-zinc-900/95 border border-zinc-800 text-white text-[11px] font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 mb-2 mr-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
              {bubbleText}
              <div className="absolute bottom-[-5px] right-[20px] w-2.5 h-2.5 bg-zinc-900 border-r border-b border-zinc-800 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.a
          href="https://wa.me/2349074026805?text=Hello%20Nexlify%20Innovation,%20I%20have%2520an%2520inquiry."
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.a>
      </div>

      {/* --- MAIN PAGE CORE PORTAL --- */}
      <main id="main-content" className="flex-grow">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomeView setView={setView} setSelectedService={setSelectedService} />
            </motion.div>
          )}

          {view === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ServicesView setView={setView} />
            </motion.div>
          )}

          {view === "portfolio" && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PortfolioView />
            </motion.div>
          )}

          {view === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AboutView />
            </motion.div>
          )}

          {view === "training" && (
            <motion.div
              key="training"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TrainingView />
            </motion.div>
          )}

          {view === "blog" && (
            <motion.div
              key="blog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BlogView />
            </motion.div>
          )}

          {view === "careers" && (
            <motion.div
              key="careers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CareersView />
            </motion.div>
          )}

          {view === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ContactView />
            </motion.div>
          )}

          {view === "book-consultation" && (
            <motion.div
              key="book-consultation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BookConsultationView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Service Detail Modal coordinator */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        onBook={() => setView("book-consultation")}
      />

      {/* --- DETAILED CORPORATE FOOTER --- */}
      <footer className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-8 pb-12 border-b border-zinc-900">
          
          {/* Column 1: Info and brand descriptions (Col span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("home")}>
              <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center overflow-hidden border border-white/5 shadow-lg">
                <img src="https://iili.io/Bp0LZ3Q.jpg" alt="Nexlify Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Nexlify <span className="text-brand-primary">Innovation</span>
              </span>
            </div>
            
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
              We translate critical software requirements and visual standards into fully responsive systems. Partner with Nigeria's premium creative innovation studio.
            </p>

            {/* Official Social channels */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Official Social Channels</span>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: "TikTok", handle: "@nexlifyinnovation", icon: TikTokIcon, href: "https://www.tiktok.com/@nexlifyinnovation?is_from_webapp=1&sender_device=pc", color: "hover:text-pink-400 hover:border-pink-500/40" },
                  { name: "Instagram", handle: "@nexlify_innovation", icon: Instagram, href: "https://www.instagram.com/nexlify_innovation?igsh=dXVreWgzaDUzcnhy&utm_source=qr", color: "hover:text-amber-400 hover:border-amber-500/40" },
                  { name: "Twitter / X", handle: "@NexlifyInn55", icon: Twitter, href: "https://twitter.com/NexlifyInn55", color: "hover:text-sky-400 hover:border-sky-500/40" }
                ].map((soc, idx) => (
                  <a 
                    key={idx} 
                    href={soc.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={`${soc.name} (${soc.handle})`}
                    className={`px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 transition-all flex items-center gap-2 text-xs font-bold ${soc.color}`}
                  >
                    <soc.icon className="w-4 h-4 shrink-0" />
                    <span>{soc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Solutions Navigation (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Solutions</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setView("services")} className="text-zinc-500 hover:text-white transition-colors text-xs font-semibold text-left">Enterprise Software</button>
              <button onClick={() => setView("services")} className="text-zinc-500 hover:text-white transition-colors text-xs font-semibold text-left">Mobile Architectures</button>
              <button onClick={() => setView("services")} className="text-zinc-500 hover:text-white transition-colors text-xs font-semibold text-left">UI/UX Design Systems</button>
              <button onClick={() => setView("services")} className="text-zinc-500 hover:text-white transition-colors text-xs font-semibold text-left">Cloud Engineering</button>
            </div>
          </div>

          {/* Column 3: Academy Resources Navigation (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Academy</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setView("training")} className="text-zinc-500 hover:text-white transition-colors text-xs font-semibold text-left">Bootcamp Courses</button>
              <button onClick={() => setView("blog")} className="text-zinc-500 hover:text-white transition-colors text-xs font-semibold text-left">Insights & Libraries</button>
              <button onClick={() => setView("careers")} className="text-zinc-500 hover:text-white transition-colors text-xs font-semibold text-left">Active Careers</button>
              <button onClick={() => setView("admin-dashboard")} className="text-brand-primary/80 hover:text-brand-primary transition-colors text-xs font-bold text-left uppercase tracking-wider mt-1">Admin Portal</button>
            </div>
          </div>

          {/* Column 4: Contact details (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Get Support</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-500">
                <Mail className="w-4 h-4 text-brand-primary shrink-0" />
                <span>nexlifyinnovation@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-500">
                <Phone className="w-4 h-4 text-brand-primary shrink-0" />
                <span>+234 907 402 6805</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs font-bold text-zinc-500">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span>Nassarawa State, Nigeria</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sub copyright footer */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-zinc-600 text-xs font-medium">
            Copyright © 2026 Nexlify Innovation. All Rights Reserved.
          </span>
          <div className="flex gap-4">
            <span className="text-zinc-600 text-xs font-medium cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="text-zinc-600 text-xs font-medium cursor-pointer hover:text-white transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
