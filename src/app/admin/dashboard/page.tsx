"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────
interface Booking {
  id: string;
  name?: string;
  nombre?: string;
  Nombre?: string;
  phone?: string;
  telefono?: string;
  Telefono?: string;
  email?: string;
  service?: string;
  servicio?: string;
  address?: string;
  direccion?: string;
  notes?: string;
  status?: string;
  estado?: string;
  created_at: string;
  Activo?: boolean;
  "Foto del antes"?: string;
  "Foto del después"?: string;
  "Hora y fecha de entregado"?: string;
}

// ── Status Badge ───────────────────────────────────────────────────
function StatusBadge({ booking }: { booking: Booking }) {
  if (booking.Activo) {
    return (
      <span style={{ background: "#fff3cd", color: "#856404", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>EN PROCESO</span>
    );
  }
  if (booking["Hora y fecha de entregado"] || booking.status === 'delivered') {
    return (
      <span style={{ background: "#d4edda", color: "#155724", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>ENTREGADO</span>
    );
  }
  return (
    <span style={{ background: "#f0f2f5", color: "#666", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>PENDIENTE</span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; color: string; }) {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1, minWidth: "180px" }}>
      <div>
        <p style={{ fontSize: "0.72rem", color: "#888", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</p>
        <p style={{ fontSize: "1.9rem", fontWeight: 800, color: "#111", lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 600, marginTop: "4px" }}>{sub}</p>}
      </div>
      <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
    </div>
  );
}

// ── Main Dashboard Page ────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase
        .from("Sneakerz")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) setBookings(data);
      setLoading(false);
    };
    init();
  }, []);

  const pendingCount = bookings.filter((b) => (b.status === "pending" || b.Activo)).length;

  const serviceLabels: Record<string, string> = {
    limpieza: "Limpieza Profunda",
    restauracion: "Restauración de Color",
    detailing: "Detailing Premium",
    residencial: "Limpieza Residencial",
  };

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#111" }}>Panel de Control</h1>
        <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "4px" }}>Bienvenido de nuevo al sistema de gestión de Sneakerz.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "40px", flexWrap: "wrap" }}>
        <StatCard label="Pendientes" value={loading ? "—" : pendingCount} sub="+2 hoy" color="#ff5500" icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} />
        <StatCard label="Clientes" value={loading ? "—" : new Set(bookings.map((b) => b.phone || b.Telefono)).size} color="#3b82f6" icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>} />
        <StatCard label="Finalizados" value={loading ? "—" : bookings.length - pendingCount} color="#10b981" icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} />
      </div>

      {/* Recent Bookings Table */}
      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 1px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "24px 32px", borderBottom: "1px solid #f8f8f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111" }}>Pedidos Recientes</h2>
          <Link href="/admin/dashboard/pedidos" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#ff5500", textDecoration: "none" }}>Ver todos →</Link>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["Cliente", "Servicio", "Ubicación", "Fecha", "Estado"].map((h) => (
                  <th key={h} style={{ padding: "14px 32px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#aaa", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#bbb" }}>Cargando datos...</td></tr>
              ) : bookings.map((booking, i) => (
                <tr key={booking.id || i} style={{ borderTop: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "14px 32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {(booking["Foto del antes"] || booking["Foto del después"]) && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={booking["Foto del antes"] || booking["Foto del después"]} alt="Sneaker" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
                      )}
                      <div>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>{booking.Nombre || booking.name || booking.nombre || "Sin nombre"}</p>
                        <p style={{ fontSize: "0.7rem", color: "#999" }}>{booking.Telefono || booking.phone || "Sin tel"}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 32px", fontSize: "0.8rem", color: "#555" }}>{serviceLabels[booking.service || booking.servicio || ""] || (booking.service || booking.servicio || "-")}</td>
                  <td style={{ padding: "14px 32px", fontSize: "0.8rem", color: "#888", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{booking.address || booking.direccion || "-"}</td>
                  <td style={{ padding: "14px 32px", fontSize: "0.75rem", color: "#999" }}>{booking.created_at ? new Date(booking.created_at).toLocaleDateString("es-MX") : "-"}</td>
                  <td style={{ padding: "14px 32px" }}><StatusBadge booking={booking} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
