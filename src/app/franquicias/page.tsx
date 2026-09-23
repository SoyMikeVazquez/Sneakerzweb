import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Franquicias | Sneakerz",
  description: "Únete a la familia Sneakerz con tu propia franquicia de limpieza de sneakers.",
};

export default function FranquiciasPage() {
  return (
    <main style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ 
        padding: "160px 20px 80px", 
        textAlign: "center",
        background: "linear-gradient(180deg, #111 0%, #000 100%)",
        borderBottom: "1px solid rgba(255, 210, 0, 0.2)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", marginBottom: "12px", background: "rgba(255, 210, 0, 0.1)", border: "1px solid rgba(255, 210, 0, 0.3)", padding: "4px 16px", borderRadius: "20px" }}>
            <span style={{ color: "#FFD200", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              MODELO DE EXPANSIÓN ✦ BROKER
            </span>
          </div>
          <h1 style={{ 
            fontFamily: "Bebas Neue, sans-serif", 
            fontSize: "clamp(3rem, 8vw, 6rem)", 
            letterSpacing: "0.05em",
            color: "#FFD200",
            marginBottom: "20px",
            lineHeight: "1"
          }}>
            FRANQUICIAS SNEAKERZ
          </h1>
          <p style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: "1.2rem", 
            color: "#aaa",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            La oportunidad de liderar el mercado del cuidado y restauración de calzado premium en México.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
          
          {/* ¿Por qué elegir Sneakerz? */}
          <div style={{ marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#fff", marginBottom: "25px", letterSpacing: "0.05em" }}>
              ¿POR QUÉ ELEGIR SNEAKERZ?
            </h2>
            <div style={{ lineHeight: "1.8", color: "#ccc", fontSize: "1.05rem" }}>
              <p style={{ marginBottom: "20px" }}>
                El mercado de los sneakers ha evolucionado de ser un simple calzado a convertirse en activos de colección y moda de alta gama. En <strong>Sneakerz</strong>, hemos perfeccionado un modelo de negocio boutique que combina técnicas artesanales con tecnología de punta para el cuidado y restauración de estos activos.
              </p>
              <p style={{ marginBottom: "20px" }}>
                Nuestra propuesta de franquicia no es solo una marca; es un ecosistema completo diseñado para el éxito. Proporcionamos capacitación intensiva, suministros especializados y una estrategia de marketing digital que garantiza un flujo constante de clientes desde el primer día.
              </p>
              <p>
                Buscamos socios apasionados que deseen replicar nuestra excelencia operativa y atención al detalle en nuevas ubicaciones estratégicas.
              </p>
            </div>
          </div>

          {/* Respaldo Legal y Corporativo (Broker) */}
          <div style={{ 
            background: "#111", 
            padding: "40px", 
            borderRadius: "16px", 
            border: "1px solid rgba(255, 210, 0, 0.25)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            marginBottom: "60px"
          }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#FFD200", marginBottom: "15px", letterSpacing: "0.05em" }}>
              RESPALDO LEGAL Y CORPORATIVO
            </h2>
            <p style={{ color: "#aaa", lineHeight: "1.7", fontSize: "1rem" }}>
              Para tu total seguridad y transparencia, el servicio de franquicias y la operación de marca son gestionados legalmente por la empresa <strong>BROKER</strong>. 
            </p>
            <p style={{ color: "#aaa", marginTop: "12px", lineHeight: "1.7", fontSize: "1rem" }}>
              Broker es una firma líder en la gestión de proyectos inmobiliarios y comerciales, asegurando que cada contrato y operación cumpla con los más altos estándares legales de México.
            </p>
            <Link 
              href="https://broker.com.mx" 
              target="_blank"
              style={{ 
                display: "inline-flex", 
                alignItems: "center",
                gap: "6px",
                marginTop: "20px", 
                color: "#FFD200", 
                textDecoration: "underline",
                fontWeight: "700",
                fontSize: "0.95rem"
              }}
            >
              Visita broker.com.mx →
            </Link>
          </div>

          {/* Inicia tu proceso / Ubicación y Botones */}
          <div style={{ textAlign: "center", borderTop: "1px solid #222", paddingTop: "60px" }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#fff", marginBottom: "20px", letterSpacing: "0.05em" }}>
              INICIA TU PROCESO
            </h2>
            <p style={{ color: "#888", marginBottom: "40px", fontSize: "1rem" }}>
              Ponte en contacto con nuestro equipo de expansión para recibir el dossier informativo y los requisitos de inversión.
            </p>
            
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px", marginBottom: "50px" }}>
              <div style={{ background: "#0a0a0a", border: "1px solid #222", padding: "20px 30px", borderRadius: "12px", minWidth: "220px" }}>
                <p style={{ color: "#FFD200", fontWeight: "700", fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "8px" }}>UBICACIÓN MATRIZ</p>
                <p style={{ color: "#fff", lineHeight: "1.5", fontSize: "0.95rem" }}>Puerto Mazatlán 3802<br/>Las Brisas, Monterrey, NL.</p>
              </div>
              <div style={{ background: "#0a0a0a", border: "1px solid #222", padding: "20px 30px", borderRadius: "12px", minWidth: "220px" }}>
                <p style={{ color: "#FFD200", fontWeight: "700", fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "8px" }}>CONTACTO DIRECTO</p>
                <p style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "4px" }}>+52 1 81 1817 1792</p>
                <p style={{ color: "#fff", fontSize: "0.95rem" }}>franquicias@sneakerz.mx</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <Link 
                href="https://wa.me/5218118171792"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  maxWidth: "420px",
                  padding: "16px 32px",
                  backgroundColor: "#25D366",
                  color: "#fff",
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "1.3rem",
                  borderRadius: "10px",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(37, 211, 102, 0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                HABLAR CON UN ASESOR POR WHATSAPP
              </Link>

              <Link 
                href="https://guiadefranquicias.com/franquicia/688847"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  maxWidth: "420px",
                  padding: "16px 32px",
                  backgroundColor: "#FFD200",
                  color: "#000",
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "1.3rem",
                  borderRadius: "10px",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  fontWeight: 800,
                  boxShadow: "0 6px 20px rgba(255, 210, 0, 0.35)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
              >
                VER DETALLES DE ESTA FRANQUICIA ↗
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Spacer para el footer */}
      <div style={{ height: "100px" }}></div>
    </main>
  );
}
