import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Code, Palette, Smartphone, Sparkles, CheckCircle2, Shield, Zap, Globe, MessageSquare, Monitor, Calendar, Clock } from "lucide-react";
import { SERVICES, PROJECTS, PROCESS_STAGES, TECH_STACK, BLOGS, COURSES } from "../data";
import { getServices, getProjects, getBlogs } from "../lib/db";
import { Service, Project, BlogPost, ViewType } from "../types";
import HeroServiceShowcase from "./HeroServiceShowcase";

interface HomeViewProps {
  setView: (v: ViewType) => void;
  setSelectedService: (s: any) => void;
}

export default function HomeView({ setView, setSelectedService }: HomeViewProps) {
  const [servicesList, setServicesList] = useState<Service[]>(SERVICES);
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);
  const [blogsList, setBlogsList] = useState<BlogPost[]>(BLOGS);

  useEffect(() => {
    getServices()
      .then(list => {
        if (list && list.length > 0) {
          setServicesList(list);
        }
      })
      .catch(err => console.error("Error loading services in HomeView:", err));

    getProjects()
      .then(list => {
        if (list && list.length > 0) {
          setProjectsList(list);
        }
      })
      .catch(err => console.error("Error loading projects in HomeView:", err));

    getBlogs()
      .then(list => {
        if (list && list.length > 0) {
          setBlogsList(list);
        }
      })
      .catch(err => console.error("Error loading blogs in HomeView:", err));
  }, []);
  // Map icons from string to Lucide component
  const getIcon = (name: string) => {
    switch (name) {
      case "Code": return Code;
      case "Palette": return Palette;
      case "Smartphone": return Smartphone;
      case "Sparkles": return Sparkles;
      default: return Code;
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80" 
            alt="Nexlify Innovation Hub" 
            className="w-full h-full object-cover opacity-35 scale-105 filter blur-[2px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-zinc-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
        </div>

        {/* Dynamic Glass Flares */}
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-xs font-semibold text-zinc-300 tracking-wide">Premium Digital Partner</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
              Modern Solutions for <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">Digital</span> Success.
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed">
              We bridge the gap between imagination and reality with premium, high-performance web development, immersive cross-platform applications, and elite technical academy training.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => setView("book-consultation")}
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/95 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
              >
                Book Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setView("services")}
                className="w-full sm:w-auto glass-card text-zinc-300 hover:text-white hover:bg-zinc-900/60 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2"
              >
                Explore Services
              </button>
            </div>
          </motion.div>

          {/* Interactive 3-Card Service Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="w-full"
          >
            <HeroServiceShowcase setView={setView} />
          </motion.div>
        </div>
      </section>

      {/* --- WHY CHOOSE US / STATS SECTION --- */}
      <section className="px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-6 sm:pt-12">
                <div className="glass-card p-6 sm:p-8 rounded-[2rem] shadow-xl text-center md:text-left hover:scale-[1.03] transition-all duration-300">
                  <h4 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent mb-1">3+</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">Live Products</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass-card p-6 sm:p-8 rounded-[2rem] shadow-xl text-center md:text-left hover:scale-[1.03] transition-all duration-300">
                  <h4 className="text-3xl sm:text-5xl font-black text-brand-accent mb-1">24/7</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">Active Support</p>
                </div>
                <div className="bg-brand-primary/95 p-6 sm:p-8 rounded-[2rem] text-center md:text-left shadow-xl hover:scale-[1.03] transition-all duration-300">
                  <h4 className="text-3xl sm:text-5xl font-black text-white mb-1">#1</h4>
                  <p className="text-white/80 text-xs sm:text-sm font-bold tracking-wider uppercase">In Nasarawa State</p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Nexlify Advantage</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Crafting Digital Excellence.</h2>
              </div>
              <p className="text-zinc-400 mb-8 leading-relaxed text-sm sm:text-base">
                Based in Nassarawa State, Nigeria, Nexlify Innovation delivers cutting-edge software solutions and visual arts training that meets rigorous global standards.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: Shield, t: "Certified Professional Developers & Designers", d: "Our leaders hold top credentials and years of industry practice." },
                  { icon: Zap, t: "Performance-First Optimization", d: "We engineer lightweight code solutions built for slow networks." },
                  { icon: Globe, t: "Robust Post-Deployment Support", d: "Ongoing security, maintenance updates, and platform audits." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/30">
                    <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary shrink-0 h-fit">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">{item.t}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED SERVICES (GRID OF 3) --- */}
      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-bold">Featured Agency Services</h2>
            </div>
            <button 
              onClick={() => setView("services")}
              className="text-sm font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-2 group"
            >
              Explore all services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesList.slice(0, 3).map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <div 
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className="group glass-card rounded-[2rem] overflow-hidden flex flex-col h-full hover:scale-[1.02] hover:shadow-2xl hover:border-brand-primary/35 transition-all duration-500 cursor-pointer"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={s.image} 
                      alt={s.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                    <div className="absolute bottom-4 left-6 w-11 h-11 rounded-xl bg-zinc-950/80 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 text-white">{s.title}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed flex-grow mb-4">{s.description}</p>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                      View deliverables <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- LATEST PROJECTS / SHOWCASE SECTION --- */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-brand-secondary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Showcase</span>
              <h2 className="text-3xl sm:text-4xl font-bold">Featured Case Studies</h2>
            </div>
            <button 
              onClick={() => setView("portfolio")}
              className="text-sm font-bold text-brand-secondary hover:text-brand-secondary/80 flex items-center gap-2 group cursor-pointer"
            >
              Browse portfolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectsList.slice(0, 3).map((p) => {
              const isWeb = p.category === "Websites" || p.category === "Web Applications" || p.category === "Web Application";
              return (
                <div 
                  key={p.id}
                  onClick={() => setView("portfolio")}
                  className="group glass-card rounded-[2.5rem] overflow-hidden hover:scale-[1.02] hover:border-brand-secondary/35 transition-all duration-500 cursor-pointer flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 shrink-0">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    <span className={`absolute top-4 left-4 bg-zinc-950/90 border ${isWeb ? "border-brand-secondary/40 text-brand-secondary" : "border-pink-500/40 text-pink-400"} backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs`}>
                      {isWeb ? (
                        <>
                          <Monitor className="w-3 h-3" />
                          Web Application
                        </>
                      ) : (
                        <>
                          <Palette className="w-3 h-3" />
                          Visual Design
                        </>
                      )}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-secondary transition-colors line-clamp-1">{p.title}</h3>
                    <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed mb-4 flex-grow">{p.problem}</p>
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-900/80">
                      <div className="flex gap-1.5 flex-wrap">
                        {(p.tech || []).slice(0, 3).map((t) => (
                          <span key={t} className="text-[8px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest ${isWeb ? "text-brand-secondary" : "text-pink-400"}`}>
                        {isWeb ? "Web" : "Design"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- OUR PROCESS SECTION --- */}
      <section className="px-4 sm:px-6 py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold">Our Engineering Process</h2>
            <p className="text-zinc-500 text-sm mt-3">From raw blueprinting to distributed deployment, we focus on perfection.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STAGES.map((s) => (
              <div 
                key={s.num}
                className="glass-card p-6 sm:p-8 rounded-[2rem] hover:bg-zinc-900/40 hover:border-brand-primary/20 transition-all duration-300"
              >
                <span className="text-3xl font-black bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent block mb-4">{s.num}</span>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ACADEMY SPOTLIGHT SECTION --- */}
      <section className="px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Nexlify Academy</span>
              <h2 className="text-3xl sm:text-4xl font-bold">Elite Training Programs</h2>
              <p className="text-zinc-500 text-xs sm:text-sm mt-2 max-w-xl">
                Fast-track your creative career with elite hands-on courses designed and led by veteran industry instructors.
              </p>
            </div>
            <button 
              onClick={() => setView("training")}
              className="text-sm font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-2 group"
            >
              Explore Academy Programs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSES.map((course) => {
              return (
                <div 
                  key={course.id}
                  className="group relative p-6 bg-zinc-950/40 border border-zinc-900 rounded-[2rem] hover:border-brand-primary/20 hover:bg-zinc-950/80 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                        {course.duration}
                      </span>
                      <span className="text-xs font-bold text-brand-secondary">
                        ₦{course.price}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white group-hover:text-brand-primary transition-colors">
                      {course.title}
                    </h3>

                    <ul className="space-y-2 pt-2 border-t border-zinc-900/60">
                      {course.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-[11px] text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-900/60 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">
                      By {course.mentors?.[0] || "Nexlify Experts"}
                    </span>
                    <button 
                      onClick={() => setView("training")}
                      className="text-[10px] font-black uppercase tracking-wider text-brand-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Enrolling Now <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CLIENT TESTIMONIALS --- */}
      <section className="px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-brand-accent font-bold text-xs uppercase tracking-[0.2em] block mb-2">Success Stories</span>
            <h2 className="text-3xl font-bold">Trusted by Dynamic Teams</h2>
          </div>

          <div className="glass-card p-8 sm:p-12 rounded-[3rem] relative shadow-2xl">
            <div className="absolute -top-6 left-12 w-12 h-12 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent text-2xl font-black">
              “
            </div>
            
            <p className="text-zinc-200 text-base sm:text-lg italic leading-relaxed mb-6 font-medium">
              "{PROJECTS[0].feedback.quote}"
            </p>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-brand-accent">
                {PROJECTS[0].feedback.author[0]}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">{PROJECTS[0].feedback.author}</h4>
                <p className="text-zinc-500 text-xs">{PROJECTS[0].feedback.role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNOLOGY STACK --- */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Platform Power</span>
            <h2 className="text-3xl sm:text-4xl font-bold">Our Solid Technology Stack</h2>
            <p className="text-zinc-500 text-sm mt-3">We write modern code using lightweight standards optimized for performance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECH_STACK.map((tech) => (
              <div key={tech.category} className="glass-card p-6 sm:p-8 rounded-[2rem]">
                <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase border-b border-zinc-800 pb-2">
                  {tech.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tech.items.map((item) => (
                    <span key={item} className="text-xs font-semibold bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LATEST INSIGHTS / BLOG SECTION --- */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Academy Blogs</span>
              <h2 className="text-3xl sm:text-4xl font-bold">Latest Industry Insights</h2>
            </div>
            <button 
              onClick={() => setView("blog")}
              className="text-sm font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-2 group cursor-pointer"
            >
              View all insights
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogsList.slice(0, 3).map((blog) => (
              <div 
                key={blog.id}
                onClick={() => setView("blog")}
                className="group glass-card rounded-[2rem] overflow-hidden hover:scale-[1.02] hover:border-brand-primary/30 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="relative h-44 overflow-hidden shrink-0 bg-zinc-900">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-zinc-950/80 border border-brand-primary/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold text-brand-primary uppercase tracking-wider">
                    {blog.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-semibold mb-2">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span>{blog.date}</span>
                    {blog.readTime && (
                      <>
                        <span>•</span>
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{blog.readTime}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-2 mb-3 leading-snug">{blog.title}</h3>
                  <p className="text-zinc-500 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">{blog.excerpt}</p>
                  <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-900/80 mt-auto">
                    <img src={blog.author.image} alt={blog.author.name} className="w-6 h-6 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div>
                      <span className="text-[10px] font-bold text-zinc-300 block leading-none">{blog.author.name}</span>
                      <span className="text-[8px] text-zinc-500">{blog.author.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HERO RECRUITMENT CALL TO ACTION --- */}
      <section className="px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-primary/20 via-brand-secondary/5 to-zinc-950 border border-white/10 rounded-[3rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* Flare */}
          <div className="absolute top-1/2 -right-1/4 w-[300px] h-[300px] bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">We are hiring</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Join Our Elite Team.</h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8">
              We seek visionary developers, visual designers, and content experts. Elevate your tech career inside Nassarawa State's top creative hub.
            </p>
            <button 
              onClick={() => setView("careers")}
              className="bg-white text-zinc-950 hover:bg-zinc-100 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Browse Careers <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
