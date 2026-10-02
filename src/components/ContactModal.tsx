"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ContactModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
   const containerRef = useRef<HTMLDivElement>(null);
   const bgRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (isOpen) {
         gsap.set(containerRef.current, { display: "flex" });
         
         const tl = gsap.timeline();
         
         // Animate background sweeping in from top right
         tl.to(bgRef.current, {
            clipPath: "circle(150% at 100% 0%)",
            duration: 1,
            ease: "power4.inOut"
         });
         
         // Stagger in the contact items
         tl.fromTo(".contact-item", 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" },
            "-=0.4"
         );
      } else {
         const tl = gsap.timeline({
            onComplete: () => {
               gsap.set(containerRef.current, { display: "none" });
            }
         });
         
         tl.to(".contact-item", {
            y: -20, opacity: 0, stagger: 0.05, duration: 0.3, ease: "power2.in"
         })
         .to(bgRef.current, {
            clipPath: "circle(0% at 100% 0%)",
            duration: 0.6,
            ease: "power4.inOut"
         }, "-=0.2");
      }
   }, [isOpen]);

   const contacts = [
     { name: "Rachit Kakkad", phone: "+91 8200250915", email: "kakkadrachit1@gmail.com" },
     { name: "Pal Pathak", phone: "+91 9909950612", email: "pdpathak2005@gmail.com" },
     { name: "Zeel Kundariya", phone: "+91 9714860362", email: "zeelkundariya13@gmail.com" },
     { name: "Dhvanit Kanabar", phone: "+91 8849299052", email: "dhvanitkanabar@gmail.com" }
   ];

   return (
     <div ref={containerRef} className="fixed inset-0 z-[100] hidden items-center justify-center pointer-events-auto">
        {/* Animated Background */}
        <div 
           ref={bgRef} 
           className="absolute inset-0 bg-espresso"
           style={{ clipPath: "circle(0% at 100% 0%)" }}
        ></div>
        
        <div className="absolute top-10 right-10 z-10 contact-item">
           <button onClick={onClose} className="w-12 h-12 rounded-full border border-sand/20 flex items-center justify-center text-sand hover:bg-sand hover:text-espresso transition-colors hover-target">
              ✕
           </button>
        </div>

        <div className="relative z-10 w-full max-w-6xl px-6 md:px-12 flex flex-col justify-center h-full">
           <h2 className="text-5xl md:text-8xl font-black uppercase text-sand tracking-tighter mb-12 md:mb-16 contact-item">
              Get in <span className="text-accent">Touch</span>
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {contacts.map((contact, i) => (
                 <div key={i} className="contact-item border-t border-sand/10 pt-6 group">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-accent transition-colors">{contact.name}</h3>
                    <div className="flex flex-col gap-3 mt-4">
                       <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="text-sand/70 font-medium text-sm md:text-base hover:text-white transition-colors flex items-center gap-3 hover-target w-fit">
                          <span className="w-8 h-8 rounded-full bg-sand/10 flex items-center justify-center text-[10px]">📞</span>
                          {contact.phone}
                       </a>
                       <a href={`mailto:${contact.email}`} className="text-sand/70 font-medium text-sm md:text-base hover:text-white transition-colors flex items-center gap-3 hover-target w-fit">
                          <span className="w-8 h-8 rounded-full bg-sand/10 flex items-center justify-center text-[10px]">✉️</span>
                          {contact.email}
                       </a>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
   );
}
