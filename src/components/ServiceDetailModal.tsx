import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { Service } from "../types";

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

export default function ServiceDetailModal({ service, isOpen, onClose, onBook }: ServiceDetailModalProps) {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Close trigger */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-950/80 hover:bg-zinc-850 flex items-center justify-center border border-white/10 transition-colors z-20"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>

            {/* Content pane */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative bg-zinc-950">
                <img src={service.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <h3 className="absolute bottom-4 left-6 text-xl sm:text-2xl font-bold text-white tracking-tight">{service.title}</h3>
              </div>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium">
                {service.longDescription}
              </p>

              <div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Key Deliverables</span>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex gap-2.5 items-center">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                      <span className="text-zinc-300 text-xs sm:text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-zinc-850 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Average Duration</span>
                  <span className="text-white font-bold text-sm">{service.timeline}</span>
                </div>
                
                <button
                  onClick={() => {
                    onClose();
                    onBook();
                  }}
                  className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/95 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-primary/15 transition-all flex items-center justify-center gap-1.5 group"
                >
                  Book Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
