import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sucursales | Sneakerz",
  description:
    "Visítanos en Puerto Mazatlán 3802, Las Brisas, Monterrey, NL. Servicio de limpieza y restauración de sneakers premium.",
};

export default function SucursalesPage() {
  return (
    <div style={{ paddingTop: "70px", background: "#fff" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <section
        style={{
          background: "#111",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#ff5500",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          ✦ DÓNDE ENCONTRARNOS
        </p>
        <h1
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontStyle: "italic",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            color: "#fff",
            lineHeight: 0.9,
            marginBottom: "20px",
          }}
        >
          NUESTRA<br />
          <span style={{ color: "#ff5500" }}>UBICACIÓN</span>
        </h1>
        <p style={{ color: "#888", maxWidth: "500px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
          Nos encontramos en Las Brisas, Monterrey. Visítanos o agenda tu recolección a domicilio.
        </p>
      </section>

      {/* ── Map + Info Grid ────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "64px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }}
        className="sucursales-grid"
      >
        {/* Left: Map */}
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
            border: "1px solid #eee",
            position: "relative",
          }}
        >
          {/* Grayscale filter wrapper */}
          <div style={{ filter: "grayscale(100%) contrast(1.05)", lineHeight: 0 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.3!2d-100.3!3d25.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8662edb74d07f1f7%3A0x1!2sPuerto+Mazatl%C3%A1n+3802%2C+Las+Brisas%2C+Monterrey%2C+Nuevo+Le%C3%B3n%2C+M%C3%A9xico!5e0!3m2!1ses!2smx!4v1"
              width="100%"
              height="450"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Sneakerz — Puerto Mazatlán 3802, Las Brisas, Monterrey"
            />
          </div>

          {/* Orange accent bar at bottom */}
          <div style={{ height: "4px", background: "#ff5500", width: "100%" }} />
        </div>

        {/* Right: Info Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Address */}
          <div
            style={{
              borderLeft: "4px solid #ff5500",
              paddingLeft: "24px",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#ff5500",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              📍 DIRECCIÓN
            </p>
            <h2
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "2rem",
                color: "#111",
                lineHeight: 1.1,
                marginBottom: "8px",
              }}
            >
              Puerto Mazatlán 3802
            </h2>
            <p style={{ color: "#555", fontSize: "1rem", lineHeight: 1.6 }}>
              Col. Las Brisas<br />
              Monterrey, Nuevo León, México
            </p>
          </div>

          {/* Hours */}
          <div
            style={{
              background: "#f9f9f9",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#ff5500",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              🕐 HORARIO
            </p>
            {[
              { day: "Lunes – Viernes", hours: "9:00 AM – 7:00 PM" },
              { day: "Sábado", hours: "10:00 AM – 5:00 PM" },
              { day: "Domingo", hours: "Cerrado" },
            ].map((item) => (
              <div
                key={item.day}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                  borderBottom: "1px solid #eee",
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "#555", fontWeight: 500 }}>{item.day}</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: item.hours === "Cerrado" ? "#999" : "#111",
                  }}
                >
                  {item.hours}
                </span>
              </div>
            ))}
          </div>

          {/* Contact Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a
              href="https://goo.gl/maps/TGrCgFY5yi5ViWDR9"
              target="_blank"
              rel="noopener noreferrer"
              className="sucursal-btn-dark"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeWidth="2" strokeLinecap="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              CÓMO LLEGAR
            </a>
            <a
              href="https://wa.me/5218118171792?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20la%20sucursal"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: "#25D366",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="currentColor">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.774L0 32l8.456-2.01A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.073 22.38c-.337.947-1.965 1.81-2.712 1.924-.694.107-1.572.152-2.537-.16a22.88 22.88 0 01-2.3-.85c-4.048-1.748-6.69-5.838-6.89-6.11-.2-.27-1.632-2.17-1.632-4.14s1.033-2.94 1.4-3.34c.366-.4.8-.5 1.065-.5.265 0 .532.003.765.013.245.012.574-.092.898.686.337.8 1.146 2.77 1.248 2.97.1.2.166.434.033.7-.134.267-.2.433-.4.666-.2.234-.42.523-.6.703-.2.2-.408.416-.176.816.234.4 1.04 1.71 2.232 2.77 1.532 1.367 2.823 1.79 3.223 1.99.4.2.633.167.866-.1.234-.267 1-1.167 1.267-1.567.267-.4.533-.333.9-.2.367.133 2.333 1.1 2.733 1.3.4.2.666.3.766.467.1.166.1.966-.237 1.913z"/>
              </svg>
              CONTACTAR POR WHATSAPP
            </a>
          </div>

          {/* Google Maps direct link */}
          <p style={{ fontSize: "0.75rem", color: "#bbb", textAlign: "center" }}>
            También puedes{" "}
            <a
              href="https://goo.gl/maps/TGrCgFY5yi5ViWDR9"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ff5500", fontWeight: 600, textDecoration: "none" }}
            >
              abrir en Google Maps
            </a>
          </p>
        </div>
      </section>

      {/* ── Full-width Map strip (mobile-friendly) ─────────────── */}
      <section style={{ background: "#111", padding: "48px 24px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            color: "#fff",
            fontSize: "1.1rem",
            letterSpacing: "0.2em",
            marginBottom: "8px",
          }}
        >
          ¿NECESITAS RECOLECCIÓN A DOMICILIO?
        </p>
        <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "20px" }}>
          Recogemos en toda el área metropolitana de Monterrey, Lunes a Sábado.
        </p>
        <a
          href="/agenda"
          style={{
            display: "inline-block",
            background: "#ff5500",
            color: "#fff",
            padding: "14px 32px",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          AGENDAR RECOLECCIÓN →
        </a>
      </section>

      {/* Responsive grid CSS */}
      <style>{`
        @media (max-width: 768px) {
          .sucursales-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
