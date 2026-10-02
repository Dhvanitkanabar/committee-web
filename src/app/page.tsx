"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import TeamReveal from "@/components/TeamReveal";
import ProjectModal from "@/components/ProjectModal";
import ContactModal from "@/components/ContactModal";
import { TEAM } from "@/data/team";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const heroRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const aboutTextRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const doCardsRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const teamOverviewRef = useRef<HTMLElement>(null);
  const footerWordmarkRef = useRef<HTMLHeadingElement>(null);
  
  // Custom cursor refs
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Custom Cursor Logic
      if (window.innerWidth > 768 && cursorRef.current) {
         gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
         
         const moveCursor = (e: MouseEvent) => {
           // 1. Move Custom Cursor
           gsap.to(cursorRef.current, {
             x: e.clientX,
             y: e.clientY,
             duration: 0.15,
             ease: "power2.out"
           });
         };
         
         const resetParallax = () => {
            // Unused but kept for cleanup reference if needed
         };

         window.addEventListener("mousemove", moveCursor);
         window.addEventListener("mouseleave", resetParallax);

         // Hover interactions
         const hoverables = document.querySelectorAll("a, button, .hover-target");
         hoverables.forEach(el => {
           el.addEventListener("mouseenter", () => gsap.to(cursorRef.current, { scale: 1.5, backgroundColor: "rgba(217,119,70,0.4)" }));
           el.addEventListener("mouseleave", () => gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent" }));
         });
      }

      // Smooth Scroll Setup (Lenis)
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });
      
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // 0. Navbar hide/show on scroll
      if (navRef.current) {
        let lastScroll = 0;
        window.addEventListener("scroll", () => {
          const currentScroll = window.scrollY;
          if (currentScroll > 50) {
            navRef.current!.classList.add("bg-beige/90", "backdrop-blur-md", "shadow-sm");
          } else {
            navRef.current!.classList.remove("bg-beige/90", "backdrop-blur-md", "shadow-sm");
          }

          if (currentScroll > lastScroll && currentScroll > 200) {
            gsap.to(navRef.current, { yPercent: -100, duration: 0.3 });
          } else {
            gsap.to(navRef.current, { yPercent: 0, duration: 0.3 });
          }
          lastScroll = currentScroll;
        });
      }

      // 1. Continuous Background Animations (Next-Level Activity)
      const marquee = document.querySelector(".bg-marquee-hero");
      if (marquee) {
        gsap.to(marquee, {
          xPercent: -50,
          repeat: -1,
          duration: 15,
          ease: "none"
        });
      }
      
      // Continuous Hacker Scramble Text
      const scrambleEl = document.querySelector(".scramble-text");
      let scrambleInterval: any;
      if (scrambleEl) {
         const originalText = scrambleEl.getAttribute("data-text") || "";
         const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
         
         const startScramble = () => {
           let iteration = 0;
           clearInterval(scrambleInterval);
           scrambleInterval = setInterval(() => {
             scrambleEl.textContent = originalText
               .split("")
               .map((letter, index) => {
                 if (index < iteration) {
                   return originalText[index];
                 }
                 return chars[Math.floor(Math.random() * chars.length)];
               })
               .join("");
             
             if (iteration >= originalText.length) {
               clearInterval(scrambleInterval);
               setTimeout(startScramble, 3000); // Trigger scramble every 3s
             }
             iteration += 1 / 2; // Speed of resolving
           }, 30);
         };
         startScramble();
      }
      
      const blob = document.querySelector(".hero-blob");
      if (blob) {
         gsap.to(blob, {
            rotation: 360,
            scale: 1.5, // Breathe heavily
            x: "5vw",
            y: "5vh",
            repeat: -1,
            yoyo: true,
            duration: 8,
            ease: "sine.inOut"
         });
      }

      // Continuous Infinite Background Marquee
      const heroMarquee = document.querySelector(".bg-marquee-hero");
      if (heroMarquee) {
         gsap.to(heroMarquee, {
            xPercent: -50,
            ease: "none",
            duration: 10,
            repeat: -1
         });
      }

      // Continuous Hero Typography Floating (Individual Letter Wave)
      const heroChars = document.querySelectorAll(".hero-char");
      if (heroChars.length > 0) {
         gsap.to(heroChars, {
            y: -15,
            rotation: 2,
            duration: 2,
            ease: "sine.inOut",
            stagger: {
               each: 0.05,
               repeat: -1,
               yoyo: true
            }
         });
      }

      // 2. Hero Reveal (Intro vs Scroll isolation)
      if (heroRef.current) {
        // The text spans inside the wrappers
        const heroWords = heroRef.current.querySelectorAll(".hero-word");
        // The wrappers themselves (used for scroll animation)
        const heroWrappers = heroRef.current.querySelectorAll(".hero-wrapper");
        
        // Intro Animation (Animates the inner words up)
        gsap.to(
          heroWords,
          { 
            y: 0, opacity: 1, stagger: 0.1, duration: 1.5, ease: "expo.out", delay: 0.1,
            onComplete: () => {
              heroRef.current!.style.overflow = "visible";
              
              // Start Continuous Kinetic Wave on characters
              gsap.to(".hero-char", {
                 y: -15,
                 rotationZ: 2,
                 scale: 1.05,
                 stagger: {
                   each: 0.05,
                   repeat: -1,
                   yoyo: true
                 },
                 duration: 1.2,
                 ease: "sine.inOut"
              });
            }
          }
        );
        
        // Scroll Animation (Animates the wrappers so it doesn't conflict with the intro state)
        const heroTl = gsap.timeline({
          scrollTrigger: { 
            trigger: heroRef.current.closest("section"),
            start: "top top", 
            end: "+=100%",
            scrub: 1 
          }
        });
        
        if (heroWrappers.length >= 2) {
          heroTl.to(heroWrappers[0], {
             x: "-30vw",
             y: "-20vh",
             rotation: -25,
             opacity: 0,
             scale: 1.8,
             ease: "power2.inOut"
          }, 0);
          heroTl.to(heroWrappers[1], {
             x: "30vw",
             y: "-30vh",
             rotation: 25,
             opacity: 0,
             scale: 1.8,
             ease: "power2.inOut"
          }, 0);
        }
      }

      // 2. What is the Committee (Cinematic Reveal)
      if (aboutRef.current) {
        const textElements = aboutRef.current.querySelectorAll(".about-text-reveal");
        const cards = aboutRef.current.querySelectorAll(".about-stat-card");
        
        gsap.fromTo(textElements, 
          { y: 100, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: "power4.out",
            scrollTrigger: { trigger: aboutRef.current, start: "top 70%" }
          }
        );

        gsap.fromTo(cards, 
          { y: 150, opacity: 0, rotation: -10, scale: 0.8 },
          {
            y: 0, opacity: 1, rotation: 0, scale: 1, stagger: 0.2, duration: 1.5, ease: "back.out(1.2)",
            scrollTrigger: { trigger: aboutRef.current, start: "top 60%" }
          }
        );
      }

      // 3. What We Do (Accordion Reveal)
      if (doCardsRef.current) {
        gsap.fromTo(doCardsRef.current, 
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: doCardsRef.current, start: "top 80%" }
          }
        );
      }

      // 4. Previous Works (Horizontal Scroll Pinning)
      if (worksRef.current) {
        const worksContainer = worksRef.current.querySelector(".works-container");
        const cards = gsap.utils.toArray(worksRef.current.querySelectorAll(".work-card"));
        
        const scrollTween = gsap.to(worksContainer, {
          x: () => -(worksContainer!.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: worksRef.current,
            pin: true,
            scrub: 1,
            refreshPriority: 1, // Force this to calculate first
            end: () => "+=" + (worksContainer!.scrollWidth - window.innerWidth)
          }
        });

        // Add Parallax to images inside horizontal scroll
        cards.forEach((card: any) => {
          const img = card.querySelector('img');
          if (img) {
             gsap.to(img, {
               xPercent: 20,
               ease: "none",
               scrollTrigger: {
                 trigger: worksRef.current,
                 start: "top top",
                 end: () => "+=" + worksRef.current!.offsetWidth * 2,
                 scrub: true,
               }
             });
          }
        });
      }

      // 8. Team Overview (Independent entry on scroll)
      if (teamOverviewRef.current) {
        const profiles = teamOverviewRef.current.querySelectorAll(".team-profile");
        profiles.forEach((profile) => {
          gsap.fromTo(profile, 
            { opacity: 0, y: 100, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out",
              scrollTrigger: { trigger: profile, start: "top 85%" }
            }
          );
        });
      }

      // 10. Footer Wordmark Scale
      if (footerWordmarkRef.current) {
        gsap.fromTo(footerWordmarkRef.current, 
          { y: 100, opacity: 0, scale: 0.8 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1,
            scrollTrigger: { trigger: footerWordmarkRef.current, start: "top 95%", scrub: 1 }
          }
        );
      }

      // Recalculate all ScrollTrigger positions after React renders all components
      // This fixes the massive gap caused by child components (TeamReveal) initializing 
      // their ScrollTriggers before parent components add pin-spacers.
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-beige text-espresso selection:bg-accent selection:text-beige cursor-none md:cursor-auto">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="hidden md:block fixed top-0 left-0 w-8 h-8 border-2 border-accent rounded-full pointer-events-none z-[9999] mix-blend-difference"></div>

      {/* 0. Navbar */}
      <nav ref={navRef} className="fixed top-0 left-0 w-full px-6 md:px-12 py-3 md:py-4 flex items-center z-50 text-espresso transition-all duration-300">
        
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
           <img src="/logo.png" alt="Committee Logo" className="h-10 md:h-12 w-auto object-contain drop-shadow-md" />
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex flex-1 justify-center gap-8 text-sm font-medium uppercase tracking-widest whitespace-nowrap">
          <a href="#about" className="relative group overflow-hidden">
             <span className="block group-hover:-translate-y-full transition-transform duration-300">About</span>
             <span className="block absolute top-full left-0 text-accent group-hover:-translate-y-full transition-transform duration-300">About</span>
          </a>
          <a href="#works" className="relative group overflow-hidden">
             <span className="block group-hover:-translate-y-full transition-transform duration-300">Works</span>
             <span className="block absolute top-full left-0 text-accent group-hover:-translate-y-full transition-transform duration-300">Works</span>
          </a>
          <a href="#team" className="relative group overflow-hidden">
             <span className="block group-hover:-translate-y-full transition-transform duration-300">Team</span>
             <span className="block absolute top-full left-0 text-accent group-hover:-translate-y-full transition-transform duration-300">Team</span>
          </a>
          <a href="/assets" className="relative group overflow-hidden">
             <span className="block group-hover:-translate-y-full transition-transform duration-300">Assets</span>
             <span className="block absolute top-full left-0 text-accent group-hover:-translate-y-full transition-transform duration-300">Assets</span>
          </a>
        </div>

        {/* Right: CTA */}
        <div className="flex-1 flex justify-end">
           <button onClick={() => setIsContactModalOpen(true)} className="magnetic-btn px-6 py-3 bg-espresso text-white rounded-full text-sm font-bold hover:scale-105 hover:bg-accent hover:text-white hover:shadow-lg transition-all duration-300 uppercase tracking-widest whitespace-nowrap hover-target">
             Contact Us
           </button>
        </div>
      </nav>

      {/* 1. Hero (Structured Architecture) */}
      <section className="relative h-screen w-full pt-20 px-4 md:px-8 pb-8 bg-beige flex flex-col">
         {/* Top Content: Massive Typography & 3D Elements */}
         <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
            
            {/* Minimalist 2D Grid (Optimized for performance) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 transform-gpu">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(217,119,70,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(217,119,70,0.2)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            </div>

            {/* Minimalist Floating Geometry (Clean Hacker Vibe) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
               {/* Ambient Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent/5 blur-[40px] transform-gpu rounded-full"></div>
               
               {/* Floating Plus Signs and Circles */}
               <div className="hero-particle absolute top-[20%] left-[10%] text-accent/30 font-mono text-xl animate-[ping_4s_linear_infinite]">＋</div>
               <div className="hero-particle absolute top-[70%] left-[20%] text-espresso/20 font-mono text-2xl animate-[pulse_3s_linear_infinite]">＋</div>
               <div className="hero-particle absolute top-[30%] right-[15%] w-10 h-10 border border-accent/20 rounded-full animate-[spin_6s_linear_infinite] border-dashed"></div>
               <div className="hero-particle absolute top-[60%] right-[25%] text-accent/20 font-mono text-3xl animate-[bounce_5s_infinite]">＋</div>
               <div className="hero-particle absolute top-[15%] right-[40%] w-4 h-4 border border-espresso/30 rotate-45 animate-[spin_4s_linear_infinite]"></div>
            </div>

            {/* Infinite Background Marquee (Fills empty space) */}
            <div className="bg-marquee-hero absolute top-1/3 left-0 -translate-y-1/2 w-[200%] flex whitespace-nowrap opacity-[0.06] font-black text-[25vw] tracking-tighter uppercase pointer-events-none -z-10">
               <span className="mx-8">HACKATHON</span>
               <span className="mx-8">SYSTEMS</span>
               <span className="mx-8">HACKATHON</span>
               <span className="mx-8">SYSTEMS</span>
            </div>

            {/* 3. Kinetic Continuous Waving Typography */}
            <h1 ref={heroRef} className="z-10 text-[11vw] md:text-[10vw] lg:text-[9vw] leading-[0.8] font-black tracking-tighter text-espresso uppercase text-center w-full flex flex-col items-center">
              <span className="hero-wrapper block drop-shadow-sm overflow-hidden pt-4 px-4">
                <span className="hero-word flex translate-y-full opacity-0">
                  {"WE BUILD".split("").map((char, i) => (
                    <span key={i} className="hero-char inline-block">{char === " " ? "\u00A0" : char}</span>
                  ))}
                </span>
              </span>
              <span className="hero-wrapper block bg-gradient-to-r from-accent via-[#ffb38a] to-accent bg-[length:200%_auto] text-transparent bg-clip-text gradient-shift drop-shadow-sm overflow-hidden pt-4 px-4 pb-4">
                <span className="hero-word flex translate-y-full opacity-0">
                  {"THE FUTURE".split("").map((char, i) => (
                    <span key={i} className="hero-char inline-block">{char === " " ? "\u00A0" : char}</span>
                  ))}
                </span>
              </span>
              
              {/* Continuous Scrambling Subtitle */}
              <div className="mt-8 overflow-hidden h-6 md:h-8 flex items-center justify-center">
                 <p className="scramble-text text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-espresso/60 bg-beige/50 backdrop-blur-sm px-4 py-2 rounded-full border border-espresso/10" data-text="ENGINEERING THE NEXT GENERATION OF BUILDERS">
                    ENGINEERING THE NEXT GENERATION OF BUILDERS
                 </p>
              </div>
            </h1>
         </div>
         
         {/* Inline CSS for Grid & Scramble */}
         <style dangerouslySetInnerHTML={{__html: `
            @keyframes gridMove {
              0% { background-position: 0 0; }
              100% { background-position: 0 4rem; }
            }
            .cyber-grid-animate {
              animation: gridMove 2s linear infinite;
            }
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            .gradient-shift {
              animation: gradientShift 6s linear infinite;
            }
         `}} />
         
         {/* Bottom Control Panel (Widgets) */}
         <div className="h-auto md:h-[30vh] w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 z-20" style={{ perspective: "1000px" }}>
            {/* Widget 1: Video/Image Card */}
            <div className="widget-parallax rounded-[2rem] bg-espresso text-sand p-6 md:p-8 flex flex-col justify-between hover-target group overflow-hidden relative shadow-lg min-h-[200px]">
               <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:opacity-40 transition-all duration-700 group-hover:scale-110" alt="bg" />
               <div className="absolute inset-0 bg-gradient-to-t from-espresso to-transparent opacity-80"></div>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] relative z-10 text-sand/60">Our Next Event</p>
               <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter relative z-10 group-hover:text-accent transition-colors">HackSprint '26</h3>
            </div>
            
            {/* Widget 2: System Status */}
            <div className="widget-parallax rounded-[2rem] bg-sand border border-espresso/10 p-6 md:p-8 flex flex-col justify-between hover-target group shadow-sm hover:shadow-md transition-shadow min-h-[200px]">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-espresso/40">Network Status</p>
               <div>
                 <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-espresso">Systems Go</h3>
                 <div className="flex items-center gap-3 mt-3">
                    <div className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_10px_#10B981]"></div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-espresso/60">Global Cluster Active</p>
                 </div>
               </div>
            </div>

            {/* Widget 3: Scroll Prompt */}
            <div className="widget-parallax rounded-[2rem] bg-accent text-beige p-6 md:p-8 flex flex-col justify-between hover-target group shadow-lg transition-colors min-h-[200px] hover:bg-[#b0552b]">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-beige/70">Navigation</p>
               <div className="flex justify-between items-end">
                 <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Explore<br/>Below</h3>
                 <div className="w-14 h-14 rounded-full border-2 border-beige/30 flex items-center justify-center group-hover:border-beige group-hover:-translate-y-2 transition-all duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce mt-1"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2. What is the Committee */}
      <section ref={aboutRef} id="about" className="py-40 px-6 md:px-20 bg-espresso text-sand min-h-screen relative overflow-hidden flex flex-col justify-center z-20">
        {/* Massive Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.03] pointer-events-none">
           <h2 className="text-[25vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap">IMPACT</h2>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col xl:flex-row gap-20 items-center">
          
          <div className="w-full xl:w-1/2">
            <div className="about-text-reveal flex items-center gap-6 mb-12">
               <div className="w-16 h-px bg-accent"></div>
               <span className="text-accent font-bold tracking-[0.3em] uppercase text-sm">Who We Are</span>
            </div>
            
            <h2 className="about-text-reveal text-6xl md:text-8xl font-black leading-[0.85] uppercase tracking-tighter mb-10 text-sand">
              We engineer <br/><span className="text-accent">momentum.</span>
            </h2>
            
            <p className="about-text-reveal text-xl md:text-2xl font-bold opacity-60 max-w-lg mb-12 leading-relaxed text-sand/80">
              We are a collective of builders, designers, and engineers pushing the boundaries of what students can create in 24 hours. We don't just host events; we build ecosystems.
            </p>
            
            <div className="about-text-reveal">
              <button className="hover-target px-10 py-5 border-2 border-sand/20 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-sand hover:text-espresso transition-all duration-500 flex items-center gap-4 group">
                 Our Philosophy
                 <div className="w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform"></div>
              </button>
            </div>
          </div>

          <div className="w-full xl:w-1/2 relative h-[80vh] md:h-[70vh] mt-20 xl:mt-0">
             {/* Stacking Stat Cards */}
             <div className="about-stat-card absolute top-0 right-0 md:right-10 w-[90%] md:w-[70%] h-[250px] bg-accent rounded-[3rem] p-10 flex flex-col justify-between hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-700 hover:rotate-2 cursor-pointer z-30 border-4 border-espresso hover-target group">
                <p className="font-bold uppercase tracking-widest text-espresso text-sm">Global Reach</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-7xl md:text-8xl font-black text-sand drop-shadow-xl group-hover:scale-110 origin-bottom-left transition-transform duration-500">300+</h3>
                   <p className="font-bold uppercase tracking-widest text-espresso text-xs mb-2">Participants</p>
                </div>
             </div>

             <div className="about-stat-card absolute top-[30%] left-0 md:left-10 w-[85%] md:w-[65%] h-[250px] bg-sand rounded-[3rem] p-10 flex flex-col justify-between hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-rotate-2 cursor-pointer z-20 border-4 border-espresso hover-target group">
                <p className="font-bold uppercase tracking-widest text-espresso/50 text-sm">Output</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-7xl md:text-8xl font-black text-espresso group-hover:text-accent transition-colors duration-500">50+</h3>
                   <p className="font-bold uppercase tracking-widest text-espresso/50 text-xs mb-2">Projects</p>
                </div>
             </div>
             
             <div className="about-stat-card absolute bottom-0 right-0 md:right-20 w-[75%] md:w-[55%] h-[220px] bg-espresso/50 backdrop-blur-xl rounded-[3rem] p-10 flex flex-col justify-between hover:-translate-y-4 hover:shadow-2xl transition-all duration-700 cursor-pointer z-10 border-2 border-sand/10 hover-target group">
                <p className="font-bold uppercase tracking-widest text-sand/50 text-sm">Experience</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-6xl md:text-7xl font-black text-sand group-hover:text-accent transition-colors duration-500">2</h3>
                   <p className="font-bold uppercase tracking-widest text-sand/50 text-xs mb-2">Events</p>
                </div>
             </div>
          </div>
          
        </div>
      </section>

      {/* 3. What We Do (Premium Accordion) */}
      <section className="py-40 px-6 md:px-20 bg-beige overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
             <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter text-espresso">The Blueprint</h2>
             <p className="text-accent font-bold tracking-[0.2em] uppercase text-sm mt-4 md:mt-0">How we make it happen</p>
          </div>
          
          <div ref={doCardsRef} className="flex flex-col md:flex-row h-[70vh] gap-4 w-full">
            {[
              { title: "Strategic Architecture", desc: "Architecting the infrastructure of tomorrow's biggest ideas.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" },
              { title: "Technical Mastery", desc: "Enforcing elite coding standards and rigorous evaluation.", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" },
              { title: "Ecosystem & Capital", desc: "Fueling the engine with premium sponsors and flawless logistics.", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
              { title: "The Arena", desc: "Curating an adrenaline-fueled battleground for top-tier developers.", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80" }
            ].map((item, i) => (
              <div key={i} className="group relative flex-1 md:hover:flex-[4] transition-all duration-[1s] ease-[cubic-bezier(0.19,1,0.22,1)] rounded-[2rem] overflow-hidden cursor-pointer bg-espresso border border-espresso/10 hover-target">
                <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-1000 grayscale group-hover:grayscale-0 mix-blend-luminosity" />
                
                {/* Number Badge */}
                <div className="absolute top-8 left-8 w-12 h-12 rounded-full border-2 border-sand/50 text-sand flex items-center justify-center font-bold text-xl group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10 transition-all duration-700 z-10">
                  {i+1}
                </div>
                
                {/* Expanded Content (Hidden by default, shown on hover) */}
                <div className="absolute bottom-10 left-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-200 z-10 md:w-[350px] opacity-100">
                   <h3 className="text-4xl font-black text-sand uppercase tracking-tighter mb-4 leading-none">{item.title}</h3>
                   <p className="text-sand/80 font-bold text-sm tracking-wider uppercase">{item.desc}</p>
                </div>

                {/* Collapsed Vertical Text (Hidden on mobile) */}
                <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-0">
                   <h3 className="text-3xl font-black uppercase tracking-widest text-sand -rotate-90 whitespace-nowrap drop-shadow-xl">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Previous Works (Horizontal Scroll) */}
      <section ref={worksRef} id="works" className="py-20 bg-espresso text-sand relative z-20 overflow-hidden h-screen flex flex-col justify-center rounded-t-[3rem]">
         <div className="w-full relative px-6 md:px-20 mb-10 absolute top-20 left-0">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 z-10 relative">
               <h2 className="text-[10vw] md:text-[8vw] font-black leading-none uppercase tracking-tighter hover-target">Our Works</h2>
               <div className="hidden md:block w-1/3 text-right opacity-60 font-bold uppercase tracking-widest text-sm mb-4">
                 Pioneering the hackathon landscape with industry-leading events.
               </div>
            </div>
         </div>
         
         <div className="works-container flex w-[250vw] md:w-[200vw] h-[60vh] px-6 md:px-20 gap-10 items-center">
            {/* Card 1 */}
            <div onClick={() => setActiveProject("hacksprint")} className="work-card group w-full max-w-[80vw] h-[90%] bg-sand rounded-[3rem] overflow-hidden flex items-end p-8 md:p-16 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex-shrink-0 border border-sand/20 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80" alt="HackSprint" className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent opacity-90 z-10"></div>
              
              <div className="absolute top-10 right-10 bg-accent text-beige px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest z-20 shadow-xl backdrop-blur-md">Completed</div>
              <div className="z-20 w-full flex justify-between items-end relative overflow-hidden">
                 <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter group-hover:scale-105 transition-transform duration-700 text-sand transform origin-left">HackSprint '26</h3>
                 <div className="hidden md:flex w-20 h-20 rounded-full border-2 border-sand items-center justify-center group-hover:bg-sand group-hover:text-espresso transition-all duration-500 cursor-pointer">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                 </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="work-card group w-full max-w-[80vw] h-[90%] bg-accent rounded-[3rem] overflow-hidden flex items-end p-8 md:p-16 relative shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex-shrink-0 border border-accent/20">
              <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=80" alt="PixelRush" className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-multiply scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent opacity-90 z-10"></div>
              
              <div className="absolute top-10 right-10 bg-sand text-espresso px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest flex gap-3 items-center z-20 shadow-2xl backdrop-blur-md">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span> Upcoming
              </div>
              
              <div className="z-20 w-full flex justify-between items-end relative overflow-hidden">
                 <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-sand group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl transform origin-left">PixelRush '2k26</h3>
                 <div className="hidden md:flex w-20 h-20 rounded-full border-2 border-sand items-center justify-center group-hover:bg-sand group-hover:text-espresso transition-all duration-500 cursor-pointer">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                 </div>
              </div>
            </div>
         </div>
      </section>

      {/* 7. Team Reveal (GSAP Pinned - One by One Scroll Animation) */}
      <div id="team">
        <TeamReveal />
      </div>

      {/* 8. Team Overview */}
      <section id="team-overview" className="py-32 px-6 md:px-20 bg-sand relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-20">
           
           {/* Sticky Left Sidebar */}
           <div className="w-full xl:w-1/3">
              <div className="xl:sticky top-40">
                 <span className="text-accent font-bold tracking-[0.3em] uppercase mb-4 block flex items-center gap-4"><span className="w-8 h-px bg-accent"></span> Committee</span>
                 <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.85] hover-target">The Minds <br/>Behind It</h2>
                 <p className="opacity-60 font-bold tracking-wider uppercase text-sm mb-10 max-w-sm">
                   The collective of engineers, designers, and strategists organizing the future of student hackathons.
                 </p>
                 <div className="hidden xl:block w-full h-px bg-espresso/20"></div>
              </div>
           </div>

           {/* Scrolling Right Column (Stacked, restoring sticky scroll height) */}
           <div className="w-full xl:w-2/3 flex flex-col gap-16 relative pb-20">
              {TEAM.map((member) => (
                 <div key={member.id} className="team-profile group relative bg-transparent p-0 flex flex-col md:flex-row items-center transition-all duration-700 hover-target md:min-h-[400px]">
                    
                    {/* Floating Background Plate */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-lg group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 group-hover:bg-white z-0 mt-20 md:mt-0 md:ml-16"></div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-0 mt-20 md:mt-0 md:ml-16 overflow-hidden rounded-[3rem]">
                       <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:animate-pulse"></div>
                    </div>

                    {/* Image Container (Breaks out of the frame significantly) */}
                    <div className="w-[90%] md:w-[42%] h-[340px] md:h-[440px] rounded-[2.5rem] overflow-hidden relative shadow-2xl bg-sand z-10 shrink-0 transform -translate-y-6 md:translate-y-0 md:-translate-x-8 group-hover:-translate-y-8 md:group-hover:-translate-x-12 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-4 border-white/50 group-hover:border-white">
                       <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 group-hover:scale-[1.12] transition-all duration-1000" />
                       
                       {/* Interactive Safe Badges */}
                       <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                       <div className="absolute bottom-6 left-6 right-6 flex justify-between transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <div className="text-center">
                             <span className="block text-3xl font-black text-white">{member.stats.hackathons}</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Events</span>
                          </div>
                          <div className="text-center">
                             <span className="block text-3xl font-black text-accent">{member.stats.wins}</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Wins</span>
                          </div>
                       </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full md:w-[58%] flex flex-col z-10 px-8 pb-10 md:p-12 md:pl-4">
                       <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter group-hover:text-accent transition-colors mb-10 leading-none">{member.name}</h3>

                       <div className="space-y-5 mb-10">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-espresso/40 border-b border-espresso/10 pb-3">Notable Works</h4>
                          <div className="flex flex-wrap gap-3">
                             {member.works.map((work, i) => (
                               <span key={i} className="px-4 py-2 bg-espresso text-sand rounded-full text-[10px] font-bold uppercase tracking-widest cursor-default shadow-sm hover:bg-accent transition-colors hover:scale-105 hover:shadow-md transform duration-300">
                                 {work}
                               </span>
                             ))}
                          </div>
                       </div>

                       {/* Compact Social Links (Sleek Circular Icons) */}
                       <div className="flex gap-5 border-t border-espresso/10 pt-8 mt-auto">
                          {member.socials.portfolio && member.socials.portfolio !== "#" && (
                            <a href={member.socials.portfolio} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_20px_rgba(217,119,70,0.3)] hover:shadow-[0_15px_30px_rgba(217,119,70,0.6)]">
                               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            </a>
                          )}

                          {member.socials.github !== "#" && (
                            <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#333] text-white flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                               <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </a>
                          )}
                          
                          {member.socials.linkedin !== "#" && (
                            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_20px_rgba(0,119,181,0.3)] hover:shadow-[0_15px_30px_rgba(0,119,181,0.6)]">
                               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                          )}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. Assets Teaser */}
      <section className="hover-target py-20 bg-beige border-y border-espresso/10 overflow-hidden flex flex-col items-center relative group cursor-pointer" onClick={() => window.location.href = '/assets'}>
        <div className="w-[200%] flex gap-4 animate-pulse opacity-50 group-hover:opacity-100 group-hover:[animation-play-state:paused] transition-all duration-700 pointer-events-none mb-10">
            {/* Fake marquee */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-64 h-40 bg-sand rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-500 group-hover:-rotate-2 border border-transparent group-hover:border-accent overflow-hidden shadow-lg relative">
                 <img src={`/hackathon photos/${i + 1}.jpg`} alt="Asset" className="w-full h-full object-cover" />
              </div>
            ))}
        </div>
        <a href="/assets" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-espresso text-sand rounded-full font-bold uppercase tracking-widest scale-100 group-hover:scale-110 transition-transform duration-500 z-10 shadow-2xl group-hover:shadow-[0_10px_30px_rgba(217,119,70,0.5)] group-hover:bg-accent hover-target">
          View All Assets
        </a>
      </section>

      {/* 10. Footer */}
      <footer className="bg-espresso text-sand relative overflow-hidden flex flex-col rounded-t-[3rem] mt-[-3rem] z-30 pt-32">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-20 flex flex-col gap-32">
           
           {/* Top: Massive CTA */}
           <div className="flex flex-col items-center text-center">
              <p className="text-accent font-bold uppercase tracking-[0.3em] text-sm mb-6 flex items-center gap-4">
                <span className="w-12 h-px bg-accent"></span> Got a question? <span className="w-12 h-px bg-accent"></span>
              </p>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.9]">
                 Let's Build <br/> The Future
              </h2>
              <button onClick={() => setIsContactModalOpen(true)} className="px-12 py-6 bg-sand text-espresso rounded-full font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover-target">
                 Contact Us
              </button>
           </div>
           
           {/* Middle: Links Grid */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-sand/10 pt-16">
              <div className="col-span-1 md:col-span-2">
                 <div className="font-black text-2xl tracking-tighter uppercase mb-6 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-accent"></span>
                    HCKTHN CLUB
                 </div>
                 <p className="opacity-50 text-sm font-bold max-w-sm leading-relaxed tracking-wide">Building the next generation of engineers, designers, and founders, 24 hours at a time.</p>
              </div>
              <div className="flex flex-col gap-5 text-[10px] font-bold uppercase tracking-[0.2em]">
                 <p className="opacity-40 mb-2">Navigation</p>
                 <a href="#about" className="hover:text-accent transition-colors w-fit">About Us</a>
                 <a href="#works" className="hover:text-accent transition-colors w-fit">Past Events</a>
                 <a href="#team" className="hover:text-accent transition-colors w-fit">Committee</a>
                 <a href="/assets" className="hover:text-accent transition-colors w-fit">Brand Assets</a>
              </div>
              <div className="flex flex-col gap-5 text-[10px] font-bold uppercase tracking-[0.2em]">
                 <p className="opacity-40 mb-2">Socials</p>
                 <a href="https://www.instagram.com/codinggita_students" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors w-fit">Instagram</a>
                 <a href="https://linkedin.com/in/codinggita-hackathon-commitee" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors w-fit">LinkedIn</a>
                 <a href="https://github.com/CodingGita-Hackathon-Commitee" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors w-fit">GitHub</a>
              </div>
           </div>
        </div>
        
        {/* Bottom: Massive Wordmark */}
        <div className="w-full mt-20 pt-10 border-t border-sand/5 overflow-hidden flex justify-center relative">
           <h2 ref={footerWordmarkRef} className="text-[17vw] leading-[0.75] font-black tracking-tighter text-center opacity-10 hover:opacity-100 hover:text-accent transition-all duration-700 cursor-default select-none pb-4 drop-shadow-2xl">
             COMMITTEE
           </h2>
        </div>
      </footer>
      
      {/* Dynamic GSAP Modals */}
      <ProjectModal activeProject={activeProject} onClose={() => setActiveProject(null)} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </main>
  );
}
