import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  Send, 
  User, 
  ExternalLink, 
  Loader2, 
  ArrowLeft, 
  Search, 
  Share2, 
  Twitter, 
  Linkedin, 
  Link2, 
  Check, 
  DollarSign, 
  Award, 
  Clock, 
  Sparkles,
  ChevronRight,
  Shield,
  ThumbsUp,
  Compass
} from "lucide-react";
import { getJobs, saveJobApplication } from "../lib/db";
import { JobOpening } from "../types";

export default function CareersView() {
  const [jobsList, setJobsList] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Application form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    note: ""
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Share copy states
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const jobs = await getJobs();
        setJobsList(jobs);
      } catch (err) {
        console.error("Failed to fetch job openings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && selectedJob) {
      setIsSubmitting(true);
      try {
        await saveJobApplication({
          jobId: selectedJob.id,
          jobTitle: selectedJob.title,
          name: formData.name,
          email: formData.email,
          portfolio: formData.portfolio,
          note: formData.note
        });
        setFormSuccess(true);
        setTimeout(() => {
          setFormSuccess(false);
          setFormData({ name: "", email: "", portfolio: "", note: "" });
        }, 4000);
      } catch (error) {
        console.error("Failed to submit job application:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Extract unique departments for filters
  const departments = ["All", ...Array.from(new Set((jobsList || []).map(j => j.department)))];

  // Filtering logic
  const filteredJobs = (jobsList || []).filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Share functionality trigger
  const handleShare = () => {
    if (!selectedJob) return;
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (navigator.share) {
      navigator.share({
        title: `${selectedJob.title} at Nexlify Innovation`,
        text: `We are hiring a ${selectedJob.title}! Check out the requirements and apply here.`,
        url: shareUrl
      }).catch(() => {});
    }
  };

  return (
    <div className="pt-24 sm:pt-36 pb-16 px-4 sm:px-6 max-w-7xl mx-auto" id="careers-view-container">
      <AnimatePresence mode="wait">
        {!selectedJob ? (
          // LIST VIEW
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-16"
          >
            {/* Careers Page Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-850 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Join Nexlify Creative Hub</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Shape the Digital <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Future</span>.
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                Help us foster regional digital literacy and build premium software architectures. We are always seeking talented engineers, brand designers, and digital managers.
              </p>
            </div>

            {/* Careers Content & Filters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Filter panel & Info */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
                
                {/* Search & Categories Box */}
                <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-none space-y-6">
                  <h3 className="text-white font-extrabold text-xs uppercase tracking-wider border-b border-zinc-900 pb-2">
                    Search & Filter
                  </h3>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="text"
                      placeholder="Search roles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-brand-primary text-xs text-white placeholder-zinc-600 focus:outline-none transition-all rounded-none"
                    />
                  </div>

                  {/* Department Filter list */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                      Departments
                    </label>
                    <div className="flex flex-wrap lg:flex-col gap-1.5">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => setSelectedDept(dept)}
                          className={`px-3 py-2 rounded-none text-left text-[10px] font-bold uppercase tracking-wider transition-all border w-full flex items-center justify-between ${
                            selectedDept === dept
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-zinc-900/20 text-zinc-500 border-transparent hover:text-white hover:bg-zinc-900/60"
                          }`}
                        >
                          <span>{dept}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-65" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Culture highlights widget */}
                <div className="p-6 bg-gradient-to-br from-brand-primary/10 via-brand-secondary/5 to-zinc-950 border border-zinc-900 rounded-none space-y-4">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-primary" /> Nexlify Ecosystem
                  </h4>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    We offer continuous creative mentorship programs, high-growth digital assignments, hybrid flexibility, and direct profit-share opportunities.
                  </p>
                </div>

              </div>

              {/* Right Column: Positions List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <h3 className="text-white font-extrabold text-xs uppercase tracking-widest">
                    Available Positions ({filteredJobs.length})
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Nassarawa State Hub & Remote</span>
                </div>

                {loading ? (
                  <div className="space-y-4" id="careers-skeletons">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="animate-pulse bg-zinc-950/40 border border-zinc-900 p-6 space-y-3">
                        <div className="h-5 bg-zinc-900 w-1/3" />
                        <div className="h-4 bg-zinc-900 w-2/3" />
                        <div className="flex gap-4">
                          <div className="h-3 bg-zinc-800 w-16" />
                          <div className="h-3 bg-zinc-800 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="group p-6 bg-zinc-950/30 border border-zinc-900 hover:border-brand-primary/40 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-none relative overflow-hidden"
                      >
                        {/* Interactive accent indicator on card hover */}
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="space-y-2 min-w-0 flex-grow">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                              {job.department}
                            </span>
                            <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-400">
                              {job.type}
                            </span>
                          </div>
                          
                          <h3 className="text-white font-extrabold text-base sm:text-lg group-hover:text-brand-primary transition-colors tracking-tight">
                            {job.title}
                          </h3>
                          
                          <p className="text-zinc-500 text-xs line-clamp-1 leading-relaxed">
                            {job.description}
                          </p>

                          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-semibold pt-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                            <span>{job.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-[10px] font-black uppercase tracking-wider text-brand-primary group-hover:translate-x-1 transition-transform">
                          <span>View Position</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}

                    {filteredJobs.length === 0 && (
                      <div className="text-center py-12 border border-zinc-900 bg-zinc-950/10">
                        <p className="text-zinc-500 text-xs">No active positions match your criteria.</p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedDept("All");
                          }}
                          className="mt-3 text-brand-primary hover:underline text-xs font-bold"
                        >
                          Clear filters & search
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Culture / Values grid block */}
            <section className="bg-zinc-950/20 border border-zinc-900 p-8 sm:p-12 rounded-none max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
                <div className="space-y-4">
                  <span className="text-brand-primary font-bold text-[10px] uppercase tracking-[0.25em] block">Our Culture</span>
                  <h3 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">An Environment of Constant Growth</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    We do not believe in rigid corporate micro-management. At Nexlify Innovation, we provide the autonomy, state-of-the-art workstation layout spaces, and direct software leadership to help you expand your technical expertise.
                  </p>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Whether working hybridly or in our physical Nassarawa studio rooms, you will collaborate with creative minds pushing the bounds of regional digital excellence.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-zinc-950/80 rounded-none border border-zinc-900 text-left space-y-1">
                    <span className="text-white font-black text-sm block">Hybrid Freedom</span>
                    <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Flexibility Assured</span>
                  </div>
                  <div className="p-5 bg-zinc-950/80 rounded-none border border-zinc-900 text-left space-y-1">
                    <span className="text-white font-black text-sm block">Elite Tech Hardware</span>
                    <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Equipment Allowance</span>
                  </div>
                  <div className="p-5 bg-zinc-950/80 rounded-none border border-zinc-900 text-left space-y-1">
                    <span className="text-white font-black text-sm block">Paid Annual Leave</span>
                    <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Worry-free Rest</span>
                  </div>
                  <div className="p-5 bg-zinc-950/80 rounded-none border border-zinc-900 text-left space-y-1">
                    <span className="text-white font-black text-sm block">Profit Shares</span>
                    <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Project Incentives</span>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          // JOB DETAILS VIEW (THE CAREERS DETAILS PAGE!)
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10 max-w-6xl mx-auto"
          >
            {/* Back to Careers trigger */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setFormSuccess(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Job Openings
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-none text-[10px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Recruitment Ongoing</span>
              </div>
            </div>

            {/* Role Header */}
            <div className="space-y-4 border-b border-zinc-900 pb-8">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  {selectedJob.department}
                </span>
                <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-400">
                  {selectedJob.type}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                {selectedJob.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-500">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-zinc-600" /> {selectedJob.location}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-zinc-600" /> Remote/Hybrid</span>
              </div>
            </div>

            {/* Dynamic Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              {/* Left Column (8 cols): Primary details & Inline application form */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* About the role */}
                <div className="space-y-4">
                  <h3 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <Compass className="w-5 h-5 text-brand-primary" /> About the Position
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements / Who you are */}
                <div className="space-y-4">
                  <h3 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <Shield className="w-5 h-5 text-brand-primary" /> Requirements / Who You Are
                  </h3>
                  <ul className="space-y-3.5">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                        <span className="text-zinc-300 text-sm leading-relaxed font-medium">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What we offer / Benefits */}
                <div className="space-y-4">
                  <h3 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <ThumbsUp className="w-5 h-5 text-brand-primary" /> What We Offer & Benefits
                  </h3>
                  <ul className="space-y-3.5">
                    {selectedJob.benefits.map((ben, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="p-0.5 rounded-full bg-brand-primary/10 text-brand-primary mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        </div>
                        <span className="text-zinc-400 text-sm leading-relaxed font-medium">{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inline Application Form Section */}
                <div className="pt-8 border-t border-zinc-900" id="application-form-block">
                  <div className="space-y-6 bg-zinc-950/60 border border-zinc-900 p-6 sm:p-10 rounded-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-brand-primary" />
                        <h3 className="text-lg font-black text-white tracking-tight">Apply For This Position</h3>
                      </div>
                      <p className="text-zinc-500 text-xs mb-8">
                        Complete our simplified candidate application to submit your portfolio straight to our development directors.
                      </p>

                      <AnimatePresence mode="wait">
                        {!formSuccess ? (
                          <motion.form
                            key="apply-form"
                            onSubmit={handleApplySubmit}
                            className="space-y-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Full Name *</label>
                                <div className="relative">
                                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Professional Email *</label>
                                <div className="relative">
                                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Portfolio / GitHub Link *</label>
                              <div className="relative">
                                <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                  type="url"
                                  required
                                  placeholder="e.g. https://myportfolio.com"
                                  value={formData.portfolio}
                                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-850 rounded-none text-xs placeholder-zinc-700 text-white focus:border-brand-primary focus:outline-none transition-all"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Key Expertise & Core Stack Pitch</label>
                              <textarea
                                rows={4}
                                placeholder="Highlight your expertise, preferred technical stacks, and why you are excited to join Nexlify..."
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-850 rounded-none text-xs placeholder-zinc-700 text-white focus:border-brand-primary focus:outline-none transition-all resize-none"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-brand-primary/10"
                            >
                              {isSubmitting ? (
                                <>Submitting Application <Loader2 className="w-4 h-4 animate-spin" /></>
                              ) : (
                                <>Submit Candidacy <Send className="w-3.5 h-3.5" /></>
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
                            <div className="w-12 h-12 bg-brand-primary/15 text-brand-primary rounded-full flex items-center justify-center mx-auto border border-brand-primary/30">
                              <CheckCircle2 className="w-6 h-6 animate-bounce" />
                            </div>
                            <h4 className="text-white font-extrabold text-base uppercase tracking-wider">Application Received!</h4>
                            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
                              Thank you, {formData.name}. Your details and portfolio are safely locked into our candidate tracking directory. Our creative directors will review your work and reach out to you within 3 business days.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Column (4 cols): Sticky Sidebar fact sheet & Share career opening */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
                
                {/* Fast Summary panel */}
                <div className="p-6 bg-zinc-950/30 border border-zinc-900 rounded-none space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-2">
                    Job Specifications
                  </h4>
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Status</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Recruiting
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Department</span>
                      <span className="text-white font-bold">{selectedJob.department}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Job Type</span>
                      <span className="text-white font-bold">{selectedJob.type}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Location</span>
                      <span className="text-zinc-300 font-bold text-right">{selectedJob.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-zinc-900">
                      <span className="text-zinc-500">Compensation</span>
                      <span className="text-brand-primary font-extrabold">Competitive Pay</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const formBlock = document.getElementById("application-form-block");
                      if (formBlock) {
                        formBlock.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full py-2.5 mt-2 bg-brand-primary text-white font-bold text-[10px] uppercase tracking-wider text-center rounded-none hover:bg-brand-primary/95 transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Share Career opening widget */}
                <div className="p-6 bg-zinc-950/30 border border-zinc-900 rounded-none space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-2">
                    Share Opening
                  </h4>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">
                    Know someone who'd be an exceptional fit? Forward this opportunity to your network.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=We're hiring a ${encodeURIComponent(selectedJob.title)} at @nexlify! Check it out: &url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-2.5 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white hover:border-brand-primary transition-colors text-xs font-bold rounded-none"
                    >
                      <Twitter className="w-3.5 h-3.5" /> Twitter
                    </a>

                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-2.5 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white hover:border-brand-primary transition-colors text-xs font-bold rounded-none"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  </div>

                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 p-2.5 bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white hover:border-brand-primary transition-all text-xs font-extrabold uppercase tracking-wider rounded-none cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                        <span className="text-emerald-500">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Copy URL Address</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Cultural statements sidebar bullet points */}
                <div className="p-6 bg-zinc-950/20 border border-zinc-900 rounded-none space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-2">
                    Why Nexlify Hub?
                  </h4>
                  <ul className="space-y-3.5 text-xs text-zinc-400">
                    <li className="flex gap-2 items-start">
                      <span className="w-1 h-1 bg-brand-primary rounded-full mt-2 shrink-0" />
                      <span>Direct mentoring under professional senior software architects</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="w-1 h-1 bg-brand-primary rounded-full mt-2 shrink-0" />
                      <span>Dedicated tech workstation allowance and hardware budget</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="w-1 h-1 bg-brand-primary rounded-full mt-2 shrink-0" />
                      <span>Hybrid work freedom (flexible home/office hours)</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
