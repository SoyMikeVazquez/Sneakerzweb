"use client";
import { useState, useEffect } from "react";
import { supabaseMain } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function FinanzasPage() {
  const [nombreRegistro, setNombreRegistro] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [contacto, setContacto] = useState("");
  const [metodoPago, setMetodoPago] = useState("Transferencia");
  const [tipoIngreso, setTipoIngreso] = useState("Servicio");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [finanzasList, setFinanzasList] = useState<any[]>([]);

  // Fechas para el dashboard
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Configurar fechas iniciales (últimos 7 días)
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 6);
    
    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(lastWeek.toISOString().split("T")[0]);

    fetchFinanzas();
  }, []);

  const fetchFinanzas = async () => {
    const { data } = await supabaseMain
      .from("Finanzas")
      .select("*")
      .eq("isGasto", false) // Solo ingresos por ahora
      .order("created_at", { ascending: false });
    
    if (data) {
      setFinanzasList(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Inserción directa en Supabase para compatibilidad con hosting estático (Hostinger)
      const { data, error } = await supabaseMain
        .from("Finanzas")
        .insert([{
          nombre_registro: nombreRegistro,
          descripcion: descripcion,
          monto_cobrar: parseFloat(monto) || 0,
          contacto: contacto,
          metodo_pago: metodoPago,
          tipo_ingreso: tipoIngreso,
          isGasto: false // Solo ingresos
        }])
        .select();

      if (error) throw error;

      setSuccessMsg("Ingreso guardado exitosamente.");
      setNombreRegistro("");
      setDescripcion("");
      setMonto("");
      setContacto("");
      setMetodoPago("Transferencia");
      setTipoIngreso("Servicio");
      fetchFinanzas();
    } catch (err: any) {
      setErrorMsg("Error al guardar en la base de datos: " + err.message);
    }
    setLoading(false);
  };

  const getMethodColor = (method: string) => {
    if (method === "Efectivo") return { bg: "#d1fae5", text: "#065f46" };
    if (method === "Tarjeta") return { bg: "#e0f2fe", text: "#075985" };
    return { bg: "#fef3c7", text: "#92400e" }; // Transferencia
  };

  // Calcular los registros filtrados
  const getFilteredRecords = () => {
    if (!startDate || !endDate) return [];
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay, 0, 0, 0);
    const end = new Date(endYear, endMonth - 1, endDay, 23, 59, 59);

    return finanzasList.filter(item => {
      const date = new Date(item.created_at);
      return date >= start && date <= end;
    });
  };

  const filteredRecords = getFilteredRecords();

  // Procesar datos para la gráfica
  const getChartData = () => {
    if (!startDate || !endDate) return [];
    
    // Crear fechas con la zona horaria local considerando el inicio y fin del día
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    
    const start = new Date(startYear, startMonth - 1, startDay, 0, 0, 0);
    const end = new Date(endYear, endMonth - 1, endDay, 23, 59, 59);

    const grouped: Record<string, { dateStr: string, monto: number }> = {};
    
    // Rellenar días intermedios con 0
    let curr = new Date(start);
    // Para evitar loops infinitos si seleccionan rangos muy grandes, lo limitamos
    let safetyCounter = 0;
    while (curr <= end && safetyCounter < 365) {
      const dateStr = curr.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
      grouped[dateStr] = { dateStr, monto: 0 };
      curr.setDate(curr.getDate() + 1);
      safetyCounter++;
    }

    filteredRecords.forEach(item => {
      const d = new Date(item.created_at);
      const dateStr = d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
      if (grouped[dateStr]) {
        grouped[dateStr].monto += Number(item.monto_cobrar) || 0;
      }
    });

    return Object.values(grouped);
  };

  const chartData = getChartData();
  const totalMonto = chartData.reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111" }}>Finanzas y Pedidos</h1>
        <p style={{ color: "#888", fontSize: "0.85rem", marginTop: "2px" }}>
          Registra servicios, cobros, actualiza estatus y monitorea tus ingresos.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start", marginBottom: "32px" }}>
        
        {/* Formulario */}
        <div style={{ background: "#fff", padding: "32px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "24px", color: "#111" }}>Nuevo Registro</h2>
          
          {errorMsg && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "20px" }}>{errorMsg}</div>}
          {successMsg && <div style={{ background: "#d1fae5", color: "#065f46", padding: "12px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "20px" }}>{successMsg}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "6px" }}>Nombre del Cliente / Registro</label>
              <input type="text" required value={nombreRegistro} onChange={(e) => setNombreRegistro(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem", outline: "none", color: "#333" }} placeholder="Ej. Juan Pérez" />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "6px" }}>Registro de Finanzas (Descripción)</label>
              <input type="text" required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem", outline: "none", color: "#333" }} placeholder="Ej. Limpieza Profunda Jordan 4" />
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "6px" }}>Monto del Ingreso ($)</label>
                <input type="number" required min="0" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem", outline: "none", color: "#333" }} placeholder="0.00" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "6px" }}>Tipo de Ingreso</label>
                <select value={tipoIngreso} onChange={(e) => setTipoIngreso(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem", outline: "none", color: "#333", background: "#fff", cursor: "pointer" }}>
                  <option value="Servicio">Servicio</option>
                  <option value="Producto">Producto</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "6px" }}>Contacto (Nombre, Tel, etc.)</label>
                <input type="text" required value={contacto} onChange={(e) => setContacto(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem", outline: "none", color: "#333" }} placeholder="Información de contacto" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "6px" }}>Método de Pago</label>
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem", outline: "none", color: "#333", background: "#fff", cursor: "pointer" }}>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", marginTop: "8px", background: "#ff5500", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "0.2s", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Guardando..." : "Subir y Notificar"}
            </button>
          </form>
        </div>

        {/* Historial Reciente */}
        <div style={{ background: "#fff", padding: "32px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", maxHeight: "580px", overflowY: "auto" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "24px", color: "#111" }}>Registros Activos</h2>
          
          {finanzasList.length === 0 ? (
            <p style={{ color: "#999", fontSize: "0.85rem", textAlign: "center", padding: "20px 0" }}>No hay registros financieros aún.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {finanzasList.map((item, idx) => {
                const colors = getMethodColor(item.metodo_pago || "Transferencia");
                
                return (
                  <div key={item.id || idx} style={{ padding: "16px", border: "1px solid #f0f0f0", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111" }}>{item.nombre_registro}</p>
                        <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "2px" }}>{item.descripcion}</p>
                        <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "6px" }}>{item.contacto}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10b981" }}>+ ${item.monto_cobrar}</p>
                        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>{item.tipo_ingreso}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px dashed #eee", paddingTop: "12px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888" }}>MÉTODO DE PAGO:</span>
                      
                      <span style={{ 
                        padding: "4px 12px", 
                        borderRadius: "20px", 
                        fontSize: "0.75rem", 
                        fontWeight: 700, 
                        background: colors.bg,
                        color: colors.text
                      }}>
                        {item.metodo_pago}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DASHBOARD DE FINANZAS */}
      <div style={{ background: "#fff", padding: "32px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111" }}>Dashboard de Ingresos</h2>
            <p style={{ color: "#888", fontSize: "0.85rem", marginTop: "4px" }}>Visualiza los ingresos por periodo.</p>
          </div>
          
          {/* Controles de fecha */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#999", marginBottom: "4px", textTransform: "uppercase" }}>Desde</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none", color: "#333", background: "#f8fafc" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#999", marginBottom: "4px", textTransform: "uppercase" }}>Hasta</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none", color: "#333", background: "#f8fafc" }}
              />
            </div>
          </div>
        </div>

        {/* Resumen de KPIs */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px", padding: "20px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Total de Ingresos</p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981", lineHeight: 1 }}>${totalMonto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <div style={{ flex: 1, minWidth: "200px", padding: "20px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Total de Transacciones</p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{chartData.filter(d => d.monto > 0).length}</p>
          </div>
        </div>

        {/* Gráfica Recharts */}
        <div style={{ height: "350px", width: "100%", marginTop: "20px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", fontSize: "0.85rem" }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, ""]}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "0.85rem", marginTop: "10px" }} />
              <Bar dataKey="monto" name="Ingreso Total" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de registros filtrados */}
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111", marginBottom: "16px" }}>Detalle de Registros ({filteredRecords.length})</h3>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ textAlign: "left", padding: "12px", color: "#64748b", fontWeight: 700 }}>FECHA</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#64748b", fontWeight: 700 }}>CLIENTE / REGISTRO</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#64748b", fontWeight: 700 }}>DESCRIPCIÓN</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#64748b", fontWeight: 700 }}>TIPO</th>
                  <th style={{ textAlign: "right", padding: "12px", color: "#64748b", fontWeight: 700 }}>MONTO</th>
                  <th style={{ textAlign: "center", padding: "12px", color: "#64748b", fontWeight: 700 }}>MÉTODO</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#999" }}>No hay registros en este periodo.</td>
                  </tr>
                ) : (
                  filteredRecords.map((item, idx) => (
                    <tr key={item.id || idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px", color: "#333" }}>{new Date(item.created_at).toLocaleDateString("es-MX")}</td>
                      <td style={{ padding: "12px", color: "#111", fontWeight: 600 }}>{item.nombre_registro}</td>
                      <td style={{ padding: "12px", color: "#666" }}>{item.descripcion}</td>
                      <td style={{ padding: "12px", color: "#666" }}>{item.tipo_ingreso}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#10b981", fontWeight: 700 }}>${Number(item.monto_cobrar).toFixed(2)}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span style={{ 
                          background: getMethodColor(item.metodo_pago || "Transferencia").bg, 
                          color: getMethodColor(item.metodo_pago || "Transferencia").text, 
                          padding: "4px 8px", 
                          borderRadius: "12px", 
                          fontSize: "0.75rem", 
                          fontWeight: 700 
                        }}>
                          {item.metodo_pago || "Transferencia"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
