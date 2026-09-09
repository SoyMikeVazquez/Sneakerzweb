"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseMain } from "@/lib/supabase";

export default function OrderStatus() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setOrders([]);

    try {
      // Query the Finanzas table by email using supabaseMain
      const { data, error: sbError } = await supabaseMain
        .from("Finanzas")
        .select("*")
        .ilike("contacto", cleanEmail)
        .order("created_at", { ascending: false });

      if (sbError) {
        throw sbError;
      }

      setOrders(data || []);
    } catch (err: any) {
      console.error("Error fetching order status:", err);
      setError("No pudimos encontrar información con este correo o hubo un error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ background: "#0a0a0a", padding: "80px 24px" }} id="estatus">
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        
        <p style={{
          color: "#ff5500",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          ✦ SEGUIMIENTO DE SERVICIO
        </p>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          color: "#fff",
          lineHeight: 1,
          marginBottom: "20px",
        }}>
          ESTATUS DE TUS <span style={{ color: "#ff5500" }}>SNEAKERS</span>
        </h2>
        <p style={{ color: "#888", fontSize: "1rem", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
          Ingresa el correo electrónico con el que registraste tu servicio para conocer el avance y ver el historial de pedidos.
        </p>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", maxWidth: "500px", margin: "0 auto", marginBottom: "40px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#666" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico..."
              style={{
                width: "100%",
                padding: "16px 20px 16px 48px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#111",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#ff5500"}
              onBlur={(e) => e.target.style.borderColor = "#333"}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#444" : "#ff5500",
              color: "#fff",
              border: "none",
              padding: "0 32px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => { if(!loading) e.currentTarget.style.background = "#dd4400" }}
            onMouseLeave={(e) => { if(!loading) e.currentTarget.style.background = "#ff5500" }}
          >
            {loading ? "BUSCANDO..." : "BUSCAR"}
          </button>
        </form>

        <AnimatePresence>
          {searched && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ textAlign: "left" }}
            >
              {error ? (
                <div style={{ background: "#ff000020", color: "#ff5555", padding: "20px", borderRadius: "12px", border: "1px solid #ff000040", textAlign: "center" }}>
                  {error}
                </div>
              ) : orders.length === 0 ? (
                <div style={{ background: "#1a1a1a", color: "#aaa", padding: "40px 20px", borderRadius: "12px", border: "1px solid #333", textAlign: "center" }}>
                  <svg width="48" height="48" fill="none" stroke="#555" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>No se encontraron servicios registrados con el correo <strong>{email}</strong>.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {orders.map((order) => {
                    const statusText = order.estatus ? order.estatus.toUpperCase() : "INICIO";
                    
                    let statusColor = "#0ea5e9"; // Blue for Inicio
                    if (statusText === "EN PROCESO") statusColor = "#f59e0b"; // Orange/Yellow
                    if (statusText === "FINALIZADO") statusColor = "#22c55e"; // Green

                    const restante = Number(order.monto_cobrar) - Number(order.adelanto);

                    return (
                      <div key={order.id} style={{
                        background: "#111",
                        border: "1px solid #333",
                        borderRadius: "16px",
                        padding: "32px",
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        {/* Status color top border */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: statusColor }} />
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
                          <div>
                            <h3 style={{ fontSize: "1.4rem", color: "#fff", fontWeight: 700, marginBottom: "8px", textTransform: "capitalize" }}>
                              Servicio: {order.descripcion}
                            </h3>
                            <p style={{ color: "#888", fontSize: "0.9rem" }}>
                              <strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString("es-MX", { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <div style={{
                            background: `${statusColor}20`,
                            color: statusColor,
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            letterSpacing: "0.05em"
                          }}>
                            {statusText}
                          </div>
                        </div>

                        {/* Finanzas Summary */}
                        <div style={{ 
                          marginTop: "24px", 
                          display: "flex", 
                          gap: "16px", 
                          flexWrap: "wrap",
                          background: "#1a1a1a",
                          padding: "20px",
                          borderRadius: "12px",
                          border: "1px solid #222"
                        }}>
                          <div style={{ flex: 1, minWidth: "120px" }}>
                            <p style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Monto Total</p>
                            <p style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>${Number(order.monto_cobrar).toFixed(2)}</p>
                          </div>
                          <div style={{ flex: 1, minWidth: "120px" }}>
                            <p style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Adelanto / Apartado</p>
                            <p style={{ color: "#22c55e", fontSize: "1.5rem", fontWeight: 700 }}>${Number(order.adelanto).toFixed(2)}</p>
                          </div>
                          <div style={{ flex: 1, minWidth: "120px" }}>
                            <p style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Restante</p>
                            <p style={{ color: "#ff5500", fontSize: "1.5rem", fontWeight: 700 }}>${restante.toFixed(2)}</p>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
