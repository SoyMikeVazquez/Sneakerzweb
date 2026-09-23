"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      {/* Orange top line */}
      <div className="orange-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <h3
              className="font-bebas mb-3"
              style={{ fontSize: "1.8rem", color: "var(--orange)", letterSpacing: "0.1em" }}
            >
              SNEAKERZ
            </h3>
            <p className="text-sm mb-3" style={{ color: "var(--gray-light)" }}>
              © 2027 by SNEAKERZ
            </p>
            <Link
              href="/aviso-privacidad"
              className="text-sm"
              style={{ color: "var(--gray)", textDecoration: "underline" }}
            >
              Consulta nuestro Aviso de privacidad
            </Link>
          </div>

          {/* Explora */}
          <div>
            <h4
              className="font-bebas mb-5"
              style={{ fontSize: "1.2rem", color: "var(--orange)", letterSpacing: "0.1em" }}
            >
              EXPLORA
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Servicios", href: "/servicios" },
                { label: "Sucursales", href: "/sucursales" },
                { label: "Preguntas Frecuentes", href: "/servicios" },
                { label: "Adquiere tu franquicia", href: "/franquicias" },
              ].map((link) => (
                <Link key={link.href + link.label} href={link.href} className="footer-nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h4
              className="font-bebas mb-5"
              style={{ fontSize: "1.2rem", color: "var(--orange)", letterSpacing: "0.1em" }}
            >
              CONTACTO
            </h4>
            <div className="flex flex-col gap-4">
              {/* Botón Adquirir Franquicia */}
              <a
                href="https://guiadefranquicias.com/franquicia/688847"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-black font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-md group"
                style={{
                  background: "var(--yellow, #FFD200)",
                  color: "#000",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textDecoration: "none",
                  width: "fit-content",
                  marginBottom: "4px"
                }}
              >
                <span>Adquiere tu Franquicia</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth={2.5} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M7 17l9.2-9.2M17 17V8H8" />
                </svg>
              </a>

              {/* Phone */}
              <a
                href="tel:+5218118171792"
                className="flex items-center gap-3 text-sm transition-colors"
                style={{ color: "var(--gray-light)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +52 1 81 1817 1792
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/5218118171792"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm transition-colors"
                style={{ color: "var(--gray-light)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.774L0 32l8.456-2.01A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.073 22.38c-.337.947-1.965 1.81-2.712 1.924-.694.107-1.572.152-2.537-.16a22.88 22.88 0 01-2.3-.85c-4.048-1.748-6.69-5.838-6.89-6.11-.2-.27-1.632-2.17-1.632-4.14s1.033-2.94 1.4-3.34c.366-.4.8-.5 1.065-.5.265 0 .532.003.765.013.245.012.574-.092.898.686.337.8 1.146 2.77 1.248 2.97.1.2.166.434.033.7-.134.267-.2.433-.4.666-.2.234-.42.523-.6.703-.2.2-.408.416-.176.816.234.4 1.04 1.71 2.232 2.77 1.532 1.367 2.823 1.79 3.223 1.99.4.2.633.167.866-.1.234-.267 1-1.167 1.267-1.567.267-.4.533-.333.9-.2.367.133 2.333 1.1 2.733 1.3.4.2.666.3.766.467.1.166.1.966-.237 1.913z" />
                </svg>
                WhatsApp
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-4 mt-1">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gray-light)" }} className="hover:text-yellow transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gray-light)" }} className="hover:text-yellow transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
