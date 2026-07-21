import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Share2, Download, Check } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Project } from "../types";

interface GraphicDesignViewerProps {
  project: Project;
  onBack: () => void;
}

export default function GraphicDesignViewer({ project, onBack }: GraphicDesignViewerProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: project.title,
          text: `Check out ${project.title} design on Nexlify.`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // Fallback copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (_) {}
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Create an anchor element and trigger download
      const response = await fetch(project.image, { referrerPolicy: "no-referrer" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Determine file extension or default to jpg
      const ext = project.image.split(".").pop()?.split(/[?#]/)[0] || "jpg";
      link.download = `${project.title.toLowerCase().replace(/\s+/g, "-")}.${ext}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: open in new tab
      window.open(project.image, "_blank");
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl lg:max-w-7xl mx-auto" id="graphic-design-viewer">
      <Helmet>
        <title>{`${project.title} | Graphic Design Exhibition | Nexlify`}</title>
        <meta name="description" content={`Exquisite visual design architecture for "${project.title}" designed for ${project.client}.`} />
      </Helmet>

      {/* Header controls with simple back action */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </button>

        {/* Action triggers */}
        <div className="flex items-center gap-3">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-brand-secondary hover:bg-zinc-850 transition-all cursor-pointer relative"
            title="Share Project"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="w-4 h-4 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="share"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Share2 className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-zinc-900 text-[9px] font-bold text-emerald-500 border border-zinc-800 rounded-md whitespace-nowrap">
                Link Copied
              </span>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className={`p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-brand-secondary hover:bg-zinc-850 transition-all cursor-pointer relative ${
              downloading ? "animate-pulse text-brand-secondary" : ""
            }`}
            title="Download Design Asset"
            disabled={downloading}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout on Desktop, Stacking on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Showcase Image) */}
        <div className="lg:col-span-8 border border-zinc-900 overflow-hidden bg-zinc-950 rounded-none shadow-2xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto max-h-[80vh] lg:max-h-[85vh] object-contain mx-auto transition-transform duration-700 hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Column (Project details Sticky panel) */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-[2rem] space-y-6 border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm">
            <div>
              <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest block mb-1">Graphic Design Asset</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">{project.title}</h1>
              <div className="flex flex-col gap-1.5 text-zinc-500 text-xs border-t border-zinc-900 pt-3 mt-3">
                <p><span className="text-zinc-400 font-semibold">Client:</span> {project.client}</p>
                <p><span className="text-zinc-400 font-semibold">Timeline:</span> {project.timeline}</p>
                <p><span className="text-zinc-400 font-semibold">Classification:</span> Custom Brand Collateral</p>
              </div>
            </div>
            
            <div className="border-t border-zinc-900 pt-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">Design Concept & Objectives</h4>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                {project.problem || project.solution}
              </p>
            </div>

            {project.solution && project.problem && (
              <div className="border-t border-zinc-900 pt-4">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">Technical Implementation</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                  {project.solution}
                </p>
              </div>
            )}

            {/* Quick trust guarantee inside card */}
            <div className="pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full vector files and brand source materials archived.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
