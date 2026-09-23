"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function PromoStreetwearSection() {
  return (
    <section className="relative bg-[#0A0A0A] py-16 sm:py-24 overflow-hidden border-t-2 border-b-2 border-[#FFD200]/30">
      {/* Background Streetwear Watermark Lines */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-5 overflow-hidden flex flex-col justify-around">
        <div className="streetwear-watermark-dark text-6xl sm:text-8xl tracking-wider">
          SNEAKERZ SNEAKERZ SNEAKERZ SNEAKERZ SNEAKERZ
        </div>
        <div className="streetwear-watermark-dark text-6xl sm:text-8xl tracking-wider pl-24">
          CLEANING DETAILING RESTORATION CARE SNEAKERZ
        </div>
        <div className="streetwear-watermark-dark text-6xl sm:text-8xl tracking-wider">
          BODY SHOP MEXICO STREETWEAR SNEAKERZ
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Street Manifesto Header (Inspirado en Flyer 3) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#FFD200] font-mono text-sm tracking-widest">&gt;&gt;&gt;</span>
            <span className="bg-[#FFD200] text-black font-black text-xs px-2.5 py-0.5 uppercase tracking-widest rounded-sm">
              MANIFIESTO SNEAKERHEAD
            </span>
            <span className="text-[#FFD200] font-mono text-sm tracking-widest">&lt;&lt;&lt;</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display italic leading-none">
            <span className="text-[#FFD200] block mb-1">MIENTRAS HAYA VIDA,</span>
            <span className="text-white block">HAY QUE COMPRARSE TODOS LOS TENIS QUE UNO PUEDA</span>
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base italic">
            Y nosotros nos encargamos de mantenerlos como recién sacados de la caja.
          </p>
        </div>

        {/* Dynamic Streetwear Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Promo Card: 3X$350 (Inspirado directamente en Flyer 2 & 4) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-[#FFD200] rounded-2xl p-6 sm:p-10 relative overflow-hidden text-black flex flex-col justify-between shadow-[8px_8px_0px_#000] border-2 border-black"
          >
            {/* Background Watermark within the yellow card */}
            <div className="absolute inset-0 pointer-events-none select-none opacity-10 overflow-hidden flex flex-col justify-between p-4">
              <div className="streetwear-watermark-yellow text-6xl tracking-widest">SNEAKERZ SNEAKERZ</div>
              <div className="streetwear-watermark-yellow text-6xl tracking-widest pl-10">BODY SHOP SNEAKERZ</div>
              <div className="streetwear-watermark-yellow text-6xl tracking-widest">SNEAKERZ SNEAKERZ</div>
            </div>

            {/* Top Bar inside Card */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                <Sparkles size={14} className="text-[#FFD200]" />
                <span>PROMOCIÓN OFICIAL</span>
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-black/80">
                www.sneakerz.mx
              </span>
            </div>

            {/* Slanted Bold Banner (Flyer 2 signature) */}
            <div className="relative z-10 my-4 transform -rotate-1">
              <div className="bg-black text-white px-6 py-4 rounded-md shadow-[5px_5px_0px_rgba(0,0,0,0.3)] inline-block w-full">
                <div className="text-5xl sm:text-7xl font-display font-black tracking-tight leading-none text-white">
                  3X$350
                </div>
                <div className="text-xl sm:text-2xl font-display font-bold tracking-widest text-[#FFD200] mt-1">
                  LIMPIEZA BÁSICA
                </div>
              </div>
            </div>

            {/* Price pills (Flyer 4 signature) */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-6">
              <div className="bg-black text-white px-4 py-3 rounded-lg border border-black/20 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Individual:</span>
                <span className="text-lg font-black font-display text-[#FFD200]">1 PAR $150 PESOS</span>
              </div>
              <div className="bg-black text-white px-4 py-3 rounded-lg border border-black/20 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Combo ahorro:</span>
                <span className="text-lg font-black font-display text-[#FFD200]">3 PARES $350 PESOS</span>
              </div>
            </div>

            {/* Conditions & CTA */}
            <div className="relative z-10 pt-4 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold text-black/80 italic">
                * Costo adicional con gamuza y materiales especiales.
              </span>
              <Link
                href="/agenda"
                className="w-full sm:w-auto bg-black text-[#FFD200] hover:text-white px-6 py-3.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
              >
                <span>AGENDAR ESTA PROMO</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Secondary Streetwear Card: Detailing & Premium Care */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 bg-[#121212] rounded-2xl p-6 sm:p-10 relative overflow-hidden text-white flex flex-col justify-between border-2 border-[#FFD200]/30 shadow-[8px_8px_0px_rgba(255,210,0,0.15)]"
          >
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FFD200]/10 border border-[#FFD200]/40 text-[#FFD200] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mb-6">
                <span>⚡ CUIDADO PROFESIONAL</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display italic leading-tight text-white mb-4">
                TRATAMIENTOS DE ALTO IMPACTO PARA TUS ARTÍCULOS FAVORITOS
              </h3>

              <ul className="space-y-3.5 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#FFD200] flex-shrink-0 mt-0.5" />
                  <span><strong>Desamarilleo de suelas</strong> y recuperación de tonos blancos originales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#FFD200] flex-shrink-0 mt-0.5" />
                  <span><strong>Revitalización de gamuza y nobuk</strong> con productos especializados anti-decoloración.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#FFD200] flex-shrink-0 mt-0.5" />
                  <span><strong>Protección nanotecnológica</strong> repelente contra lluvia, líquidos y manchas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#FFD200] flex-shrink-0 mt-0.5" />
                  <span><strong>Bolsos, gorras y tapicería</strong> con atención especializada a cada costura.</span>
                </li>
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/servicios"
                className="w-full bg-[#FFD200] text-black font-black px-5 py-3.5 rounded-lg text-xs uppercase tracking-widest text-center hover:bg-[#FFE24A] transition-all shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2"
              >
                <span>VER CATÁLOGO COMPLETO</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Running Ticker / Ribbon */}
        <div className="mt-14 overflow-hidden bg-[#FFD200] text-black py-2.5 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000]">
          <div className="flex whitespace-nowrap animate-marquee font-display font-black text-lg sm:text-xl tracking-wider">
            <span className="mx-4">⚡ SNEAKERZ BODY SHOP</span>
            <span className="mx-4">•</span>
            <span className="mx-4">3 PARES POR $350 (LIMPIEZA BÁSICA)</span>
            <span className="mx-4">•</span>
            <span className="mx-4">1 PAR POR $150</span>
            <span className="mx-4">•</span>
            <span className="mx-4">SERVICIO A DOMICILIO Y SUCURSALES</span>
            <span className="mx-4">•</span>
            <span className="mx-4">DETALLES EN GAMUZA Y ARTÍCULOS DE LUJO</span>
            <span className="mx-4">•</span>
            <span className="mx-4">⚡ SNEAKERZ BODY SHOP</span>
            <span className="mx-4">•</span>
            <span className="mx-4">3 PARES POR $350 (LIMPIEZA BÁSICA)</span>
            <span className="mx-4">•</span>
            <span className="mx-4">1 PAR POR $150</span>
            <span className="mx-4">•</span>
            <span className="mx-4">SERVICIO A DOMICILIO Y SUCURSALES</span>
          </div>
        </div>

      </div>
    </section>
  );
}
