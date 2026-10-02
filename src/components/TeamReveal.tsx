"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TEAM } from "@/data/team";

export default function TeamReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const profilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Initial State: Place cards off-screen in 4 different directions
      const entryDirections = [
        { x: -300, y: 0, rot: -15 },   // Card 0: From Left
        { x: 0, y: -300, rot: 15 },    // Card 1: From Top
        { x: 0, y: 300, rot: -15 },    // Card 2: From Bottom
        { x: 300, y: 0, rot: 15 },     // Card 3: From Right
      ];

      gsap.set(profilesRef.current, {
        x: (i) => entryDirections[i % 4].x,
        y: (i) => entryDirections[i % 4].y,
        rotation: (i) => entryDirections[i % 4].rot,
        opacity: 0,
        scale: 0.8,
      });

      // 2. Sequential Scroll Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", // 3 viewports of scrolling
          scrub: 1, // Smooth scrub linked to scrollbar
          pin: true,
          onUpdate: (self) => {
            // Only enable hover animations when the scroll timeline is 99% complete
            if (self.progress > 0.99) {
              containerRef.current?.classList.add("hover-enabled");
            } else {
              containerRef.current?.classList.remove("hover-enabled");
            }
          }
        },
      });

      // Background title fades and slides in
      tl.fromTo(titleRef.current, {
        y: 100,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });

      // Cards animate in strictly one by one based on scroll
      profilesRef.current.forEach((profile, i) => {
        if (!profile) return;
        
        tl.to(profile, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.2)",
        }); // Notice there is no stagger offset here, they play sequentially in the timeline
      });

      // Hold briefly at the end before unpinning
      tl.to({}, { duration: 0.5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen w-full bg-[#1A1614] text-sand relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* Immersive Deep Background Title */}
      <h2 ref={titleRef} className="absolute z-0 text-[18vw] font-black tracking-tighter text-sand/5 uppercase whitespace-nowrap select-none pointer-events-none">
         Core Team
      </h2>
      
      {/* Staggered Grid Container - Added class 'cards-container' for the new hover logic */}
      <div className="cards-container relative w-full max-w-6xl mx-auto z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6" style={{ perspective: "1000px" }}>
        
        {TEAM.map((member, i) => (
          <div 
            key={member.id} 
            ref={(el) => {
                if (el) profilesRef.current[i] = el;
            }}
            className="team-card relative flex flex-col items-center justify-center p-6 bg-[#25201D] text-sand rounded-[2rem] border border-sand/5 shadow-2xl transition-all duration-500 ease-out"
          >
            
            <div className="w-full h-[320px] bg-gradient-to-t from-black/80 to-transparent rounded-2xl mb-6 overflow-hidden flex items-end justify-center relative shadow-inner border border-white/5">
               <img src={member.image.replace('-coat', '')} alt={member.name} className="max-w-full max-h-full object-contain object-bottom drop-shadow-2xl transition-transform duration-700 team-card-img" />
            </div>
            
            <h3 className="text-2xl font-black uppercase tracking-tight text-center text-white">{member.name}</h3>

            {/* Hidden Content Revealed on Hover */}
            <div className="team-card-content flex flex-col items-center mt-0 h-0 overflow-hidden opacity-0 transition-all duration-500">
               <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                  {member.works.map((work, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-bold uppercase tracking-widest text-white/70 whitespace-nowrap">{work}</span>
                  ))}
               </div>
               
               <div className="flex justify-center gap-3 mt-4">
                  {member.socials.portfolio && member.socials.portfolio !== "#" && (
                    <a href={member.socials.portfolio} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-accent/20 border border-accent/50 text-accent flex items-center justify-center hover:bg-accent hover:text-white hover:scale-110 transition-all shadow-[0_0_15px_rgba(217,119,70,0)] hover:shadow-[0_0_15px_rgba(217,119,70,0.5)]">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </a>
                  )}
                  {member.socials.github !== "#" && (
                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                  )}
                  {member.socials.linkedin !== "#" && (
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#0077b5]/20 border border-[#0077b5]/50 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white hover:scale-110 transition-all">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* PERFECTED SPOTLIGHT EFFECT WITH HOVER-ENABLED GATE */}
      <style dangerouslySetInnerHTML={{__html: `
        /* 
           These effects ONLY activate if the parent section has the 'hover-enabled' class,
           which GSAP adds dynamically only when the scroll animation is 100% complete.
        */
        .hover-enabled .team-card:hover {
           transform: translateY(-16px) scale(1.05);
           background-color: #2C2622;
           box-shadow: 0 20px 60px rgba(0,0,0,0.6);
           z-index: 20;
           border-color: rgba(230, 223, 209, 0.2);
        }

        .hover-enabled .cards-container:has(.team-card:hover) .team-card:not(:hover) {
          filter: blur(5px) grayscale(50%);
          opacity: 0.3;
          transform: scale(0.92);
        }

        .hover-enabled .team-card:hover .team-card-img {
          transform: scale(1.1);
        }
        
        .hover-enabled .team-card:hover .team-card-role {
          opacity: 1;
        }

        /* Reveal Hidden Content */
        .hover-enabled .team-card:hover .team-card-content {
          opacity: 1;
          height: auto;
          margin-top: 10px;
        }
      `}} />
    </section>
  );
}
