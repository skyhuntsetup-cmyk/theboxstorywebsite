"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Award, ArrowRight, X, ChevronLeft, ChevronRight, Eye
} from "lucide-react";

import pastWorkConfig from "../../../data/past-work-config.json";

export default function PastWorkPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const projects = pastWorkConfig.projects;

  const handleOpenLightbox = (projectIdx: number, imgIdx: number) => {
    setActiveProjectIdx(projectIdx);
    setActiveImageIdx(imgIdx);
    setSelectedImage(projects[projectIdx].images[imgIdx]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const project = projects[activeProjectIdx];
    const nextIdx = (activeImageIdx + 1) % project.images.length;
    setActiveImageIdx(nextIdx);
    setSelectedImage(project.images[nextIdx]);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const project = projects[activeProjectIdx];
    const prevIdx = (activeImageIdx - 1 + project.images.length) % project.images.length;
    setActiveImageIdx(prevIdx);
    setSelectedImage(project.images[prevIdx]);
  };

  return (
    <div className="min-h-screen bg-background text-slate-800 py-16 px-6 cultural-pattern">
      <div className="max-w-6xl mx-auto space-y-16 text-left">
        
        {/* Breadcrumbs */}
        <div className="text-xs space-x-2 text-slate-400">
          <Link href="/" className="hover:text-teal-deep transition-colors">Home</Link>
          <span>/</span>
          <Link href="/corporate" className="hover:text-teal-deep transition-colors">Corporate Gifting</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">Past Work</span>
        </div>

        {/* Hero Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3 py-1 rounded-full text-xs font-bold text-saffron uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Editorial Case Studies</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-teal-deep leading-tight">
            Our Past Work & <br />
            <span className="text-rani-pink">Gifting Case Studies</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-light">
            Explore our curated history of branding partnerships. Below are real photo galleries showing completed orders for tech companies, startups, and luxury celebrations.
          </p>
        </section>

        {/* Case Studies Lists */}
        <section className="space-y-16">
          {projects.map((project, projectIdx) => (
            <div 
              key={projectIdx} 
              className="bg-[#FCFAF2]/80 backdrop-blur-sm border border-teal-deep/5 rounded-[40px] p-8 md:p-10 shadow-sm space-y-8 animate-fade-in"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-teal-deep/5 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black text-rani-pink uppercase tracking-widest block">{project.company}</span>
                    <span className="bg-saffron text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                      {project.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-black text-teal-deep leading-tight">{project.title}</h3>
                  <p className="text-xs text-slate-500 font-medium italic">{project.context}</p>
                </div>

                {/* Outcome box */}
                <div className="flex items-start space-x-2 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 max-w-md shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block">Project Outcome</span>
                    <span className="text-xs text-emerald-850 font-bold leading-relaxed">{project.outcome}</span>
                  </div>
                </div>
              </div>

              {/* Photo Gallery Horizontal Scroll Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-teal-deep/55 uppercase tracking-wider block">
                    Project Gallery ({project.images.length} Photos)
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">
                    Scroll horizontally or click to zoom 🔍
                  </span>
                </div>

                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-teal-deep/10 scrollbar-track-transparent">
                  {project.images.map((imgUrl, imgIdx) => (
                    <div 
                      key={imgIdx}
                      onClick={() => handleOpenLightbox(projectIdx, imgIdx)}
                      className="relative h-48 w-64 md:h-56 md:w-72 flex-shrink-0 rounded-2xl overflow-hidden border border-teal-deep/5 bg-[#faf4e7] cursor-zoom-in group shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={imgUrl} 
                        alt={`${project.company} Photo ${imgIdx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-teal-deep/0 group-hover:bg-teal-deep/10 transition-colors flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                      <span className="absolute bottom-2.5 right-2.5 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {imgIdx + 1}/{project.images.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA Back to corporate Brief */}
        <section className="bg-gradient-to-br from-amber-50 via-background to-rose-50 border border-amber-200 rounded-[40px] p-8 md:p-12 text-center space-y-6">
          <h3 className="font-heading text-2xl font-black text-teal-deep">
            Scale your unboxing journey with us
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Submit your corporate quantities and branding files. Let us outline design mockups and token setups for your upcoming festive season campaign.
          </p>
          <div className="flex justify-center">
            <Link
              href="/corporate#brief-form"
              className="inline-flex items-center space-x-1.5 bg-teal-deep hover:bg-teal-deep/90 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow"
            >
              <span>Submit Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>

      {/* Lightbox / Enlarged Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-350"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 p-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all"
            title="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-4 p-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all"
            title="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Large Image container */}
          <div 
            className="relative max-w-4xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedImage} 
              alt="Enlarged Showcase View" 
              className="max-w-full max-h-full object-contain rounded-2xl border border-white/10 shadow-2xl bg-slate-900"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <p className="text-sm font-bold">{projects[activeProjectIdx].company} — {projects[activeProjectIdx].title}</p>
              <p className="text-xs text-white/60">Photo {activeImageIdx + 1} of {projects[activeProjectIdx].images.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
