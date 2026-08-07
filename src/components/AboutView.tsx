import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Award, Heart, Shield, Users, Target, Rocket, Sparkles, Twitter, Instagram } from "lucide-react";
import { getAboutPageData, getTeamMembers } from "../lib/db";
import { TeamMember, AboutPageData } from "../types";

const TikTokIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 0 0-3.32.92 6.34 6.34 0 0 0-2.8 5.23 6.34 6.34 0 0 0 6.33 6.33c3.5 0 6.33-2.83 6.33-6.33V9a8.16 8.16 0 0 0 4.78 1.53V7.08a4.85 4.85 0 0 1-1.21-.39z"/>
  </svg>
);

export default function AboutView() {
  const [aboutData, setAboutData] = React.useState<AboutPageData | null>(null);
  const [teamList, setTeamList] = React.useState<TeamMember[]>([]);

  React.useEffect(() => {
    async function load() {
      try {
        const ad = await getAboutPageData();
        setAboutData(ad);
        const tm = await getTeamMembers();
        setTeamList(tm);
      } catch (err) {
        console.error("Failed to load about page dynamic texts:", err);
      }
    }
    load();
  }, []);

  const values = [
    { icon: Heart, title: "Empathy & Support", desc: "We actively foster digital access, giving everyone tailored assistance." },
    { icon: Shield, title: "Craftsmanship", desc: "Every line of code is optimized, clean, and architected for high speed." },
    { icon: Users, title: "Collaboration", desc: "We act as real digital partners to accelerate your business goals." },
    { icon: Target, title: "Precision Outcomes", desc: "We do not guess. We trace our strategies directly to measurable revenue leaps." }
  ];

  const milestones = [
    { year: "2021", title: "Founding & Blueprint", desc: "Nexlify Innovation was set up in Nassarawa State with a core mission of digital empowerment." },
    { year: "2023", title: "Academy Expansion", desc: "Over 500 graduates trained across Nigeria, launching careers with 100% laptop ratios." },
    { year: "2025", title: "Enterprise Shift", desc: "Re-engineered core software services, launching custom SaaS tools globally." },
    { year: "2026", title: "Scale & Future Vision", desc: "Empowering tech hubs and advancing AI-powered enterprise software across Africa." }
  ];

  const displayTitle = aboutData?.title || "Innovating From The Heart of Nigeria.";
  const displayStory = aboutData?.story || "Nexlify Innovation is a premier digital services agency and training hub headquartered in Nassarawa State. We believe high-quality technological solutions and elite digital literacy should be globally accessible.";
  const displayDesc = aboutData?.description || "We blend visual design craftsmanship with robust software engineering to build scalable systems. Beyond our corporate consulting, we lead hands-on mentoring bootcamps, shaping the next generation of engineers and designers.";
  const displayVision = aboutData?.vision || "To build Nigeria's #1 digital powerhouse, bridging regional talent with the global software economy.";
  const displayMission = aboutData?.mission || "To provide elite, secure software products and world-class structured training resources for scale-ups.";
  
  const displayFutureTitle = aboutData?.futureTitle || "Building The Future Tech Ecosystem";
  const displayFutureDesc = aboutData?.futureDesc || "We are aggressively scaling our training program capacities to deliver highly advanced cloud technologies, database operations, and deep learning neural designs directly to Nigeria's creative community. Our long-term focus lies in deploying fully autonomous systems that operate securely across low-bandwidth environments.";
  const displayFutureMetricCount = aboutData?.futureMetricCount || "1,000+";
  const displayFutureMetricTitle = aboutData?.futureMetricTitle || "Empowered Graduates";
  const displayFutureMetricSubtitle = aboutData?.futureMetricSubtitle || "Projected for 2027";

  return (
    <div className="pt-24 sm:pt-36 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-24 sm:space-y-32">
      
      {/* Visual Header Page */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 backdrop-blur-md mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {displayTitle}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 font-medium">
            {displayStory}
          </p>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-8">
            {displayDesc}
          </p>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-8">
            {displayDesc}
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-900">
            <div>
              <div className="flex items-center gap-2 text-brand-primary font-bold mb-2">
                <Target className="w-4 h-4" />
                <h4 className="text-white text-sm font-bold">Our Vision</h4>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {displayVision}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-brand-secondary font-bold mb-2">
                <Rocket className="w-4 h-4" />
                <h4 className="text-white text-sm font-bold">Our Mission</h4>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {displayMission}
              </p>
            </div>
          </div>
        </div>

        {/* Floating Side Showcase */}
        <div className="relative mt-8 lg:mt-0">
          <div className="aspect-square bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl relative">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
              alt="Team Collaboration" 
              className="w-full h-full object-cover opacity-70 filter saturate-[0.85]"
              referrerPolicy="no-referrer"
            />
            {/* Soft inner shadow reflection */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
          </div>
          <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-brand-primary p-6 sm:p-8 rounded-[2rem] text-white shadow-2xl border border-white/10 hover:scale-[1.03] transition-transform duration-300">
            <p className="text-4xl sm:text-5xl font-black">5+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Years of Creative Service</p>
          </div>
        </div>
      </div>

      {/* --- VISIONARY VALUES SECTION --- */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-brand-accent font-bold text-xs uppercase tracking-[0.2em] block mb-2">Corporate Pillars</span>
          <h2 className="text-3xl font-bold">Values That Guide Us</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="glass-card p-6 sm:p-8 rounded-[2rem] hover:bg-zinc-900/40 transition-all duration-300">
              <div className="p-3 bg-zinc-950/80 border border-white/5 text-brand-primary rounded-2xl w-fit mb-5">
                <v.icon className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold text-base mb-2">{v.title}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- TIMELINE HISTORIC ROADMAP --- */}
      <section className="space-y-12 relative">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">History</span>
          <h2 className="text-3xl font-bold">Nexlify's Growth Timeline</h2>
        </div>

        <div className="relative border-l border-zinc-800 max-w-2xl mx-auto pl-6 sm:pl-10 space-y-12">
          {milestones.map((m) => (
            <div key={m.year} className="relative group">
              {/* Pulsing indicator node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-brand-primary flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full group-hover:scale-125 transition-transform" />
              </div>

              <div>
                <span className="text-brand-primary font-black text-xl sm:text-2xl tracking-tighter block mb-1">
                  {m.year}
                </span>
                <h4 className="text-white font-bold text-sm sm:text-base mb-1.5">
                  {m.title}
                </h4>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- EXECUTIVE TEAM PROFILES --- */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-brand-secondary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Leadership</span>
          <h2 className="text-3xl font-bold">The Nexlify Minds</h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-3">The developers, creative strategists, and authors driving our solutions.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(teamList.length > 0 ? teamList : []).map((member) => (
            <div key={member.name} className="group glass-card p-5 rounded-[2.5rem] hover:scale-[1.02] hover:border-brand-primary/25 transition-all duration-300">
              <div className="aspect-[4/5] bg-zinc-900 rounded-[2rem] overflow-hidden mb-6 relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
              </div>
              <div className="text-center px-2 space-y-2">
                <h4 className="text-lg font-bold text-white tracking-tight">{member.name}</h4>
                <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest block mt-0.5 mb-2">{member.role}</span>
                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
                  {member.bio}
                </p>

                {/* Social Channels */}
                {member.socials && (
                  <div className="flex justify-center items-center gap-2 pt-2">
                    {member.socials.tiktok && (
                      <a href={member.socials.tiktok} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors" title="TikTok (@nexlifyinnovation)">
                        <TikTokIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors" title="Instagram (@nexlify_innovation)">
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors" title="Twitter / X (@NexlifyInn55)">
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FUTURE COGNITIVE GOALS SECTION --- */}
      <section className="bg-zinc-900/30 p-8 sm:p-12 rounded-[2.5rem] border border-zinc-850">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <span className="text-brand-accent font-bold text-xs uppercase tracking-[0.2em] block mb-2">Road Ahead</span>
            <h3 className="text-white font-bold text-2xl tracking-tight mb-4">{displayFutureTitle}</h3>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
              {displayFutureDesc}
            </p>
          </div>
          <div className="p-6 bg-zinc-950/60 rounded-2xl border border-white/5 flex flex-col justify-center text-center">
            <span className="text-brand-accent font-black text-4xl block">{displayFutureMetricCount}</span>
            <span className="text-white font-bold text-xs uppercase tracking-widest mt-1">{displayFutureMetricTitle}</span>
            <span className="text-zinc-600 text-[10px] mt-0.5">{displayFutureMetricSubtitle}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
