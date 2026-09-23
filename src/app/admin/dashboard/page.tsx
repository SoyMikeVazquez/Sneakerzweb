"use client";
import { useEffect, useState, useMemo } from "react";
import { supabaseMain } from "@/lib/supabase";

interface FinanzaRecord {
  id: string;
  nombre_registro: string | null;
  descripcion: string | null;
  monto_cobrar: number | null;
  contacto: string | null;
  created_at: string;
  id_cliente: string | null;
  metodo_pago: string | null;
  isGasto: boolean | null;
  tipo_ingreso: string | null;
  id_sucursal: string | null;
}

interface Sucursal {
  id: string;
  nombre: string;
  direccion?: string;
}

export default function AdminDashboardPage() {
  const [finanzas, setFinanzas] = useState<FinanzaRecord[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tipoFiltro, setTipoFiltro] = useState<"all" | "ingresos" | "gastos">("all");

  // Vista: Tarjetas (App) o Tabla detallada
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Inicializar rango de fechas con la última semana por defecto
  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 6);

    const endStr = today.toISOString().split("T")[0];
    const startStr = lastWeek.toISOString().split("T")[0];

    setEndDate(endStr);
    setStartDate(startStr);

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Cargar sucursales
      const { data: sucData } = await supabaseMain
        .from("sucursales")
        .select("id, nombre, direccion")
        .order("nombre", { ascending: true });
      if (sucData) setSucursales(sucData);

      // 2. Cargar tabla de Finanzas completa
      const { data: finData, error } = await supabaseMain
        .from("Finanzas")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && finData) {
        setFinanzas(finData);
      }
    } catch (e) {
      console.error("Error al cargar finanzas:", e);
    } finally {
      setLoading(false);
    }
  };

  // Diccionario de sucursales por ID para búsqueda rápida
  const branchMap = useMemo(() => {
    const map = new Map<string, string>();
    sucursales.forEach((s) => map.set(s.id, s.nombre));
    return map;
  }, [sucursales]);

  // Accesos rápidos de fechas
  const setQuickRange = (days: number | "all") => {
    if (days === "all") {
      setStartDate("");
      setEndDate("");
      return;
    }
    const today = new Date();
    const past = new Date(today);
    past.setDate(past.getDate() - (days - 1));
    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(past.toISOString().split("T")[0]);
  };

  // Filtrado reactivo de registros
  const filteredRecords = useMemo(() => {
    return finanzas.filter((item) => {
      // Filtro por sucursal
      if (selectedBranch !== "all") {
        if (item.id_sucursal !== selectedBranch) return false;
      }

      // Filtro por fecha
      if (item.created_at) {
        const itemDate = item.created_at.split("T")[0];
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
      }

      // Filtro por tipo de movimiento
      const isExpense =
        item.isGasto === true ||
        item.tipo_ingreso?.toLowerCase() === "gasto" ||
        item.tipo_ingreso?.toLowerCase() === "egreso";
      if (tipoFiltro === "ingresos" && isExpense) return false;
      if (tipoFiltro === "gastos" && !isExpense) return false;

      // Filtro por búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const client = (item.nombre_registro || "").toLowerCase();
        const desc = (item.descripcion || "").toLowerCase();
        const contact = (item.contacto || "").toLowerCase();
        const method = (item.metodo_pago || "").toLowerCase();
        if (!client.includes(q) && !desc.includes(q) && !contact.includes(q) && !method.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [finanzas, selectedBranch, startDate, endDate, tipoFiltro, searchQuery]);

  // Cálculos de métricas según el segmento actual
  const metrics = useMemo(() => {
    let ingresos = 0;
    let gastos = 0;
    let countIngresos = 0;
    let countGastos = 0;

    filteredRecords.forEach((item) => {
      const monto = Number(item.monto_cobrar) || 0;
      const isExpense =
        item.isGasto === true ||
        item.tipo_ingreso?.toLowerCase() === "gasto" ||
        item.tipo_ingreso?.toLowerCase() === "egreso";

      if (isExpense) {
        gastos += monto;
        countGastos++;
      } else {
        ingresos += monto;
        countIngresos++;
      }
    });

    const balance = ingresos - gastos;
    const ticketPromedio = countIngresos > 0 ? ingresos / countIngresos : 0;

    return {
      ingresos,
      gastos,
      balance,
      countIngresos,
      countGastos,
      totalTransacciones: filteredRecords.length,
      ticketPromedio,
    };
  }, [filteredRecords]);

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredRecords.length === 0) return;
    const headers = ["Fecha", "Cliente / Registro", "Descripción", "Tipo", "Sucursal", "Método de Pago", "Monto"];
    const rows = filteredRecords.map((r) => {
      const fecha = r.created_at ? new Date(r.created_at).toLocaleString("es-MX") : "";
      const isExpense = r.isGasto === true || r.tipo_ingreso?.toLowerCase() === "gasto";
      const tipo = isExpense ? "Gasto" : r.tipo_ingreso || "Ingreso";
      const sucursal = r.id_sucursal ? branchMap.get(r.id_sucursal) || r.id_sucursal : "General";
      const monto = (isExpense ? -1 : 1) * (Number(r.monto_cobrar) || 0);
      return [
        `"${fecha}"`,
        `"${r.nombre_registro || ""}"`,
        `"${r.descripcion || ""}"`,
        `"${tipo}"`,
        `"${sucursal}"`,
        `"${r.metodo_pago || "No especificado"}"`,
        monto,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finanzas_sneakerz_${startDate || "inicio"}_${endDate || "fin"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* ── ENCABEZADO Y SELECTOR DE SUCURSAL ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#71717a", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
            <i className="bx bx-store-alt" style={{ fontSize: "1.15rem", color: "#18181b" }} />
            <span>Vista de Sucursal</span>
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
            Dashboard de Finanzas
          </h1>
          <p style={{ color: "#71717a", fontSize: "0.88rem", marginTop: "2px" }}>
            Monitorea el balance consolidado, ingresos y movimientos en tiempo real.
          </p>
        </div>

        {/* Selector de Sucursal */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e4e4e7",
              borderRadius: "12px",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <i className="bx bx-map-pin" style={{ fontSize: "1.1rem", color: "#71717a" }} />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontWeight: 600,
                color: "#18181b",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              <option value="all">Todas las Sucursales</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
            title="Recargar datos"
            style={{
              background: "#fff",
              border: "1px solid #e4e4e7",
              borderRadius: "12px",
              padding: "10px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#3f3f46",
              transition: "all 0.15s",
            }}
          >
            <i className="bx bx-refresh" style={{ fontSize: "1.2rem" }} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* ── BARRA DE SEGMENTACIÓN POR FECHAS ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "16px 20px",
          border: "1px solid #e4e4e7",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Rango de Fechas */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#71717a", textTransform: "uppercase" }}>Desde:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "0.85rem",
                color: "#18181b",
                fontWeight: 500,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#71717a", textTransform: "uppercase" }}>Hasta:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "0.85rem",
                color: "#18181b",
                fontWeight: 500,
                outline: "none",
              }}
            />
          </div>

          {/* Accesos rápidos */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setQuickRange(7)}
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: startDate && endDate && !startDate.includes("2020") ? "#f4f4f5" : "#e4e4e7",
                color: "#18181b",
              }}
            >
              Semana (7d)
            </button>
            <button
              onClick={() => setQuickRange(30)}
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#f4f4f5",
                color: "#18181b",
              }}
            >
              Mes (30d)
            </button>
            <button
              onClick={() => setQuickRange("all")}
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: !startDate && !endDate ? "#18181b" : "#f4f4f5",
                color: !startDate && !endDate ? "#fff" : "#18181b",
              }}
            >
              Todo el Histórico
            </button>
          </div>
        </div>

        {/* Botón Exportar CSV */}
        <button
          onClick={exportToCSV}
          disabled={filteredRecords.length === 0}
          style={{
            background: "#fff",
            border: "1px solid #e4e4e7",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#18181b",
            cursor: filteredRecords.length === 0 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            opacity: filteredRecords.length === 0 ? 0.5 : 1,
          }}
        >
          <i className="bx bx-download" style={{ fontSize: "1.1rem" }} />
          <span>Descargar Reporte CSV</span>
        </button>
      </div>

      {/* ── CARD PRINCIPAL: BALANCE NETO (Estilo Idéntico a la App) ── */}
      <div
        style={{
          background: "#0d0e12",
          borderRadius: "20px",
          padding: "28px 32px",
          color: "#fff",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow decorativo sutil */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(255,210,0,0.15) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Encabezado de la tarjeta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <p style={{ color: "#a1a1aa", fontSize: "0.95rem", fontWeight: 500, margin: 0 }}>
            Balance Neto
          </p>

          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "20px",
              background: metrics.balance >= 0 ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.2)",
              color: metrics.balance >= 0 ? "#4ade80" : "#f87171",
              border: `1px solid ${metrics.balance >= 0 ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.4)"}`,
            }}
          >
            {metrics.balance >= 0 ? "● Operativo Favorable" : "- En Alerta"}
          </span>
        </div>

        {/* Total Principal */}
        <div style={{ marginBottom: "26px" }}>
          <h2
            style={{
              fontSize: "3.2rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1,
              fontFamily: "Inter, sans-serif",
            }}
          >
            ${metrics.balance.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span style={{ fontSize: "1.6rem", fontWeight: 600, marginLeft: "10px", color: "#a1a1aa" }}>
              MXN
            </span>
          </h2>
        </div>

        {/* Línea divisoria */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", marginBottom: "22px" }} />

        {/* Desglose: Ingresos vs Gastos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {/* Ingresos Totales */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4ade80",
              }}
            >
              <i className="bx bx-down-arrow-alt" style={{ fontSize: "1.45rem" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#a1a1aa", margin: 0 }}>Ingresos Totales</p>
              <p style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#fff" }}>
                ${metrics.ingresos.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Gastos Operativos */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f87171",
              }}
            >
              <i className="bx bx-up-arrow-alt" style={{ fontSize: "1.45rem" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#a1a1aa", margin: 0 }}>Gastos Operativos</p>
              <p style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#fff" }}>
                ${metrics.gastos.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MÉTRICAS OPERATIVAS (Cards) ── */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111", marginBottom: "14px" }}>
          Métricas Operativas
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Servicios / Ingresos */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #e4e4e7",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <i className="bx bx-check-circle" style={{ fontSize: "1.35rem", color: "#16a34a" }} />
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#71717a", margin: 0 }}>
                Ingresos Registrados
              </p>
            </div>
            <p style={{ fontSize: "1.85rem", fontWeight: 800, color: "#18181b", margin: 0 }}>
              {metrics.countIngresos}
            </p>
          </div>

          {/* Gastos / Movimientos */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #e4e4e7",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <i className="bx bx-receipt" style={{ fontSize: "1.35rem", color: "#dc2626" }} />
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#71717a", margin: 0 }}>
                Gastos Registrados
              </p>
            </div>
            <p style={{ fontSize: "1.85rem", fontWeight: 800, color: "#18181b", margin: 0 }}>
              {metrics.countGastos}
            </p>
          </div>

          {/* Ticket Promedio */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #e4e4e7",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <i className="bx bx-credit-card" style={{ fontSize: "1.35rem", color: "#3b82f6" }} />
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#71717a", margin: 0 }}>
                Ticket Promedio
              </p>
            </div>
            <p style={{ fontSize: "1.85rem", fontWeight: 800, color: "#18181b", margin: 0 }}>
              ${metrics.ticketPromedio.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Total Transacciones */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #e4e4e7",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <i className="bx bx-transfer-alt" style={{ fontSize: "1.35rem", color: "#8b5cf6" }} />
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#71717a", margin: 0 }}>
                Total Transacciones
              </p>
            </div>
            <p style={{ fontSize: "1.85rem", fontWeight: 800, color: "#18181b", margin: 0 }}>
              {metrics.totalTransacciones}
            </p>
          </div>
        </div>
      </div>

      {/* ── SECCIÓN: ÚLTIMOS MOVIMIENTOS ── */}
      <div style={{ marginBottom: "36px" }}>
        {/* Encabezado con Switch de Vista (Cards App vs Tabla) y Filtros */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111", margin: 0, letterSpacing: "-0.02em" }}>
              Últimos Movimientos
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#71717a", margin: "3px 0 0 0" }}>
              Mostrando {filteredRecords.length} movimiento{filteredRecords.length === 1 ? "" : "s"} ordenados por fecha.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Selector de modo de vista: Tarjetas (App) vs Tabla */}
            <div style={{ display: "flex", background: "#e4e4e7", padding: "3px", borderRadius: "10px" }}>
              <button
                onClick={() => setViewMode("cards")}
                style={{
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: viewMode === "cards" ? "#fff" : "transparent",
                  color: viewMode === "cards" ? "#111" : "#71717a",
                  boxShadow: viewMode === "cards" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                <i className="bx bx-mobile-alt" style={{ fontSize: "1rem" }} />
                <span>Tarjetas (App)</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                style={{
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: viewMode === "table" ? "#fff" : "transparent",
                  color: viewMode === "table" ? "#111" : "#71717a",
                  boxShadow: viewMode === "table" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                <i className="bx bx-table" style={{ fontSize: "1rem" }} />
                <span>Tabla Detallada</span>
              </button>
            </div>

            {/* Pestañas: Todos / Ingresos / Gastos */}
            <div style={{ display: "flex", background: "#f4f4f5", padding: "3px", borderRadius: "10px" }}>
              <button
                onClick={() => setTipoFiltro("all")}
                style={{
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: "7px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: tipoFiltro === "all" ? "#fff" : "transparent",
                  color: tipoFiltro === "all" ? "#18181b" : "#71717a",
                  boxShadow: tipoFiltro === "all" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                Todos
              </button>
              <button
                onClick={() => setTipoFiltro("ingresos")}
                style={{
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: "7px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: tipoFiltro === "ingresos" ? "#fff" : "transparent",
                  color: tipoFiltro === "ingresos" ? "#16a34a" : "#71717a",
                  boxShadow: tipoFiltro === "ingresos" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                Ingresos
              </button>
              <button
                onClick={() => setTipoFiltro("gastos")}
                style={{
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: "7px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: tipoFiltro === "gastos" ? "#fff" : "transparent",
                  color: tipoFiltro === "gastos" ? "#dc2626" : "#71717a",
                  boxShadow: tipoFiltro === "gastos" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                Gastos
              </button>
            </div>

            {/* Buscador */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar movimiento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "1px solid #e4e4e7",
                  borderRadius: "10px",
                  padding: "7px 12px 7px 30px",
                  fontSize: "0.82rem",
                  outline: "none",
                  width: "200px",
                }}
              />
              <i
                className="bx bx-search"
                style={{
                  position: "absolute",
                  left: "9px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.05rem",
                  color: "#a1a1aa",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── CONTENIDO: VISTA DE TARJETAS (ESTILO IDÉNTICO A LA APP) ── */}
        {loading ? (
          <div style={{ background: "#fff", borderRadius: "18px", padding: "60px 20px", textAlign: "center", color: "#a1a1aa", border: "1px solid #e4e4e7" }}>
            <p style={{ fontWeight: 600 }}>Cargando movimientos de Supabase...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "18px", padding: "60px 20px", textAlign: "center", border: "1px solid #e4e4e7" }}>
            <i className="bx bx-folder-open" style={{ fontSize: "3rem", color: "#a1a1aa", display: "block", marginBottom: "8px" }} />
            <p style={{ fontWeight: 700, color: "#18181b", fontSize: "1.05rem", margin: "4px 0" }}>
              No hay movimientos para este filtro
            </p>
            <p style={{ color: "#71717a", fontSize: "0.85rem", maxWidth: "400px", margin: "0 auto 16px auto" }}>
              No se encontraron registros en el rango de fechas o sucursal seleccionada.
            </p>
            <button
              onClick={() => setQuickRange("all")}
              style={{
                background: "#18181b",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ver todo el histórico
            </button>
          </div>
        ) : viewMode === "cards" ? (
          /* LISTA DE TARJETAS TIPO APP */
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredRecords.map((item) => {
              const isExpense =
                item.isGasto === true ||
                item.tipo_ingreso?.toLowerCase() === "gasto" ||
                item.tipo_ingreso?.toLowerCase() === "egreso";

              const sucursalNombre = item.id_sucursal
                ? branchMap.get(item.id_sucursal) || "Sucursal"
                : "";

              const montoNum = Number(item.monto_cobrar) || 0;

              return (
                <div
                  key={item.id}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #111",
                    borderRadius: "20px",
                    padding: "16px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                  }}
                >
                  {/* Izquierda: Ícono Squircle + Textos */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Ícono Squircle con Boxicons */}
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        background: isExpense ? "#fee2e2" : "#e8f7ee",
                        color: isExpense ? "#dc2626" : "#16a34a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isExpense ? (
                        <i className="bx bx-up-arrow-alt" style={{ fontSize: "1.8rem", fontWeight: 700 }} />
                      ) : (
                        <i className="bx bx-down-arrow-alt" style={{ fontSize: "1.8rem", fontWeight: 700 }} />
                      )}
                    </div>

                    <div>
                      {/* Título */}
                      <h4
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "#111",
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {item.nombre_registro || item.tipo_ingreso || "Movimiento"}
                      </h4>

                      {/* Subtítulo / Detalle */}
                      <p
                        style={{
                          fontSize: "0.88rem",
                          color: "#71717a",
                          margin: "3px 0 0 0",
                          fontWeight: 500,
                        }}
                      >
                        {item.descripcion || "here"}
                        {sucursalNombre && ` • ${sucursalNombre}`}
                        {item.metodo_pago && ` • ${item.metodo_pago}`}
                      </p>
                    </div>
                  </div>

                  {/* Derecha: Monto */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: "1.22rem",
                        fontWeight: 800,
                        color: isExpense ? "#dc2626" : "#16a34a",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {isExpense ? "-" : "+"}${montoNum.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── VISTA ALTERNATIVA: TABLA DETALLADA ── */
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              border: "1px solid #e4e4e7",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "1px solid #f4f4f5", color: "#71717a", fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "14px 20px" }}>Fecha / Hora</th>
                    <th style={{ padding: "14px 20px" }}>Cliente / Registro</th>
                    <th style={{ padding: "14px 20px" }}>Descripción</th>
                    <th style={{ padding: "14px 20px" }}>Sucursal</th>
                    <th style={{ padding: "14px 20px" }}>Tipo</th>
                    <th style={{ padding: "14px 20px" }}>Método de Pago</th>
                    <th style={{ padding: "14px 20px", textAlign: "right" }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((item) => {
                    const isExpense =
                      item.isGasto === true ||
                      item.tipo_ingreso?.toLowerCase() === "gasto" ||
                      item.tipo_ingreso?.toLowerCase() === "egreso";

                    const sucursalNombre = item.id_sucursal
                      ? branchMap.get(item.id_sucursal) || "Sucursal"
                      : "General";

                    const fechaFormatted = item.created_at
                      ? new Date(item.created_at).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "—";

                    const montoNum = Number(item.monto_cobrar) || 0;

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: "1px solid #f4f4f5",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {/* Fecha */}
                        <td style={{ padding: "16px 20px", color: "#71717a", whiteSpace: "nowrap", fontSize: "0.83rem" }}>
                          {fechaFormatted}
                        </td>

                        {/* Cliente */}
                        <td style={{ padding: "16px 20px" }}>
                          <p style={{ fontWeight: 700, color: "#18181b", margin: 0 }}>
                            {item.nombre_registro || "Sin Nombre"}
                          </p>
                          {item.contacto && (
                            <p style={{ fontSize: "0.78rem", color: "#a1a1aa", margin: "2px 0 0 0" }}>
                              {item.contacto}
                            </p>
                          )}
                        </td>

                        {/* Descripción */}
                        <td style={{ padding: "16px 20px", color: "#3f3f46", maxWidth: "260px" }}>
                          <span style={{ fontSize: "0.85rem" }}>{item.descripcion || "—"}</span>
                        </td>

                        {/* Sucursal */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              padding: "4px 8px",
                              borderRadius: "6px",
                              background: "#f4f4f5",
                              color: "#52525b",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <i className="bx bx-map-pin" style={{ fontSize: "0.9rem" }} />
                            <span>{sucursalNombre}</span>
                          </span>
                        </td>

                        {/* Tipo */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              padding: "3px 9px",
                              borderRadius: "20px",
                              background: isExpense ? "#fee2e2" : "#dcfce7",
                              color: isExpense ? "#b91c1c" : "#15803d",
                            }}
                          >
                            {isExpense ? "Gasto" : item.tipo_ingreso || "Servicio"}
                          </span>
                        </td>

                        {/* Método de Pago */}
                        <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              padding: "4px 10px",
                              borderRadius: "8px",
                              background:
                                item.metodo_pago === "Efectivo"
                                  ? "#ecfdf5"
                                  : item.metodo_pago === "Tarjeta"
                                    ? "#eff6ff"
                                    : item.metodo_pago === "Transferencia"
                                      ? "#faf5ff"
                                      : "#f4f4f5",
                              color:
                                item.metodo_pago === "Efectivo"
                                  ? "#059669"
                                  : item.metodo_pago === "Tarjeta"
                                    ? "#2563eb"
                                    : item.metodo_pago === "Transferencia"
                                      ? "#7c3aed"
                                      : "#71717a",
                            }}
                          >
                            {item.metodo_pago || "No definido"}
                          </span>
                        </td>

                        {/* Monto */}
                        <td style={{ padding: "16px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: "1.05rem",
                              color: isExpense ? "#dc2626" : "#16a34a",
                            }}
                          >
                            {isExpense ? "-" : "+"} ${montoNum.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
