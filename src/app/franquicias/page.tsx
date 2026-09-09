import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Franquicias | Sneakerz",
  description: "Únete a la familia Sneakerz con tu propia franquicia de limpieza de sneakers.",
};

export default function FranquiciasPage() {
  return (
    <main style={{ backgroundColor: "#000", color: "#fff", minHeight: "100-vh" }}>
      {/* Hero Section */}
      <section style={{ 
        padding: "160px 20px 80px", 
        textAlign: "center",
        background: "linear-gradient(180deg, #111 0%, #000 100%)",
        borderBottom: "1px solid #222"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1 style={{ 
            fontFamily: "Bebas Neue, sans-serif", 
            fontSize: "clamp(3rem, 8vw, 6rem)", 
            letterSpacing: "0.05em",
            color: "#ff5500",
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
            margin: "0 auto"
          }}>
            La oportunidad de liderar el mercado del cuidado de calzado premium en México.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
          
          <div style={{ marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#fff", marginBottom: "30px" }}>
              ¿POR QUÉ ELEGIR SNEAKERZ?
            </h2>
            <div style={{ lineHeight: "1.8", color: "#ccc", fontSize: "1.1rem" }}>
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

          <div style={{ 
            background: "#111", 
            padding: "40px", 
            borderRadius: "20px", 
            border: "1px solid #222",
            marginBottom: "60px"
          }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#ff5500", marginBottom: "20px" }}>
              RESPALDO LEGAL Y CORPORATIVO
            </h2>
            <p style={{ color: "#aaa", lineHeight: "1.6" }}>
              Para tu total seguridad y transparencia, el servicio de franquicias y la operación de marca son gestionados legalmente por la empresa <strong>BROKER</strong>. 
            </p>
            <p style={{ color: "#aaa", marginTop: "15px" }}>
              Broker es una firma líder en la gestión de proyectos inmobiliarios y comerciales, asegurando que cada contrato y operación cumpla con los más altos estándares legales de México.
            </p>
            <Link 
              href="https://broker.com.mx" 
              target="_blank"
              style={{ 
                display: "inline-block", 
                marginTop: "20px", 
                color: "#ff5500", 
                textDecoration: "underline",
                fontWeight: "600"
              }}
            >
              Visita broker.com.mx →
            </Link>
          </div>

          <div style={{ textAlign: "center", borderTop: "1px solid #222", paddingTop: "60px" }}>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#fff", marginBottom: "30px" }}>
              INICIA TU PROCESO
            </h2>
            <p style={{ color: "#888", marginBottom: "40px" }}>
              Ponte en contacto con nuestro equipo de expansión para recibir el dossier informativo y los requisitos de inversión.
            </p>
            
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px" }}>
              <div>
                <p style={{ color: "#ff5500", fontWeight: "700", marginBottom: "5px" }}>UBICACIÓN MATRIZ</p>
                <p style={{ color: "#fff" }}>Puerto Mazatlán 3802<br/>Las Brisas, Monterrey, NL.</p>
              </div>
              <div>
                <p style={{ color: "#ff5500", fontWeight: "700", marginBottom: "5px" }}>CONTACTO DIRECTO</p>
                <p style={{ color: "#fff" }}>+52 1 81 1817 1792</p>
                <p style={{ color: "#fff" }}>franquicias@sneakerz.mx</p>
              </div>
            </div>

            <Link 
              href="https://wa.me/5218118171792"
              style={{ 
                display: "inline-block",
                marginTop: "50px",
                padding: "18px 40px",
                backgroundColor: "#ff5500",
                color: "#fff",
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "1.2rem",
                borderRadius: "8px",
                letterSpacing: "0.1em",
                transition: "transform 0.2s"
              }}
            >
              HABLAR CON UN ASESOR POR WHATSAPP
            </Link>
          </div>

        </div>
      </section>

      {/* Spacer para el footer */}
      <div style={{ height: "100px" }}></div>
    </main>
  );
}
