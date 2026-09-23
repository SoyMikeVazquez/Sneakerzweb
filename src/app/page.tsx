"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import Hero from "@/components/Hero";
import PromoStreetwearSection from "@/components/PromoStreetwearSection";
import ServicesSection from "@/components/ServicesSection";
import Sneaker3DSection from "@/components/Sneaker3DSection";
import OrderStatus from "@/components/OrderStatus";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-[70px] left-0 right-0 h-1 bg-[#FFD200] z-[2147483647] origin-left shadow-[0_0_10px_#FFD200]"
        style={{ scaleX }}
      />
      <Hero />
      <PromoStreetwearSection />
      <ServicesSection />
      <Sneaker3DSection />
      <OrderStatus />
      <LocationSection />
    </>
  );
}
