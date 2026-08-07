import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Share2, Download, Check, X, Link, Twitter, Linkedin, MessageSquare } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Project } from "../types";

interface GraphicDesignViewerProps {
  project: Project;
  onBack: () => void;
}

export default function GraphicDesignViewer({ project, onBack }: GraphicDesignViewerProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareClick = async () => {
    // If native web share is supported on mobile/tablet, offer it or open quick share options
    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: project.title,
          text: `Check out "${project.title}" graphic design on Nexlify.`,
          url: window.location.href,
        });
        return;
      } catch (_) {}
    }
    setShowShareModal(true);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const fileUrl = project.image;
      
      // If base64 data URL
      if (fileUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = fileUrl;
        const mime = fileUrl.split(";")[0].split(":")[1] || "image/png";
        const ext = mime.split("/")[1] || "png";
        link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fetch as blob to force save-as prompt
        try {
          const response = await fetch(fileUrl, { referrerPolicy: "no-referrer" });
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          const urlExt = fileUrl.split(".").pop()?.split(/[?#]/)[0] || "png";
          link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${urlExt}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (_) {
          // Fallback if CORS prevents blob fetching
          const link = document.createElement("a");
          link.href = fileUrl;
          link.target = "_blank";
          link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      console.error("Download error:", error);
      window.open(project.image, "_blank");
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${project.title}" by @NexlifyInn55:`)}&url=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out "${project.title}" design on Nexlify: ${window.location.href}`)}`
  };

  return (
    <div className="space-y-8 max-w-4xl lg:max-w-7xl mx-auto" id="graphic-design-viewer">
      <Helmet>
        <title>{`${project.title} | Graphic Design Exhibition | Nexlify`}</title>
        <meta name="description" content={`Exquisite visual design architecture for "${project.title}".`} />
      </Helmet>

      {/* Header controls */}
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
            onClick={handleShareClick}
            className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-brand-secondary hover:bg-zinc-850 transition-all cursor-pointer relative"
            title="Share Project"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className={`px-4 py-2 rounded-full bg-brand-secondary text-white border border-brand-secondary/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 hover:bg-brand-secondary/90 shadow-lg ${
              downloading ? "animate-pulse" : ""
            }`}
            title="Download Design Asset"
            disabled={downloading}
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? "Preparing..." : "Download File"}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout on Desktop, Stacking on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Showcase Image) */}
        <div className="lg:col-span-8 border border-zinc-900 overflow-hidden bg-zinc-950 rounded-none shadow-2xl relative group">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto max-h-[80vh] lg:max-h-[85vh] object-contain mx-auto transition-transform duration-700 hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />
          {/* Floating download button on image hover */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 text-white text-xs font-bold rounded-lg shadow-xl flex items-center gap-2 hover:bg-brand-secondary transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Original File
            </button>
          </div>
        </div>

        {/* Right Column (Project details Sticky panel) */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-[2rem] space-y-6 border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm">
            <div>
              <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest block mb-1">Graphic Design Asset</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">{project.title}</h1>
            </div>
            
            <div className="border-t border-zinc-900 pt-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">Description</h4>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                {project.problem || project.solution || project.outcome || "High-fidelity graphic design project curated by Nexlify Innovation creative studio."}
              </p>
            </div>

            {project.solution && project.problem && (
              <div className="border-t border-zinc-900 pt-4">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">Concept Details</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                  {project.solution}
                </p>
              </div>
            )}

            {/* Direct Download Button inside panel */}
            <div className="pt-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3.5 bg-brand-secondary hover:bg-brand-secondary/90 text-white font-extrabold text-xs uppercase tracking-wider transition-all rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? "Downloading File..." : "Download Design Asset"}</span>
              </button>
            </div>

            {/* Quick trust guarantee inside card */}
            <div className="pt-2 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full original resolution file verified and available for download.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5 text-white"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-brand-secondary" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Share Design Asset</h3>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Copy link box */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Direct Page Link</label>
                <div className="flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="bg-transparent text-xs text-zinc-300 w-full outline-none font-mono truncate px-2"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-brand-secondary text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shrink-0 flex items-center gap-1.5 hover:bg-brand-secondary/90 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Share via Social Media</label>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1.5 text-zinc-300 hover:text-white transition-all text-center"
                  >
                    <Twitter className="w-4 h-4 text-sky-400" />
                    <span className="text-[10px] font-bold">Twitter / X</span>
                  </a>
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1.5 text-zinc-300 hover:text-white transition-all text-center"
                  >
                    <Linkedin className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] font-bold">LinkedIn</span>
                  </a>
                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1.5 text-zinc-300 hover:text-white transition-all text-center"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold">WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

