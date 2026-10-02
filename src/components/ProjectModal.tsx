"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ProjectModal({ activeProject, onClose }: { activeProject: string | null, onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (activeProject) {
      // Body scroll lock
      document.body.style.overflow = 'hidden';
      
      // ANIMATE IN
      gsap.set(containerRef.current, { display: "flex", autoAlpha: 1 });
      
      const tl = gsap.timeline();
      
      tl.fromTo(".modal-bg", 
        { y: 30, scale: 0.96, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "power4.out" }
      )
      .fromTo(".modal-img-container", 
        { scale: 1.1, opacity: 0, rotateX: 5 },
        { scale: 1, opacity: 1, rotateX: 0, duration: 1.2, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(".modal-text-reveal",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: "power3.out" },
        "-=0.8"
      );
      
    } else {
      // Body scroll unlock
      document.body.style.overflow = '';
      
      // ANIMATE OUT
      gsap.to(containerRef.current, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut", onComplete: () => {
         gsap.set(containerRef.current, { display: "none" });
      } });
    }
  }, [activeProject]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] hidden items-center justify-center pointer-events-none p-4 md:p-10" style={{ perspective: "1000px" }}>
       {/* Background Blur Overlay */}
       <div className={`absolute inset-0 bg-espresso/80 backdrop-blur-2xl transition-opacity duration-1000 ${activeProject ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} onClick={onClose}></div>
       
       {/* Main Modal Body */}
       <div className="modal-bg relative bg-espresso h-[95vh] md:h-[90vh] w-full max-w-[1400px] mx-auto md:rounded-[2rem] rounded-[2rem] pointer-events-auto flex flex-col md:flex-row overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,1)] border border-sand/10">
          
          {/* Close Button - Moved out of content flow */}
          <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 w-14 h-14 bg-sand/10 backdrop-blur-md text-sand rounded-full flex items-center justify-center z-50 hover:bg-accent transition-all hover:scale-110 shadow-2xl hover:rotate-90 duration-500 border border-sand/20">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Left: Image Container (Now takes up more space and has a gradient fade) */}
          <div className="w-full md:w-[50%] h-[40vh] md:h-full relative overflow-hidden bg-espresso shrink-0">
             <div className="modal-img-container absolute inset-0 w-full h-full">
               <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80" alt="Hacksprint" className="w-full h-full object-cover opacity-60 scale-105 hover:scale-110 transition-transform duration-[3s] ease-out mix-blend-luminosity" />
               <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-espresso via-espresso/40 to-transparent opacity-100"></div>
             </div>
             
             {/* Huge Vertical Typography on Image */}
             <div className="absolute left-10 bottom-10 opacity-20 pointer-events-none">
                <h2 className="text-[10rem] font-black uppercase tracking-tighter text-sand leading-none -rotate-90 origin-bottom-left transform-gpu hidden md:block">
                  HACKSPRINT
                </h2>
             </div>
          </div>

          {/* Right: Content (Dark mode with gold/accent text) */}
          {/* Right: Content (Dark mode with gold/accent text) */}
          <div 
             className="w-full md:w-[50%] h-[60vh] md:h-full bg-espresso p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto overflow-x-hidden relative text-sand [&::-webkit-scrollbar]:hidden"
             style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
             data-lenis-prevent="true"
          >
             
             {/* Subtle glowing orb */}
             <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-accent/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

             <div className="modal-text-reveal flex items-center gap-4 mb-4 mt-8 md:mt-0">
               <div className="w-12 h-px bg-accent"></div>
               <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Completed Event</span>
             </div>
             
             <h2 className="modal-text-reveal text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-6 text-white">
               HackSprint<br/><span className="text-accent opacity-90">2k26</span>
             </h2>

             <p className="modal-text-reveal text-sm font-medium text-sand/60 mb-8 max-w-lg leading-relaxed">
               HackSprint 2k26 was a 31-hour, non-stop hackathon hosted by CodingGita, bringing together 75+ students in 20+ teams to solve surprise problem statements across 7 domains — AI & Automation, Healthcare, Education, Productivity, and more. From theme reveal to live demos, teams built, debugged, and pitched real working solutions, judged by an expert faculty panel on innovation, technical execution, and presentation. Winners walked away with cash prizes up to ₹5,000 and QR-verified certificates — but every participant walked away with a shipped product and a story.
             </p>

             {/* Minimalist Stats Grid */}
             <div className="modal-text-reveal grid grid-cols-2 gap-x-12 gap-y-6 border-t border-sand/10 pt-6 mb-8">
                <div>
                   <h4 className="text-3xl font-black text-white mb-1">80+</h4>
                   <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-sand/40">Participants</p>
                </div>
                <div>
                   <h4 className="text-3xl font-black text-accent mb-1">₹10k</h4>
                   <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-sand/40">Prize Pool</p>
                </div>
                <div>
                   <h4 className="text-3xl font-black text-white mb-1">25+</h4>
                   <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-sand/40">Teams</p>
                </div>
                <div>
                   <h4 className="text-3xl font-black text-accent mb-1">31</h4>
                   <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-sand/40">Hours Non-Stop</p>
                </div>
             </div>

             <div className="modal-text-reveal flex items-center gap-6 mt-auto">
                <a href="https://hacksprint-2k26.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-sand text-espresso rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                   View Live Site
                </a>
                <a href="https://hacksprint-2k26.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-sand/20 flex items-center justify-center hover:bg-sand hover:text-espresso transition-all hover:scale-110">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
             </div>
          </div>
       </div>
    </div>
  );
}
