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
  ArrowRight,
  Instagram,
  Twitter,
  ExternalLink
} from "lucide-react";
import { saveContactMessage } from "../lib/db";
import { FAQs } from "../data";

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 0 0-3.32.92 6.34 6.34 0 0 0-2.8 5.23 6.34 6.34 0 0 0 6.33 6.33c3.5 0 6.33-2.83 6.33-6.33V9a8.16 8.16 0 0 0 4.78 1.53V7.08a4.85 4.85 0 0 1-1.21-.39z"/>
  </svg>
);

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

      {/* Dynamic WhatsApp Inquiries Highlight Card */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-none border border-brand-primary/30 bg-brand-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4 flex-col sm:flex-row">
          <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12.004 0C5.385 0 0 5.385 0 12.004c0 2.115.546 4.179 1.587 6.002L.057 24l6.357-1.666A11.96 11.96 0 0012.004 24c6.619 0 12.004-5.385 12.004-12.004S18.623 0 12.004 0zM17.65 14.542c-.297-.149-1.761-.869-2.033-.969-.272-.099-.47-.148-.668.149-.198.297-.768.969-.942 1.168-.173.198-.347.223-.644.074-.297-.149-1.256-.463-2.392-1.477-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Fast-Track WhatsApp Inquiry</h4>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xl">
              Need immediate answers? You can chat with our team on <span className="text-green-400 font-bold">WhatsApp</span> for instant service consults and dynamic pricing!
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/2349074026805?text=Hello%20Nexlify,%20I%20want%20to%20make%20an%20inquiry%20regarding%20your%20services!"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/15 shrink-0"
        >
          <span>Chat on WhatsApp</span>
        </a>
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

              {/* Official Social Media Channels Card */}
              <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-none space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <h4 className="text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> Official Social Channels
                  </h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary px-2 py-0.5 border border-brand-primary/20">
                    Verified Accounts
                  </span>
                </div>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Follow Nexlify Innovation across our 3 official social media channels for real-time announcements and showcase drops:
                </p>
                <div className="space-y-2 pt-1">
                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@nexlifyinnovation?is_from_webapp=1&sender_device=pc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-zinc-900/90 border border-zinc-800 hover:border-pink-500/40 hover:bg-zinc-850 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
                        <TikTokIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">TikTok</span>
                        <span className="text-[10px] text-zinc-500 font-medium">@nexlifyinnovation</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-pink-400 transition-colors" />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/nexlify_innovation?igsh=dXVreWgzaDUzcnhy&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-850 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">Instagram</span>
                        <span className="text-[10px] text-zinc-500 font-medium">@nexlify_innovation</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                  </a>

                  {/* Twitter / X */}
                  <a
                    href="https://twitter.com/NexlifyInn55"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/40 hover:bg-zinc-850 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                        <Twitter className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">Twitter / X</span>
                        <span className="text-[10px] text-zinc-500 font-medium">@NexlifyInn55</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-sky-400 transition-colors" />
                  </a>
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
