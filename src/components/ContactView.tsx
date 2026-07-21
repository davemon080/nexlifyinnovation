import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  User, 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  Check, 
  Copy,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { saveContactMessage } from "../lib/db";
import { FAQs } from "../data";

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for copy feedback
  const [emailCopied, setEmailCopied] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);

  // FAQ accordion state
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitting(true);
      try {
        await saveContactMessage({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
        setFormSuccess(true);
        setTimeout(() => {
          setFormSuccess(false);
          setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
        }, 4000);
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const copyToClipboard = (text: string, type: "email" | "whatsapp") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } else {
      setWhatsappCopied(true);
      setTimeout(() => setWhatsappCopied(false), 2000);
    }
  };

  const subjects = ["General Inquiry", "SaaS Custom Build", "Branding Design", "Academy Enrollment"];

  return (
    <div className="pt-24 sm:pt-36 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-20" id="contact-view-container">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-850 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Get In Touch</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
          Let's Start something <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Exceptional</span>.
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Have an inquiry about customized software solutions, branding architectures, or joining our next training academy intake? Send a brief message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column (5 cols): Office Channels & Beautiful Interactive FAQs Accordion */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Direct channels */}
          <div className="p-6 sm:p-8 bg-zinc-950/40 border border-zinc-900 rounded-none space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">Direct Channels</span>
              <h3 className="text-white font-extrabold text-lg tracking-tight">Direct Connections</h3>
            </div>

            <div className="space-y-4">
              {/* WhatsApp Card */}
              <div className="p-4 bg-zinc-950/80 border border-zinc-900 hover:border-brand-primary/25 transition-all group flex items-start gap-4 rounded-none relative">
                <div className="p-2.5 bg-green-500/10 text-green-500 shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5 fill-green-500/10" />
                </div>
                <div className="min-w-0 flex-grow">
                  <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Direct Chat on WhatsApp</h4>
                  <p className="text-zinc-400 text-xs mt-1 font-bold">+234 907 402 6805</p>
                  <span className="text-[10px] text-zinc-600 block mt-1 uppercase tracking-wider font-semibold">Average response: 5 mins</span>
                  
                  <div className="flex gap-2 mt-3 pt-2 border-t border-zinc-900/60">
                    <a 
                      href="https://wa.me/2349074026805?text=Hello%20Nexlify%20Innovation,%20I%27m%20interested%20in%20your%20services."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase text-brand-primary hover:underline inline-flex items-center gap-1"
                    >
                      Open Chat <ArrowRight className="w-3 h-3" />
                    </a>
                    <button 
                      onClick={() => copyToClipboard("+2349074026805", "whatsapp")}
                      className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white ml-auto flex items-center gap-1"
                    >
                      {whatsappCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{whatsappCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Support Card */}
              <div className="p-4 bg-zinc-950/80 border border-zinc-900 hover:border-brand-primary/25 transition-all group flex items-start gap-4 rounded-none relative">
                <div className="p-2.5 bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Official Email Support</h4>
                  <p className="text-zinc-400 text-xs mt-1 font-bold">nexlifyinnovation@gmail.com</p>
                  <span className="text-[10px] text-zinc-600 block mt-1 uppercase tracking-wider font-semibold">Average response: 3 hours</span>
                  
                  <div className="flex gap-2 mt-3 pt-2 border-t border-zinc-900/60">
                    <a 
                      href="mailto:nexlifyinnovation@gmail.com"
                      className="text-[10px] font-black uppercase text-brand-primary hover:underline inline-flex items-center gap-1"
                    >
                      Draft Email <ArrowRight className="w-3 h-3" />
                    </a>
                    <button 
                      onClick={() => copyToClipboard("nexlifyinnovation@gmail.com", "email")}
                      className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white ml-auto flex items-center gap-1"
                    >
                      {emailCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{emailCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Physical Location Card */}
              <div className="p-4 bg-zinc-950/80 border border-zinc-900 flex items-start gap-4 rounded-none">
                <div className="p-2.5 bg-brand-secondary/10 text-brand-secondary shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Nexlify Headquarters</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed font-bold">Nassarawa State, Nigeria</p>
                  <span className="text-[10px] text-zinc-600 block mt-1 uppercase tracking-wider font-semibold">Open Hours: 9:00 AM - 5:00 PM (GMT+1)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Upgraded Look Accordion Panel: Replacing the raw map with highly professional interactive FAQs */}
          <div className="p-6 sm:p-8 bg-zinc-950/40 border border-zinc-900 rounded-none space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">Immediate Answers</span>
              <h3 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-1.5">
                <HelpCircle className="w-5 h-5 text-brand-primary" /> FAQ Help Center
              </h3>
            </div>

            <div className="space-y-2 pt-2">
              {(FAQs || []).map((faq, idx) => {
                const isOpen = expandedFaqIdx === idx;
                return (
                  <div 
                    key={idx} 
                    className="border border-zinc-900 bg-zinc-950/50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIdx(isOpen ? null : idx)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-zinc-900/40 transition-colors"
                    >
                      <span className="text-white font-bold text-xs pr-4">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${isOpen ? "rotate-180 text-brand-primary" : ""}`} />
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
                          <p className="px-4 pb-4 text-zinc-400 text-xs leading-relaxed border-t border-zinc-900/40 pt-2 font-medium">
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

        </div>

        {/* Right Column (7 cols): Sleek Upgrade Contact Form panel */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 bg-zinc-950/40 border border-zinc-900 rounded-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">Message Box</span>
                <h3 className="text-white font-black text-2xl tracking-tight">Send Us a Direct Message</h3>
                <p className="text-zinc-500 text-xs">Fill out your details below and our team will reply within 12 business hours.</p>
              </div>

              <AnimatePresence mode="wait">
                {!formSuccess ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Your Name *</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. David Simon"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-850 rounded-none text-xs placeholder-zinc-700 text-white focus:border-brand-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Email input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input
                            type="email"
                            required
                            placeholder="e.g. david@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-850 rounded-none text-xs placeholder-zinc-700 text-white focus:border-brand-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interactive focus selector pills */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Project / Inquiry Focus</label>
                      <div className="flex flex-wrap gap-1.5">
                        {subjects.map((sub) => {
                          const isSelected = formData.subject === sub;
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setFormData({ ...formData, subject: sub })}
                              className={`px-3 py-2 rounded-none text-[9px] font-bold uppercase tracking-wider transition-all border relative overflow-hidden ${
                                isSelected
                                  ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/10"
                                  : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-800"
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Requirements textarea */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Describe Your Requirements *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Detail your digital custom build, target timeline, branding focus, or general inquiry requirements here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-850 rounded-none text-xs placeholder-zinc-700 text-white focus:border-brand-primary focus:outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-brand-primary/15"
                    >
                      {isSubmitting ? (
                        <>Sending Message <Loader2 className="w-4 h-4 animate-spin" /></>
                      ) : (
                        <>Send Message <Send className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="p-8 text-center space-y-4 bg-brand-primary/5 border border-brand-primary/20"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto border border-brand-primary/20">
                      <CheckCircle2 className="w-6 h-6 animate-bounce" />
                    </div>
                    <h4 className="text-white font-extrabold text-base uppercase tracking-wider">Message Sent Safely!</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
                      Thank you, {formData.name}. Your inquiry focus <span className="text-brand-primary font-bold">({formData.subject})</span> is logged in our communications manager. A Nexlify project strategist will reach out to you via email and WhatsApp within 12 hours.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
