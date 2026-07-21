import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Award, Laptop, Smartphone, HelpCircle, MessageSquare, ArrowRight, Video } from "lucide-react";
import { getCourses } from "../lib/db";
import { Course } from "../types";
import { FAQs } from "../data";

export default function TrainingView() {
  const [coursesList, setCoursesList] = React.useState<Course[]>([]);

  React.useEffect(() => {
    async function load() {
      try {
        const list = await getCourses();
        setCoursesList(list);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    }
    load();
  }, []);

  return (
    <div className="pt-24 sm:pt-36 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-24 sm:space-y-32">
      
      {/* Academy display header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 backdrop-blur-md mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nexlify Academy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Professional <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Training</span> Programs.
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Unlock highly lucrative digital roles. Learn high-demand graphic design, frontend engineering, and backend cloud systems directly from practicing developers.
        </p>
      </div>

      {/* Courses Pricing / Modules layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(coursesList.length > 0 ? coursesList : []).map((course) => {
          const isFeatured = course.id === "frontend-dev";
          return (
            <div
              key={course.id}
              className={`group relative p-6 sm:p-8 rounded-[2rem] border transition-all duration-500 flex flex-col h-full ${
                isFeatured
                  ? "bg-zinc-900/90 border-brand-primary/45 shadow-2xl shadow-brand-primary/5 ring-1 ring-brand-primary/20"
                  : "glass-card hover:border-zinc-700 hover:shadow-xl"
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-4 right-6 bg-brand-primary text-white text-[10px] uppercase font-black px-4 py-1.5 rounded-full tracking-widest shadow-lg shadow-brand-primary/25 flex items-center gap-1">
                  <Award className="w-3 h-3 animate-pulse" /> Popular Choice
                </div>
              )}

              {/* Class Header */}
              <div className="mb-6">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">{course.duration}</span>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{course.title}</h3>
                
                <div className="flex items-baseline gap-1.5 pt-2">
                  <span className="text-4xl font-extrabold tracking-tight text-white">₦{course.price}</span>
                  <span className="text-zinc-500 text-xs font-semibold uppercase">/ program</span>
                </div>
              </div>

              {/* Syllabus / Features */}
              <div className="space-y-4 flex-grow mb-8 pt-6 border-t border-zinc-850">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Program Syllabus</span>
                {course.features.map((feat, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="p-0.5 rounded-full bg-brand-primary/15 text-brand-primary shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-zinc-400 text-xs leading-relaxed font-medium">{feat}</span>
                  </div>
                ))}

                {/* Prerequisites block */}
                <div className="pt-4 border-t border-zinc-850/60 mt-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Technical Prerequisite</span>
                  {course.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-3.5 py-2 bg-zinc-950/50 rounded-xl border border-zinc-850">
                      {req.toLowerCase().includes("laptop") ? <Laptop className="w-4 h-4 text-zinc-400" /> : <Smartphone className="w-4 h-4 text-zinc-400" />}
                      <span className="text-[11px] font-bold text-zinc-300">{req}</span>
                    </div>
                  ))}
                </div>

                {/* Mentors list */}
                <div className="pt-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Assigned Instructors</span>
                  <p className="text-[11px] text-zinc-400 font-semibold">{(course.mentors || []).join(" • ")}</p>
                </div>
              </div>

              {/* Enroll Button link */}
              <a
                href={`https://wa.me/2349074026805?text=Hello%20Nexlify%20Academy,%20I%20want%20to%20enroll%20in%20the%20${encodeURIComponent(course.title)}%20program.`}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group/btn w-full py-4 rounded-2xl text-center font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 overflow-hidden shadow-lg ${
                  isFeatured
                    ? "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-brand-primary/15"
                    : "bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white"
                }`}
              >
                Secure Your Spot
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Academy Perks block */}
      <section className="glass-card p-8 sm:p-12 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10 max-w-xl mx-auto">
          <span className="text-brand-secondary font-bold text-xs uppercase tracking-[0.2em] block mb-2">The Nexlify Standard</span>
          <h3 className="text-white font-bold text-2xl tracking-tight">Why Study Inside Our Academy?</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Video, t: "Recorded Video Playbacks", d: "Never worry about missing a session. High-definition screen captures of all class sessions are archived for your instant lifetime review." },
            { icon: Award, t: "Graduation Certification", d: "Acquire a formal industry-recognized verification of course completion to back your technical portfolio during corporate applications." },
            { icon: MessageSquare, t: "Real-World Project Labs", d: "Gain direct team exposure by collaborating on active, deployed creative projects built for real agency clients." },
            { icon: Laptop, t: "Ongoing Career Support", d: "Receive personalized visual portfolio audits, direct resume optimizations, and soft placement introductions into partner companies." }
          ].map((perk, i) => (
            <div key={i} className="space-y-3">
              <div className="p-3 bg-zinc-950/80 border border-white/5 rounded-2xl text-brand-secondary w-fit">
                <perk.icon className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold text-sm">{perk.t}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{perk.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ sub-module */}
      <section className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Support desk</span>
          <h3 className="text-white font-bold text-2xl tracking-tight">Academy FAQs</h3>
        </div>

        <div className="space-y-4">
          {FAQs.map((faq, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl">
              <div className="flex gap-3 items-start">
                <HelpCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base mb-1.5">{faq.q}</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
