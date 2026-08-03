import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, Phone, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { saveConsultation, getConsultations } from "../lib/db";

export default function BookConsultationView() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    brief: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for custom project focus & broad calendar clash check
  const [isCustomServiceSelected, setIsCustomServiceSelected] = useState(false);
  const [customService, setCustomService] = useState("");
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  
  // Broad calendar month/year tracker (start at current date)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Load existing records from DB to prevent double booking / clashing schedules
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await getConsultations();
        setExistingBookings(bookings || []);
      } catch (err) {
        console.error("Failed to load existing bookings:", err);
      }
    };
    fetchBookings();
  }, [bookingSuccess]);

  const services = [
    "Web Development",
    "Mobile App Custom build",
    "Custom Business ERP / CRM",
    "UI/UX Design Systems",
    "Academy Courses Consultation"
  ];

  // Calendar calculation helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    const today = new Date();
    if (currentYear === today.getFullYear() && currentMonth <= today.getMonth()) return;
    
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getLocalDateString = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const isPast = (dateStr: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    return dateStr < todayStr;
  };

  const isWeekend = (year: number, month: number, day: number) => {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };

  // Check if a slot is booked to enforce collision prevention
  const isSlotBooked = (dateStr: string, timeStr: string) => {
    return existingBookings.some(
      (b) => b.date === dateStr && b.time === timeStr && b.status !== "Cancelled"
    );
  };

  const times = ["09:00 AM", "11:30 AM", "01:30 PM", "03:30 PM"];

  const handleNext = () => {
    if (step === 1 && selectedService) setStep(2);
    else if (step === 2 && selectedDate && selectedTime) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.name && userData.email && userData.whatsapp) {
      setIsSubmitting(true);
      try {
        // Real-time final validation against clashes right before saving
        const isBooked = isSlotBooked(selectedDate, selectedTime);
        if (isBooked) {
          alert("Safety Alert: This specific time slot was just booked by another client. Please select a different slot.");
          setStep(2);
          setIsSubmitting(false);
          return;
        }

        await saveConsultation({
          name: userData.name,
          email: userData.email,
          whatsapp: userData.whatsapp,
          service: selectedService,
          date: selectedDate,
          time: selectedTime,
          brief: userData.brief
        });
        setBookingSuccess(true);
      } catch (error) {
        console.error("Booking failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Generate customized whatsapp link
  const getWhatsAppLink = () => {
    const msg = `Hello Nexlify! I've booked a ${selectedService} consultation session.\n\nDate: ${selectedDate}\nTime: ${selectedTime}\nName: ${userData.name}\nEmail: ${userData.email}\nBrief: ${userData.brief}`;
    return `https://wa.me/2349074026805?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="pt-24 sm:pt-36 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 backdrop-blur-md mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Live Scheduling</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Book <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Consultation</span>.
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
          Lock in a direct 1-on-1 strategy call with our core engineers to map out your architecture and project timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-2xl lg:max-w-5xl mx-auto">
        
        {/* Left Column (Why Book Info) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm space-y-6">
            <span className="text-brand-primary font-bold text-[9px] uppercase tracking-[0.25em] block">Diagnostic Workstation</span>
            <h3 className="text-white font-extrabold text-xl tracking-tight">Why consult with Nexlify lead engineers?</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-1 rounded-full bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs">Direct Architecture Scoping</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed">Map your technical database, custom schemas, and API integration paths directly with veteran builders.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start border-t border-zinc-900 pt-4">
                <div className="p-1 rounded-full bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs">Zero-Obligation Project Map</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed">Walk away with an expert technical assessment and recommendation proposal at absolutely zero cost.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start border-t border-zinc-900 pt-4">
                <div className="p-1 rounded-full bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs">Secure NDA Guarantee</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed">All concept specifications, proprietary code structures, and flow diagrams are protected by confidentiality protocols.</p>
                </div>
              </div>
            </div>

            {/* Instant WhatsApp Support Notice */}
            <div className="pt-4 border-t border-zinc-900 text-center space-y-3">
              <p className="text-[11px] text-zinc-400 font-medium">Need immediate response or custom schedules?</p>
              <a 
                href="https://wa.me/2349074026805?text=Hello%20Nexlify%20Innovation,%20I%20have%20an%20urgent%20booking%20or%20inquiry%20regarding%20consultations."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-brand-primary/40 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-green-500 fill-green-500/10" /> Chat With Us On WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (Wizard Scheduling card) */}
        <div className="lg:col-span-7 w-full">
          <AnimatePresence mode="wait">
          {!bookingSuccess ? (
            <motion.div
              key="wizard"
              className="glass-card p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {/* Wizard Steps Progress indicators */}
              <div className="flex items-center justify-between mb-8 border-b border-zinc-850 pb-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Step {step} of 3
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`w-5 h-1.5 rounded-full transition-all ${
                        s === step ? "bg-brand-primary w-8" : s < step ? "bg-brand-primary/50" : "bg-zinc-800"
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* Step 1: Select Service Focus */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-white font-bold text-base sm:text-lg mb-2">Select Your Project Focus</h3>
                  <div className="space-y-2.5">
                    {services.map((serv) => (
                      <button
                        key={serv}
                        type="button"
                        onClick={() => {
                          setSelectedService(serv);
                          setCustomService("");
                          setIsCustomServiceSelected(false);
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                          selectedService === serv && !isCustomServiceSelected
                            ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary"
                            : "bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                        }`}
                      >
                        {serv}
                        {selectedService === serv && !isCustomServiceSelected && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                      </button>
                    ))}

                    {/* Custom project focus selector button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomServiceSelected(true);
                        setSelectedService(customService);
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                        isCustomServiceSelected
                          ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary"
                          : "bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                      }`}
                    >
                      <span>Other / Custom Project Focus</span>
                      {isCustomServiceSelected && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                    </button>

                    {isCustomServiceSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-2"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Type your custom project focus (e.g. AI SaaS, Fintech Web App, etc.)"
                          value={customService}
                          onChange={(e) => {
                            setCustomService(e.target.value);
                            setSelectedService(e.target.value);
                          }}
                          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-850 rounded-xl text-xs placeholder-zinc-600 focus:border-brand-primary focus:outline-none text-white transition-all font-semibold"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date and Time slots */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h3 className="text-white font-bold text-base sm:text-lg">Choose Your Preferred Date</h3>
                      
                      {/* Month Navigation Control */}
                      <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-850 rounded-xl p-1 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="text-[11px] font-bold text-white px-1 select-none">
                          {monthNames[currentMonth]} {currentYear}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Broad Calendar Month Grid */}
                    <div className="bg-zinc-950/80 border border-zinc-850 rounded-2xl p-4 sm:p-5 space-y-3">
                      {/* Day Name Header */}
                      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-900">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>
                      
                      {/* Calendar days */}
                      <div className="grid grid-cols-7 gap-1.5">
                        {/* Day offset spacing */}
                        {Array.from({ length: firstDayOfMonth(currentYear, currentMonth) }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="aspect-square" />
                        ))}

                        {/* Valid Month Days */}
                        {Array.from({ length: daysInMonth(currentYear, currentMonth) }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const dateStr = getLocalDateString(currentYear, currentMonth, dayNum);
                          const isSel = selectedDate === dateStr;
                          const past = isPast(dateStr);
                          const weekend = isWeekend(currentYear, currentMonth, dayNum);
                          
                          // Day-level clash helper
                          const isFullyBooked = times.every(t => isSlotBooked(dateStr, t));

                          let btnClasses = "aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all border relative ";
                          let labelSub = "";
                          let isDisabled = false;

                          if (past) {
                            btnClasses += "bg-transparent border-transparent text-zinc-700 cursor-not-allowed";
                            isDisabled = true;
                          } else if (weekend) {
                            btnClasses += "bg-zinc-950/20 border-transparent text-zinc-600 cursor-not-allowed";
                            isDisabled = true;
                            labelSub = "WE";
                          } else if (isFullyBooked) {
                            btnClasses += "bg-red-950/10 border-red-900/30 text-red-500/70 cursor-not-allowed";
                            isDisabled = true;
                            labelSub = "FULL";
                          } else if (isSel) {
                            btnClasses += "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105 z-10";
                          } else {
                            btnClasses += "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800 hover:bg-zinc-900/80 cursor-pointer";
                          }

                          return (
                            <button
                              key={`day-${dayNum}`}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                setSelectedDate(dateStr);
                                setSelectedTime(""); // Reset selected slot when day changes
                              }}
                              className={btnClasses}
                              title={isFullyBooked ? "Fully Booked (Clash Prevented)" : weekend ? "Weekend" : ""}
                            >
                              <span>{dayNum}</span>
                              {labelSub && (
                                <span className={`text-[8px] font-black scale-90 mt-0.5 uppercase ${
                                  labelSub === "FULL" ? "text-red-500" : "text-zinc-600"
                                }`}>
                                  {labelSub}
                                </span>
                              )}
                              {!isDisabled && !isSel && existingBookings.some(b => b.date === dateStr && b.status !== "Cancelled") && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-850">
                    <h3 className="text-white font-bold text-base mb-4">Choose Time Slot (GMT+1)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {times.map((t) => {
                        const isSelected = selectedTime === t;
                        const isBooked = selectedDate ? isSlotBooked(selectedDate, t) : false;
                        
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={isBooked || !selectedDate}
                            onClick={() => setSelectedTime(t)}
                            className={`py-3 px-2 rounded-xl border text-center text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 min-h-[58px] ${
                              isBooked
                                ? "bg-zinc-950/20 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-60"
                                : isSelected
                                ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/15"
                                : "bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900/40 cursor-pointer"
                            }`}
                          >
                            <span>{t}</span>
                            {isBooked ? (
                              <span className="text-[7.5px] font-bold text-red-500 bg-red-950/20 px-1 py-0.5 rounded uppercase border border-red-900/30 leading-none">Booked</span>
                            ) : (
                              <span className="text-[7.5px] font-semibold text-zinc-500 opacity-60">Available</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Core Contact details & brief */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-white font-bold text-base sm:text-lg mb-2">Provide Your Project Information</h3>
                  
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          required
                          placeholder="David Simon"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs placeholder-zinc-600 focus:border-brand-primary focus:outline-none text-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Professional Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="email"
                          required
                          placeholder="example@gmail.com"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs placeholder-zinc-600 focus:border-brand-primary focus:outline-none text-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">WhatsApp Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="tel"
                          required
                          placeholder="+234..."
                          value={userData.whatsapp}
                          onChange={(e) => setUserData({ ...userData, whatsapp: e.target.value })}
                          className="w-full pl-10 pr-4 py-3.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs placeholder-zinc-600 focus:border-brand-primary focus:outline-none text-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Briefly Describe Your Needs</label>
                      <textarea
                        rows={3}
                        placeholder="Specify database integrations, wireframe scopes, API needs..."
                        value={userData.brief}
                        onChange={(e) => setUserData({ ...userData, brief: e.target.value })}
                        className="w-full px-4 py-3.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs placeholder-zinc-600 focus:border-brand-primary focus:outline-none text-white transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 mt-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-brand-primary/15 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>Consulting... <Loader2 className="w-4 h-4 animate-spin" /></>
                      ) : (
                        <>Book Free Session <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Navigation button control bar */}
              {step < 3 && (
                <div className="pt-6 border-t border-zinc-850 mt-6 flex justify-between gap-4">
                  <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                      step === 1 ? "text-zinc-700 cursor-not-allowed" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={(step === 1 && !selectedService) || (step === 2 && (!selectedDate || !selectedTime))}
                    className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      (step === 1 && !selectedService) || (step === 2 && (!selectedDate || !selectedTime))
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-brand-primary text-white hover:bg-brand-primary/95 shadow-md shadow-brand-primary/10"
                    }`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="glass-card p-8 sm:p-12 rounded-[2.5rem] shadow-2xl text-center space-y-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <h2 className="text-white font-bold text-2xl tracking-tight">Strategy Call Requested!</h2>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                Thank you, {userData.name}. Your strategy slot has been recorded safely inside our database systems.
              </p>

              {/* Quick Summary overview info */}
              <div className="max-w-md mx-auto p-4 bg-zinc-950/60 rounded-2xl border border-zinc-850 space-y-2 text-left">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-500">Service:</span>
                  <span className="text-white">{selectedService}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-500">Scheduled Date:</span>
                  <span className="text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-500">Scheduled Time:</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
              </div>

              {/* Instant Action CTA triggers */}
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/15"
                >
                  <MessageSquare className="w-4 h-4 fill-white/10" /> Sync On WhatsApp
                </a>
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedService("");
                    setSelectedDate("");
                    setSelectedTime("");
                    setUserData({ name: "", email: "", whatsapp: "", brief: "" });
                    setBookingSuccess(false);
                  }}
                  className="px-6 py-3.5 border border-zinc-800 hover:bg-zinc-850 text-zinc-300 font-bold rounded-xl text-xs uppercase"
                >
                  Schedule Another Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
