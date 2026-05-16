import React, { useState, useEffect } from "react";
import { 
  Code, 
  Palette, 
  Video, 
  PenTool, 
  Instagram, 
  Facebook, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Laptop, 
  Smartphone, 
  Award,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { cn } from "@/src/lib/utils";

// --- Constants & Data ---

const SERVICES = [
  {
    id: "web-dev",
    title: "Web Development",
    icon: Code,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    description: "Building resilient, future-ready digital architectures.",
    longDescription: "We specialize in creating high-performance web applications that are as functional as they are beautiful. From corporate landing pages to complex e-commerce platforms, we use the latest technology stacks to ensure speed, security, and scalability.",
    features: [
      "Custom React & Next.js Development",
      "Responsive UI/UX Implementation",
      "SEO & Performance Optimization",
      "API Integration & Backend Support",
      "E-commerce Solutions (Shopify, Custom)"
    ],
    variant: "primary"
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    description: "Visual storytelling that defines your brand identity.",
    longDescription: "Our creative team translates your brand values into compelling visual narratives. We go beyond aesthetics to create designs that communicate, engage, and convert your target audience across all digital and print mediums.",
    features: [
      "Brand Identity & Logo Design",
      "Social Media Visual Strategy",
      "Marketing & Printed Collaterals",
      "UI/UX Visual Design",
      "Motion Graphics & Illustrations"
    ],
    variant: "secondary"
  },
  {
    id: "video-editing",
    title: "Video Editing",
    icon: Video,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    description: "Cinematic post-production for modern storytellers.",
    longDescription: "Video is the most powerful medium of our time. We provide expert post-production services that bring your footage to life, ensuring your message is delivered with maximum impact and professional polish.",
    features: [
      "Commercial & Ad Video Editing",
      "Color Grading & Audio Mastering",
      "Subtitling & Motion Text",
      "YouTube & Social Media Content",
      "Corporate Event Highlights"
    ],
    variant: "accent"
  },
  {
    id: "content-writing",
    title: "Content Writing",
    icon: PenTool,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    description: "Strategic copywriting that resonates and ranks.",
    longDescription: "Words matter. We craft compelling copy that not only informs but also inspires action. Our content strategy focuses on aligning your brand voice with the needs and search intent of your customers.",
    features: [
      "SEO Blog & Article Writing",
      "Creative Web Copywriting",
      "Email Marketing Campaigns",
      "Technical Documentation",
      "Social Media Content Strategy"
    ],
    variant: "primary"
  }
];

// --- Components ---

const SEO = ({ title, description, schema }: { title?: string, description?: string, schema?: any }) => {
  const siteTitle = title ? `${title} | Nexlify Innovation` : "Nexlify Innovation | Digital Transformation & Creative Excellence";
  const siteDesc = description || "Nexlify Innovation is Nigeria's premier creative agency specializing in Web Development, Graphic Design, Video Editing, and Professional Training.";
  const siteLogo = "https://iili.io/Bp0LZ3Q.jpg";

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDesc} />
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content="web development nigeria, nexlify innovation, digital transformation, creative agency lagos, graphic design nigeria, video editing services" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDesc} />
      <meta property="og:image" content={siteLogo} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDesc} />
      <meta name="twitter:image" content={siteLogo} />
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

const ServiceDetailModal = ({ service, isOpen, onClose }: { service: any, isOpen: boolean, onClose: () => void }) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors z-10"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="hidden md:block relative overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className={cn(
                  "absolute inset-0 opacity-40 bg-gradient-to-br",
                  service.variant === "primary" ? "from-brand-primary to-transparent" :
                  service.variant === "secondary" ? "from-brand-secondary to-transparent" :
                  "from-brand-accent to-transparent"
                )} />
                <div className="absolute inset-0 flex flex-col justify-end p-12">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border backdrop-blur-md",
                    service.variant === "primary" ? "text-brand-primary border-brand-primary/20 bg-brand-primary/10" :
                    service.variant === "secondary" ? "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/10" :
                    "text-brand-accent border-brand-accent/20 bg-brand-accent/10"
                  )}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4 tracking-tight text-white">{service.title}</h2>
                  <p className="text-zinc-200 text-lg leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-950/50 p-8 sm:p-12 border-l border-zinc-800/50">
                <div className="md:hidden mb-8">
                  <div className="relative h-40 rounded-2xl overflow-hidden mb-6">
                    <img src={service.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{service.title}</h2>
                  <p className="text-zinc-400 text-sm">{service.description}</p>
                </div>

                <div className="hidden md:block mb-8">
                  <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Deep Dive</h4>
                  <p className="text-zinc-400 leading-relaxed italic border-l-2 border-brand-primary/30 pl-4">
                    {service.longDescription}
                  </p>
                </div>

                <h4 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-6">Key Deliverables</h4>
                <ul className="space-y-4 mb-10">
                  {service.features.map((feature: string, i: number) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className={cn(
                        "w-5 h-5",
                        service.variant === "primary" ? "text-brand-primary" :
                        service.variant === "secondary" ? "text-brand-secondary" :
                        "text-brand-accent"
                      )} />
                      <span className="text-zinc-300 font-medium">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="space-y-4">
                  <a 
                    href={`https://wa.me/2349074026805?text=Hello%20Nexlify,%20I'm%20interested%20in%20your%20${encodeURIComponent(service.title)}%20service.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-xl transition-all",
                      service.variant === "primary" ? "bg-brand-primary shadow-brand-primary/20" :
                      service.variant === "secondary" ? "bg-brand-secondary shadow-brand-secondary/20" :
                      "bg-brand-accent shadow-brand-accent/20",
                      "text-white"
                    )}
                  >
                    Discuss Your Project
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    Typical turnaround: 7-14 Business Days
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ view, setView }: { view: "home" | "about", setView: (v: "home" | "about") => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", type: "view", value: "home" },
    { name: "Services", type: "anchor", value: "#services" },
    { name: "Training", type: "anchor", value: "#training" },
    { name: "About Us", type: "view", value: "about" },
    { name: "Contact", type: "anchor", value: "#contact" },
  ];

  const handleNavClick = (link: any) => {
    if (link.type === "view") {
      setView(link.value);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || isMenuOpen ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setView("home");
            setIsMenuOpen(false);
          }}
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-brand-primary/20">
            <img 
              src="https://iili.io/Bp0LZ3Q.jpg" 
              alt="Nexlify Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = 'N';
                e.currentTarget.parentElement!.className = "w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-display font-bold text-xl text-white shadow-lg shadow-brand-primary/20";
              }}
            />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Nexlify <span className="text-purple-600">Innovation</span>
          </span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            link.type === "view" ? (
              <button
                key={link.name}
                onClick={() => setView(link.value as any)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  view === link.value ? "text-brand-primary" : "text-zinc-400 hover:text-white"
                )}
              >
                {link.name}
              </button>
            ) : (
              <a
                key={link.name}
                href={link.value}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
          <motion.a
            href="https://wa.me/2349074026805"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-zinc-400 hover:text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-zinc-800 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-5">
              {navLinks.map((link) => (
                link.type === "view" ? (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link)}
                    className={cn(
                      "text-xl font-bold text-left transition-colors",
                      view === link.value ? "text-brand-primary" : "text-zinc-300 hover:text-white"
                    )}
                  >
                    {link.name}
                  </button>
                ) : (
                  <a
                    key={link.name}
                    href={link.value}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-bold text-zinc-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <a
                href="https://wa.me/2349074026805"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-primary text-white p-4 rounded-2xl text-center font-bold shadow-lg shadow-brand-primary/20 mt-2"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};


const SectionHeading = ({ children, subtitle, align = "center" }: { children: React.ReactNode, subtitle?: string, align?: "left" | "center" }) => (
  <div className={cn("mb-12", align === "center" ? "text-center" : "text-left")}>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] mb-3"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-bold"
    >
      {children}
    </motion.h2>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:border-brand-primary/50 hover:bg-zinc-900 transition-all group"
  >
    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const TrainingCard = ({ 
  title, 
  price, 
  duration, 
  features, 
  requirements, 
  isFeatured = false,
  whatsappLink,
  variant = "primary"
}: { 
  title: string, 
  price: string, 
  duration: string, 
  features: string[], 
  requirements?: string[],
  isFeatured?: boolean,
  whatsappLink: string,
  variant?: "primary" | "secondary" | "accent"
}) => {
  const colors = {
    primary: "text-brand-primary border-brand-primary/20 bg-brand-primary/5",
    secondary: "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/5",
    accent: "text-brand-accent border-brand-accent/20 bg-brand-accent/5"
  };

  const btnColors = {
    primary: "bg-brand-primary shadow-brand-primary/20",
    secondary: "bg-brand-secondary shadow-brand-secondary/20",
    accent: "bg-brand-accent shadow-brand-accent/20"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "group relative p-8 rounded-[2rem] border transition-all duration-500 flex flex-col h-full",
        isFeatured 
          ? "bg-zinc-900 border-brand-primary/40 shadow-[0_20px_50px_rgba(59,130,246,0.15)] ring-1 ring-brand-primary/20" 
          : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 hover:shadow-2xl"
      )}
    >
      {/* Decorative Gradient Background */}
      <div className={cn(
        "absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br",
        variant === "primary" ? "from-brand-primary to-transparent" :
        variant === "secondary" ? "from-brand-secondary to-transparent" :
        "from-brand-accent to-transparent"
      )} />

      {isFeatured && (
        <div className="absolute -top-4 right-8 bg-brand-primary text-white text-[10px] uppercase font-black px-4 py-2 rounded-full tracking-widest shadow-lg shadow-brand-primary/30 flex items-center gap-2">
          <Award className="w-3 h-3" />
          Best Choice
        </div>
      )}
      
      <div className="mb-8 relative">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-transform duration-500 group-hover:scale-110",
          colors[variant]
        )}>
          {title.includes("Graphic") ? <Palette className="w-6 h-6" /> : <Code className="w-6 h-6" />}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight group-hover:text-white transition-colors">{title}</h3>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tighter">₦{price}</span>
          <span className="text-zinc-500 text-sm font-medium">/ Course</span>
        </div>
        <p className="text-zinc-400 text-xs mt-3 font-bold flex items-center gap-2 bg-zinc-900/50 w-fit px-3 py-1.5 rounded-full border border-zinc-800/50 uppercase tracking-wider">
          <MessageSquare className={cn("w-3.5 h-3.5", variant === "primary" ? "text-brand-primary" : variant === "secondary" ? "text-brand-secondary" : "text-brand-accent")} />
          {duration}
        </p>
      </div>

      <div className="space-y-4 mb-10 flex-grow relative">
        {features.map((feature, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + (i * 0.05) }}
            className="flex items-start gap-3"
          >
            <div className={cn(
              "p-1 rounded-full mt-0.5",
              variant === "primary" ? "bg-brand-primary/10 text-brand-primary" :
              variant === "secondary" ? "bg-brand-secondary/10 text-brand-secondary" :
              "bg-brand-accent/10 text-brand-accent"
            )}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            </div>
            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors font-medium">{feature}</span>
          </motion.div>
        ))}
        {requirements && (
          <div className="pt-6 border-t border-zinc-800/50 mt-6 space-y-3">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Essential Kit</p>
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 bg-zinc-900/40 rounded-xl border border-zinc-800/50">
                {req.includes("Laptop") ? <Laptop className="w-4 h-4 text-zinc-500" /> : <Smartphone className="w-4 h-4 text-zinc-500" />}
                <span className="text-xs text-zinc-400 font-bold">{req}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative group/btn w-full py-4 rounded-2xl text-center font-bold text-sm transition-all flex items-center justify-center gap-2 overflow-hidden shadow-xl",
          btnColors[variant],
          "text-white"
        )}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 flex items-center gap-2">
          Start Learning Now
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </span>
      </a>
    </motion.div>
  );
};

export default function App() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [view, setView] = useState<"home" | "about">("home");
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");

  const team = [
    {
      name: "David Simon",
      role: "Founder & Lead Creative",
      image: "https://iili.io/Bp1FLPV.jpg",
      bio: "Visionary leader driving digital innovation in Nigeria.",
      socials: { twitter: "#", linkedin: "#", instagram: "https://instagram.com/nexlify_innovation" }
    },
    {
      name: "Israel Ujah",
      role: "Manager",
      image: "https://iili.io/Bp1YSuj.png",
      bio: "Strategic administrator ensuring excellence in operations and service delivery.",
      socials: { linkedin: "#" }
    },
    {
      name: "Favor",
      role: "Lead Graphic Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      bio: "Mastering the art of visual identity and digital branding.",
      socials: { instagram: "#", dribbble: "#" }
    },
    {
      name: "Divine Favor",
      role: "Content Lead",
      image: "https://iili.io/Bp1z2a4.jpg",
      bio: "Crafting impactful narratives that align with our clients' success.",
      socials: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Abutu Joseph",
      role: "Content Specialist",
      image: "https://iili.io/BpMaPnf.jpg",
      bio: "Crafting compelling digital content and driving audience engagement.",
      socials: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Anigboro Joseph",
      role: "Content Writer",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80",
      bio: "Dedicated to creating clear, engaging, and persuasive written content.",
      socials: { linkedin: "#" }
    }
  ];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nexlify Innovation",
    "url": "https://nexlify.com.ng",
    "logo": "https://iili.io/Bp0LZ3Q.jpg",
    "sameAs": [
      "https://facebook.com/nexlifyinnovation",
      "https://instagram.com/nexlify_innovation"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+2349074026805",
      "contactType": "customer service",
      "areaServed": "NG",
      "availableLanguage": "English"
    },
    "description": "Leading digital services agency and training hub in Nigeria specialization in web development and design.",
    "founder": {
      "@type": "Person",
      "name": "David Simon"
    },
    "employee": team.map(member => ({
      "@type": "Person",
      "name": member.name,
      "jobTitle": member.role,
      "description": member.bio,
      "image": member.image
    }))
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Nexlify Innovation",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NG",
        "addressRegion": "Nassarawa"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Services",
      "itemListElement": SERVICES.map(s => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.title,
          "description": s.longDescription
        }
      }))
    }
  };

  const inquiries = [
    "I'm interested in Web Dev!",
    "Can I learn Graphic Design?",
    "Tell me about the Academy",
    "I need a website for my business",
    "How do I get started?"
  ];

  // Reset scroll on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Periodic WhatsApp Bubble
  useEffect(() => {
    const triggerBubble = () => {
      const randomText = inquiries[Math.floor(Math.random() * inquiries.length)];
      setBubbleText(randomText);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 3000);
    };

    const interval = setInterval(triggerBubble, 5000);
    // Initial trigger after 2 seconds
    const initialTimeout = setTimeout(triggerBubble, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-white">
      <SEO 
        title={view === "about" ? "About Us" : "Home"}
        schema={view === "home" ? [organizationSchema, servicesSchema] : organizationSchema} 
      />
      {/* Updated Navbar with Navigation Logic */}
      <Navbar view={view} setView={setView} />
      
      <ServiceDetailModal 
        service={selectedService} 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
      />

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-8 right-8 z-[90] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="bg-zinc-900 border border-zinc-800 text-white text-[11px] font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 mb-2 mr-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              {bubbleText}
              <div className="absolute bottom-[-5px] right-[20px] w-2.5 h-2.5 bg-zinc-900 border-r border-b border-zinc-800 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.a
          href="https://wa.me/2349074026805?text=Hello%20Nexlify%20Innovation,%20I%20have%20an%20inquiry."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="pointer-events-auto flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-2xl shadow-green-500/30 hover:bg-[#20ba5a] transition-colors group"
        >
          <span className="font-bold text-sm max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-500 whitespace-nowrap">
            Inquiry
          </span>
          <svg 
            viewBox="0 0 24 24" 
            className="w-6 h-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.a>
      </div>

      <main id="main-content">
        <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* --- Hero Section --- */}
            <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
              {/* Background Image Container */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80" 
                  alt="Nexlify Training Hub" 
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-zinc-950/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
              </div>

              {/* Background Gradients */}
              <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[140px] opacity-40 pointer-events-none z-0" />
              <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[140px] opacity-30 pointer-events-none" />
              
              <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
                    Modern Solutions for <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Digital</span> Success.
                  </h1>
                  <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed">
                    We bridge the gap between imagination and reality with cutting-edge web development, creative design, and professional training.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <a 
                      href="#training"
                      className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 group"
                    >
                      Explore Training
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a 
                      href="#services"
                      className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-8 py-4 rounded-xl font-bold transition-all border border-zinc-800 flex items-center justify-center gap-2"
                    >
                      Our Services
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="relative perspective-1000 hidden md:block"
                >
                  <div className="w-full aspect-square bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[4rem] border border-zinc-700/50 p-8 flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    
                    <div className="h-1/3 bg-zinc-900/80 rounded-3xl border border-zinc-800 p-6 flex flex-col justify-center animate-float">
                      <Code className="w-8 h-8 text-brand-primary mb-2" />
                      <div className="h-2 w-3/4 bg-zinc-800 rounded-full mb-2" />
                      <div className="h-2 w-1/2 bg-zinc-800 rounded-full" />
                    </div>
                    
                    <div className="h-1/4 self-end w-2/3 bg-zinc-900/80 rounded-3xl border border-zinc-800 p-6 flex items-center gap-4 animate-float-delayed">
                      <div className="w-10 h-10 rounded-full bg-brand-secondary" />
                      <div className="space-y-2 flex-grow">
                        <div className="h-2 w-full bg-zinc-800 rounded-full" />
                        <div className="h-2 w-2/3 bg-zinc-800 rounded-full" />
                      </div>
                    </div>

                    <div className="h-1/3 bg-brand-primary/5 rounded-3xl border border-brand-primary/20 p-6 flex flex-col justify-center animate-float">
                      <Palette className="w-8 h-8 text-brand-secondary mb-2" />
                      <div className="h-8 w-24 bg-brand-primary rounded-xl" />
                    </div>

                    {/* Glowing circles */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-brand-primary/40 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-brand-secondary/30 rounded-full blur-2xl" />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* --- Interactive Services Section --- */}
            <section id="services" className="py-24 px-6 bg-zinc-950">
              <div className="max-w-7xl mx-auto">
                <SectionHeading subtitle="Expertise">Our Premium Services</SectionHeading>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SERVICES.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedService(s)}
                      className="group relative cursor-pointer"
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] h-full hover:border-brand-primary/50 transition-all duration-500 flex flex-col overflow-hidden shadow-2xl group/card">
                        {/* Service Image Header */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={s.image} 
                            alt={s.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                          
                          {/* Floating Icon */}
                          <div className={cn(
                            "absolute bottom-4 left-6 w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-md transition-all duration-500 group-hover/card:scale-110",
                            s.variant === "primary" ? "text-brand-primary border-brand-primary/20 bg-brand-primary/10" :
                            s.variant === "secondary" ? "text-brand-secondary border-brand-secondary/20 bg-brand-secondary/10" :
                            "text-brand-accent border-brand-accent/20 bg-brand-accent/10"
                          )}>
                            <s.icon className="w-6 h-6" />
                          </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow bg-zinc-900/50">
                          <h3 className="text-xl font-bold mb-3 tracking-tight group-hover/card:text-white transition-colors">{s.title}</h3>
                          <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow">{s.description}</p>
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 group-hover/card:text-brand-primary transition-colors mt-auto">
                            View details & deliverables
                            <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- Training Section --- */}
            <section id="training" className="py-24 px-6 bg-zinc-900/30">
              <div className="max-w-7xl mx-auto">
                <SectionHeading subtitle="Academy" align="center">Professional Training Programs</SectionHeading>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <TrainingCard 
                    title="Graphic Design"
                    price="8,000"
                    duration="2 Months Program"
                    variant="accent"
                    features={[
                      "1 Month Intensive Training",
                      "1 Month Active Internship",
                      "Professional Certificate",
                      "Access to Recorded Videos",
                      "Live Direct Mentor Support"
                    ]}
                    requirements={["Mobile Phone or Laptop"]}
                    whatsappLink="https://wa.me/2349074026805?text=I'm%20interested%20in%20Graphic%20Designing%20Training."
                  />
                  <TrainingCard 
                    title="Frontend Web Development"
                    price="150,000"
                    duration="2 Months Program"
                    variant="primary"
                    features={[
                      "HTML5, CSS3, JavaScript",
                      "React.js & Modern CSS Frameworks",
                      "Professional Portfolio Projects",
                      "Course Certificate Included",
                      "Lifetime access to Videos"
                    ]}
                    isFeatured={true}
                    requirements={["A Laptop is Required"]}
                    whatsappLink="https://wa.me/2349074026805?text=I'm%20interested%20in%20Frontend%20Web%20Dev%20Training."
                  />
                  <TrainingCard 
                    title="Fullstack Web Development"
                    price="250,000"
                    duration="3 Months Program"
                    variant="secondary"
                    features={[
                      "Complete Frontend Training",
                      "Backend (Node.js & Databases)",
                      "System Architecture & Security",
                      "Advanced Certification",
                      "Job-Ready Internship Projects"
                    ]}
                    requirements={["A Laptop is Required"]}
                    whatsappLink="https://wa.me/2349074026805?text=I'm%20interested%20in%20Fullstack%20Web%20Dev%20Training."
                  />
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="about"
            id="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 px-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <div>
                  <SectionHeading subtitle="Who We Are" align="left">About Nexlify Innovation</SectionHeading>
                  <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                    Nexlify Innovation is a leading digital services agency and training hub based in Nassarawa State. We were founded on the belief that digital literacy and high-quality technological solutions should be accessible to everyone.
                  </p>
                  <p className="text-zinc-500 leading-relaxed mb-10">
                    Our mission is to empower individuals with the skills needed to thrive in the modern economy while helping businesses build a formidable digital presence. We blend creativity with technical excellence to deliver results that matter.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-white font-bold mb-2">Our Vision</h4>
                      <p className="text-sm text-zinc-500">To be the #1 digital powerhouse in Nigeria, fostering innovation and talent.</p>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2">Our Mission</h4>
                      <p className="text-sm text-zinc-500">To provide world-class digital services and hand-on professional training.</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-800">
                    <img 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                      alt="Team Meeting" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-brand-primary p-8 rounded-3xl text-white shadow-2xl">
                    <p className="text-4xl font-black">5+</p>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Years of Experience</p>
                  </div>
                </div>
              </div>

              {/* --- Team Section --- */}
              <div id="team" className="mb-32">
                <SectionHeading subtitle="Meet The Minds" align="center">The Nexlify Team</SectionHeading>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {team.map((member, i) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <div className="relative mb-6 rounded-[2.5rem] overflow-hidden border bg-zinc-900 border-zinc-800 transition-all duration-500 group-hover:border-brand-primary/50 group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                        
                        {/* Overlay Socials */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                          {Object.entries(member.socials).map(([platform, link]) => (
                            <a key={platform} href={link} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-primary transition-colors">
                              {platform === "linkedin" && <ExternalLink className="w-4 h-4" />}
                              {platform === "instagram" && <Instagram className="w-4 h-4" />}
                              {platform === "twitter" && <MessageSquare className="w-4 h-4" />}
                              {platform === "github" && <Code className="w-4 h-4" />}
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                        <p className="text-brand-primary text-xs font-black uppercase tracking-[0.15em] mb-3">{member.role}</p>
                        <p className="text-sm text-zinc-500 leading-relaxed px-4">{member.bio}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Rest of Home Section Content (About/Stats, Contact Footer stay) --- */}
      {view === "home" && (
        <>
          {/* --- Stats / Why Us --- */}
          <section id="about-preview" className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4 pt-12">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h4 className="text-3xl font-bold text-brand-primary mb-1">100+</h4>
                    <p className="text-zinc-500 text-sm font-medium">Happy Students</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h4 className="text-3xl font-bold text-brand-secondary mb-1">50+</h4>
                    <p className="text-zinc-500 text-sm font-medium">Live Projects</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h4 className="text-3xl font-bold text-brand-accent mb-1">24/7</h4>
                    <p className="text-zinc-500 text-sm font-medium">Support</p>
                  </div>
                  <div className="bg-brand-primary p-6 rounded-3xl text-white">
                    <h4 className="text-3xl font-bold mb-1">#1</h4>
                    <p className="text-white/80 text-sm font-medium">In Nassarawa State</p>
                  </div>
                </div>
              </motion.div>

              <div>
                <SectionHeading subtitle="About Nexlify" align="left">
                  Innovating From The Heart of Nigeria.
                </SectionHeading>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  Based in Nassarawa State, Nexlify Innovation is more than just a digital agency. We are a community of creatives and engineers dedicated to fostering digital literacy and high-quality services.
                </p>
                <div className="flex flex-col gap-4 mb-10">
                  {[
                    "Certified professional trainers",
                    "Real-world project experience",
                    "Flexible learning with recorded access",
                    "Post-training mentorship and support"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                      <span className="font-medium text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setView("about")}
                  className="px-8 py-3 rounded-full border border-zinc-800 text-sm font-bold hover:bg-zinc-900 transition-all flex items-center gap-2 group"
                >
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* --- Contact / CTA --- */}
      <section id="contact" className="py-24 px-6 bg-brand-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start your digital journey?</h2>
            <p className="text-lg text-white/80 mb-10">
              Whether you need a professional website or want to master a new skill, we are here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://wa.me/2349074026805?text=Hello%20Nexlify%20Innovation,%20I'm%20interested%20in%20your%20services.%20Can%20we%20talk?"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-brand-primary hover:bg-zinc-100 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center gap-2 group w-full sm:w-auto justify-center"
              >
                <MessageSquare className="w-6 h-6 fill-brand-primary" />
                Chat on WhatsApp
              </a>
              <a 
                href="mailto:nexlifyinnovation@gmail.com"
                className="bg-brand-primary border-2 border-white/30 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-16 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="https://iili.io/Bp0LZ3Q.jpg" 
                  alt="Nexlify Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Nexlify</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Transforming businesses and lives through innovative digital solutions and world-class training in Nigeria.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com/nexlify_innovation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand-primary hover:text-white transition-all border border-zinc-800"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/nexlifyinnovation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand-primary hover:text-white transition-all border border-zinc-800"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/2349074026805" 
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-brand-primary hover:text-white transition-all border border-zinc-800"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <h5 className="font-bold text-white mb-4">Links</h5>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><button onClick={() => setView("home")} className="hover:text-brand-primary transition-colors text-left">Home</button></li>
                <li><a href="#services" className="hover:text-brand-primary transition-colors">Services</a></li>
                <li><a href="#training" className="hover:text-brand-primary transition-colors">Training</a></li>
                <li><button onClick={() => setView("about")} className="hover:text-brand-primary transition-colors text-left">About Us</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="mailto:nexlifyinnovation@gmail.com" className="hover:text-brand-primary transition-colors">Help Center</a></li>
                <li><a href="https://wa.me/2349074026805" className="hover:text-brand-primary transition-colors">Enquiries</a></li>
                <li><a href="https://wa.me/2349074026805" className="hover:text-brand-primary transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} NEXLIFY INNOVATION. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>Built for scale</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

