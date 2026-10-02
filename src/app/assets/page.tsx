"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function AssetsPage() {
  const [filter, setFilter] = useState("All");
  
  return (
    <main className="min-h-screen bg-sand text-espresso pt-32 pb-20 overflow-hidden">
      {/* Navbar clone for this page */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-sand/80 backdrop-blur-md">
        <a href="/" className="font-bold text-xl tracking-tighter uppercase">Hackathon Club</a>
        <a href="/" className="px-6 py-3 bg-espresso text-sand rounded-full text-sm font-bold hover:scale-105 transition-transform uppercase tracking-widest">
          Back Home
        </a>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-10">Event Assets</h1>
        
        <div className="flex gap-4 mb-20 overflow-x-auto pb-4 hide-scrollbar">
          {["All", "HackSprint '26", "PixelRush '2k26"].map((tag) => (
            <button 
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                filter === tag 
                  ? "bg-espresso text-sand" 
                  : "bg-espresso/10 hover:bg-espresso/20 text-espresso"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative flex overflow-x-hidden group mb-10">
        <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-80 h-60 bg-espresso/10 mx-4 rounded-3xl shrink-0 cursor-pointer hover:-translate-y-2 hover:rotate-2 transition-transform duration-300 border border-espresso/20 flex items-center justify-center">
              <span className="font-bold uppercase tracking-widest opacity-30">Photo {i+1}</span>
            </div>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] absolute top-0">
          {[...Array(8)].map((_, i) => (
            <div key={i+8} className="w-80 h-60 bg-espresso/10 mx-4 rounded-3xl shrink-0 cursor-pointer hover:-translate-y-2 hover:rotate-2 transition-transform duration-300 border border-espresso/20 flex items-center justify-center">
              <span className="font-bold uppercase tracking-widest opacity-30">Photo {i+1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (Reverse) */}
      <div className="relative flex overflow-x-hidden group">
        <div className="flex whitespace-nowrap animate-marquee-reverse group-hover:[animation-play-state:paused]">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-96 h-72 bg-espresso/20 mx-4 rounded-3xl shrink-0 cursor-pointer hover:-translate-y-2 hover:-rotate-2 transition-transform duration-300 border border-espresso/20 flex items-center justify-center">
               <span className="font-bold uppercase tracking-widest opacity-30 text-white">Photo {i+9}</span>
            </div>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-reverse group-hover:[animation-play-state:paused] absolute top-0">
          {[...Array(8)].map((_, i) => (
            <div key={i+8} className="w-96 h-72 bg-espresso/20 mx-4 rounded-3xl shrink-0 cursor-pointer hover:-translate-y-2 hover:-rotate-2 transition-transform duration-300 border border-espresso/20 flex items-center justify-center">
               <span className="font-bold uppercase tracking-widest opacity-30 text-white">Photo {i+9}</span>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
