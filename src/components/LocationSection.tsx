"use client";
import { useEffect, useState } from "react";
import { supabaseMain } from "@/lib/supabase";

const fallbackSucursal = {
  nombre: "Puerto Mazatlán 3802",
  direccion: "Col. Las Brisas\nMonterrey, Nuevo León, México",
  horarios: [
    { day: "Lunes – Viernes", hours: "9:00 AM – 7:00 PM" },
    { day: "Sábado", hours: "10:00 AM – 5:00 PM" },
    { day: "Domingo", hours: "Cerrado" },
  ],
  map_url: "https://goo.gl/maps/TGrCgFY5yi5ViWDR9",
  iframe_src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.2!2d-100.2965!3d25.6806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPuerto+Mazatl%C3%A1n+3802%2C+Las+Brisas%2C+Monterrey%2C+N.L.!5e0!3m2!1ses-419!2smx!4v1"
};

export default function LocationSection() {
  const [sucursales, setSucursales] = useState([fallbackSucursal]);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const { data } = await supabaseMain.from("sucursales").select("*").order("created_at", { ascending: true });
        if (data && data.length > 0) {
          setSucursales(data.map(s => ({
            nombre: s.nombre,
            direccion: s.direccion,
            horarios: (() => {
              try {
                const parsed = typeof s.horarios === 'string' ? JSON.parse(s.horarios) : s.horarios;
                return Array.isArray(parsed) ? parsed : fallbackSucursal.horarios;
              } catch {
                return fallbackSucursal.horarios;
              }
            })(),
            map_url: s.map_url,
            iframe_src: fallbackSucursal.iframe_src, 
          })));
        }
      } catch (err) {
        console.error("Error fetching sucursales:", err);
      }
    };
    fetchSucursales();
  }, []);

  const mainSucursal = sucursales[0];

  return (
    <section style={{ background: "#fff" }}>

      {/* Section Header */}
      <div style={{ background: "#111", padding: "64px 24px 48px", textAlign: "center" }}>
        <p style={{
          color: "#ff5500",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}>
          ✦ DÓNDE ENCONTRARNOS
        </p>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontStyle: "italic",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          color: "#fff",
          lineHeight: 0.9,
          marginBottom: "16px",
        }}>
          NUESTRA <span style={{ color: "#ff5500" }}>UBICACIÓN</span>
        </h2>
        <p style={{ color: "#888", fontSize: "0.95rem", maxWidth: "460px", margin: "0 auto" }}>
          Visítanos o agenda tu recolección a domicilio.
        </p>
      </div>

      {/* Map + Info */}
      <div
        className="location-grid"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "56px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* Grayscale Map */}
        <div style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 32px rgba(0,0,0,0.1)",
          border: "1px solid #eee",
        }}>
          <div style={{ filter: "grayscale(100%) contrast(1.05)", lineHeight: 0 }}>
            <iframe
              src={mainSucursal.iframe_src}
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Sneakerz"
            />
          </div>
          <div style={{ height: "4px", background: "#ff5500" }} />
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* Address */}
          <div style={{ borderLeft: "4px solid #ff5500", paddingLeft: "20px" }}>
            <p style={{
              fontSize: "0.7rem", fontWeight: 700, color: "#ff5500",
              letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px",
            }}>
              📍 DIRECCIÓN
            </p>
            <h3 style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "1.8rem", color: "#111", lineHeight: 1.1, marginBottom: "6px",
            }}>
              {mainSucursal.nombre}
            </h3>
            <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {mainSucursal.direccion}
            </p>
          </div>

          {/* Hours */}
          <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "20px" }}>
            <p style={{
              fontSize: "0.7rem", fontWeight: 700, color: "#ff5500",
              letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "14px",
            }}>
              🕐 HORARIO
            </p>
            {mainSucursal.horarios.map((item: any, i: number, arr: any[]) => (
              <div
                key={item.day}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: i < arr.length - 1 ? "10px" : "0",
                  marginBottom: i < arr.length - 1 ? "10px" : "0",
                  borderBottom: i < arr.length - 1 ? "1px solid #eee" : "none",
                  fontSize: "0.88rem",
                }}
              >
                <span style={{ color: "#555", fontWeight: 500 }}>{item.day}</span>
                <span style={{ fontWeight: 700, color: item.hours === "Cerrado" ? "#bbb" : "#111" }}>
                  {item.hours}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href={mainSucursal.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="sucursal-btn-dark"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeWidth="2" strokeLinecap="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              CÓMO LLEGAR
            </a>
            <a
              href="/agenda"
              className="btn-hero-primary"
              style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              AGENDAR RECOLECCIÓN →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .location-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
