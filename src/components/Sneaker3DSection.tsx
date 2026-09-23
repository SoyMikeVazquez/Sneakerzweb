"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import Sneaker3DScene from "./Sneaker3DScene";

export default function Sneaker3DSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const rotateY = useTransform(smoothProgress, [0, 1], [0, Math.PI * 4]);
  const yPos = useTransform(smoothProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24"
      style={{
        background: "linear-gradient(180deg, #111 0%, #000 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="sneaker-grid-bg opacity-30" />
      <div className="sneaker-glow-orb opacity-40 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-yellow font-bold text-xs uppercase tracking-[0.3em] mb-4"
          >
            ✦ EXPERIENCIA 3D INTERACTIVA
          </motion.p>

          <h2 className="font-bebas text-white italic text-6xl sm:text-7xl lg:text-8xl leading-[0.85] mb-8">
            NUEVA VIDA<br />
            <span className="text-yellow">PARA TUS</span><br />
            SNEAKERS
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
            Desliza para ver cada detalle de nuestro proceso de restauración. Tecnología y pasión unidas para que tus pares luzcan impecables.
          </p>

          <div className="space-y-4 mb-12">
            {["Limpieza Profunda", "Restauración de Color", "Protección Nanotecnológica"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-yellow group-hover:scale-150 transition-transform" />
                <span className="text-gray-300 uppercase text-sm tracking-widest">{item}</span>
              </motion.div>
            ))}
          </div>

          <Link href="/agenda" className="btn-hero-primary group">
            AGENDAR MI CITA
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>

        {/* Right: 3D Scene */}
        <motion.div
          style={{ y: yPos }}
          className="h-[500px] lg:h-[650px] relative cursor-grab active:cursor-grabbing bg-[#111] rounded-2xl overflow-hidden shadow-2xl"
        >
          <SceneWrapper scrollYProgress={scrollYProgress} />
          
          {/* Instructions */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div className="w-px h-12 bg-gradient-to-t from-yellow to-transparent" />
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Scroll para rotar</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Progress Arc (fixed or absolute) */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <motion.div style={{ rotate: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-[0_0_10px_rgba(255,210,0,0.3)]">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#222" strokeWidth="2" />
            <motion.circle
              cx="40" cy="40" r="35"
              fill="none"
              stroke="#FFD200"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                pathLength: scrollYProgress,
                rotate: -90,
                originX: "50%",
                originY: "50%"
              }}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

function SceneWrapper({ scrollYProgress }: { scrollYProgress: any }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    return scrollYProgress.on("change", (v: number) => setProgress(v));
  }, [scrollYProgress]);

  return <Sneaker3DScene scrollProgress={progress} />;
}
