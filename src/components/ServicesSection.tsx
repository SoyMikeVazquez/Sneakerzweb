"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabaseMain } from "@/lib/supabase";

const fallbackServices = [
  {
    id: "sneakers",
    title: "LIMPIEZA Y RESTAURACIÓN DE SNEAKERS",
    description:
      "¡Es hora de mimar a tus gorras y sneakers! Con nuestros servicios de limpieza, retoque de color, restauración y personalización, tus favoritos van a brillar más que nunca.",
    image: "/service-sneakers.jpg",
  },
  {
    id: "residencial",
    title: "LIMPIEZA TAPICERÍA RESIDENCIAL",
    description:
      "¡Ahora puedes programar la limpieza de tu sala, colchón y sillas para que tus muebles siempre estén frescos y huelan increíble! Dile adiós a las alergias.",
    image: "/service-residential.jpg",
  },
  {
    id: "bolsos",
    title: "LIMPIEZA DE BOLSOS / MALETAS",
    description:
      "Tus bolsos y maletas de diseñador merecen el mejor cuidado. Nuestros especialistas los restauran y limpian para devolverles su brillo original.",
    image: "/service-bags.jpg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function ServicesSection() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabaseMain.from("servicios").select("*").order("created_at", { ascending: true });
        if (data && data.length > 0) {
          setServices(data.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            image: s.image,
          })));
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <section
      id="servicios"
      style={{ backgroundColor: "var(--bg-light)", padding: "100px 0 120px" }}
      className="overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left column: heading + GIF + tagline */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-80 flex-shrink-0"
          >
            {/* Title */}
            <div className="mb-8">
              <span className="services-title-orange text-glow">NUESTROS</span>
              <br />
              <span className="services-title-bg border-glow">SERVICIOS</span>
            </div>

            {/* GIF */}
            <div className="gif-box mb-8 group" style={{ maxWidth: "260px" }}>
              <Image
                src="/sss.gif"
                alt="Sneakerz services"
                width={260}
                height={260}
                className="w-full grayscale group-hover:grayscale-0 transition-all duration-700"
                unoptimized
              />
            </div>

            {/* Tagline */}
            <div
              style={{
                borderLeft: "4px solid var(--orange)",
                paddingLeft: "20px",
              }}
            >
              <p style={{ color: "#333", lineHeight: 1.7, fontSize: "1rem" }}>
                No es solo limpieza. Es darle{" "}
                <span
                  style={{
                    color: "var(--orange)",
                    textDecoration: "underline",
                    fontWeight: 700,
                    fontStyle: "italic",
                  }}
                >
                  amor
                </span>{" "}
                a tus pares. Checa lo que hacemos por ti.
              </p>
            </div>
          </motion.div>

          {/* Right: cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((s) => (
              <motion.div
                key={s.id}
                variants={cardVariants}
                className="service-card group"
              >
                {/* Image */}
                <div className="h-56 overflow-hidden relative">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-[#FFD200]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <h3
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "#111",
                      lineHeight: 1.3,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#555",
                      lineHeight: 1.7,
                      flexGrow: 1,
                    }}
                  >
                    {s.description}
                  </p>
                  <Link href="/agenda" className="btn-card self-start mt-auto">
                    AGENDAR AHORA
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
