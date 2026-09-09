"use client";

import { useEffect, useState } from "react";
import { supabaseMain } from "@/lib/supabase";

type Sucursal = {
  id: string;
  nombre: string;
  direccion: string;
  horarios: { day: string; hours: string }[];
  map_url: string;
};

type Servicio = {
  id: string;
  title: string;
  description: string;
  image: string;
  image_alt: string;
};

export default function AdministrarPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [sucursalModal, setSucursalModal] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  
  const [servicioModal, setServicioModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: sucursalesData } = await supabaseMain.from("sucursales").select("*").order("created_at", { ascending: true });
    const { data: serviciosData } = await supabaseMain.from("servicios").select("*").order("created_at", { ascending: true });
    
    if (sucursalesData) setSucursales(sucursalesData);
    if (serviciosData) setServicios(serviciosData);
    
    setLoading(false);
  };

  // --- SUCURSAL ACTIONS ---
  const handleSaveSucursal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get("nombre") as string,
      direccion: formData.get("direccion") as string,
      map_url: formData.get("map_url") as string,
      horarios: [
        { day: "Lunes – Viernes", hours: formData.get("h_lv") as string },
        { day: "Sábado", hours: formData.get("h_sab") as string },
        { day: "Domingo", hours: formData.get("h_dom") as string },
      ]
    };

    if (editingSucursal) {
      await supabaseMain.from("sucursales").update(data).eq("id", editingSucursal.id);
    } else {
      await supabaseMain.from("sucursales").insert([data]);
    }
    setSucursalModal(false);
    fetchData();
  };

  const handleDeleteSucursal = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta sucursal?")) {
      await supabaseMain.from("sucursales").delete().eq("id", id);
      fetchData();
    }
  };

  // --- SERVICIO ACTIONS ---
  const handleSaveServicio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image_file") as File;
    let imageUrl = editingServicio?.image || "";

    if (imageFile && imageFile.size > 0) {
      setUploadingImage(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `servicios/${fileName}`;
      
      const { error: uploadError } = await supabaseMain.storage
        .from('images')
        .upload(filePath, imageFile, { upsert: true });
        
      if (uploadError) {
        alert("Error al subir imagen: " + uploadError.message);
        setUploadingImage(false);
        return;
      }
      
      const { data: publicUrlData } = supabaseMain.storage.from('images').getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
      setUploadingImage(false);
    }

    const data = {
      id: formData.get("id") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: imageUrl,
      image_alt: formData.get("image_alt") as string,
    };

    if (editingServicio) {
      await supabaseMain.from("servicios").update(data).eq("id", editingServicio.id);
    } else {
      await supabaseMain.from("servicios").insert([data]);
    }
    setServicioModal(false);
    fetchData();
  };

  const handleDeleteServicio = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      await supabaseMain.from("servicios").delete().eq("id", id);
      fetchData();
    }
  };

  if (loading) {
    return (
      <div style={{ color: "#111" }}>
        <h1 className="text-2xl font-bold mb-4">Administrar Plataforma</h1>
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div style={{ color: "#111" }}>
      <div className="mb-8">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111", marginBottom: "8px" }}>
          Administrar Plataforma
        </h1>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          Gestiona las sucursales y los servicios que se muestran en la landing page.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
        {/* SUCURSALES */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111" }}>Sucursales</h2>
            <button 
              onClick={() => { setEditingSucursal(null); setSucursalModal(true); }}
              style={{ background: "#111", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}
            >
              + Nueva Sucursal
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {sucursales.length === 0 ? (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>No hay sucursales registradas.</p>
            ) : (
              sucursales.map(sucursal => (
                <div key={sucursal.id} style={{ border: "1px solid #eee", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px", color: "#111" }}>{sucursal.nombre}</h3>
                    <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "12px", whiteSpace: "pre-line" }}>{sucursal.direccion}</p>
                    <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ff5500", marginBottom: "8px", textTransform: "uppercase" }}>Horarios</p>
                      {sucursal.horarios?.map((h, i) => (
                        <div key={i} style={{ display: "flex", gap: "16px", fontSize: "0.8rem", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 500, width: "120px", color: "#111" }}>{h.day}</span>
                          <span style={{ color: "#555" }}>{h.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => { setEditingSucursal(sucursal); setSucursalModal(true); }} style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px", border: "1px solid #ddd", background: "#fff", color: "#111", cursor: "pointer" }}>Editar</button>
                    <button onClick={() => handleDeleteSucursal(sucursal.id)} style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer" }}>Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SERVICIOS */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111" }}>Servicios</h2>
            <button 
              onClick={() => { setEditingServicio(null); setServicioModal(true); }}
              style={{ background: "#111", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}
            >
              + Nuevo Servicio
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {servicios.length === 0 ? (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>No hay servicios registrados.</p>
            ) : (
              servicios.map(servicio => (
                <div key={servicio.id} style={{ border: "1px solid #eee", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
                      <img src={servicio.image} alt={servicio.image_alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px", color: "#111" }}>{servicio.title}</h3>
                      <p style={{ color: "#666", fontSize: "0.85rem", maxWidth: "500px" }}>{servicio.description}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => { setEditingServicio(servicio); setServicioModal(true); }} style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px", border: "1px solid #ddd", background: "#fff", color: "#111", cursor: "pointer" }}>Editar</button>
                    <button onClick={() => handleDeleteServicio(servicio.id)} style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer" }}>Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SUCURSAL MODAL */}
      {sucursalModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "500px", color: "#111" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px" }}>{editingSucursal ? "Editar Sucursal" : "Nueva Sucursal"}</h2>
            <form onSubmit={handleSaveSucursal} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>Nombre de Sucursal</label>
                <input required name="nombre" defaultValue={editingSucursal?.nombre} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>Dirección</label>
                <textarea required name="direccion" defaultValue={editingSucursal?.direccion} rows={3} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>URL de Google Maps</label>
                <input required name="map_url" defaultValue={editingSucursal?.map_url} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>Horarios</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", width: "120px" }}>Lunes - Viernes:</span>
                  <input required name="h_lv" defaultValue={editingSucursal?.horarios.find(h => h.day.includes("Viernes"))?.hours || "9:00 AM – 7:00 PM"} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }} />
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", width: "120px" }}>Sábado:</span>
                  <input required name="h_sab" defaultValue={editingSucursal?.horarios.find(h => h.day.includes("Sábado"))?.hours || "10:00 AM – 5:00 PM"} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }} />
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", width: "120px" }}>Domingo:</span>
                  <input required name="h_dom" defaultValue={editingSucursal?.horarios.find(h => h.day.includes("Domingo"))?.hours || "Cerrado"} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button type="button" onClick={() => setSucursalModal(false)} style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#f0f0f0", color: "#111", cursor: "pointer", fontWeight: 600 }}>Cancelar</button>
                <button type="submit" style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#ff5500", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICIO MODAL */}
      {servicioModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "500px", color: "#111" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px" }}>{editingServicio ? "Editar Servicio" : "Nuevo Servicio"}</h2>
            <form onSubmit={handleSaveServicio} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>ID (único, ej. "limpieza-basica")</label>
                <input required name="id" defaultValue={editingServicio?.id} readOnly={!!editingServicio} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", background: editingServicio ? "#f5f5f5" : "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>Título del Servicio</label>
                <input required name="title" defaultValue={editingServicio?.title} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>Descripción</label>
                <textarea required name="description" defaultValue={editingServicio?.description} rows={4} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>Imagen del Servicio</label>
                {editingServicio?.image && (
                  <div style={{ marginBottom: "8px" }}>
                    <img src={editingServicio.image} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" }} />
                  </div>
                )}
                <input type="file" name="image_file" accept="image/*" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
                <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "4px" }}>Sube una imagen o deja vacío para conservar la actual.</p>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>Texto Alternativo (Alt Text)</label>
                <input required name="image_alt" defaultValue={editingServicio?.image_alt} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button type="button" onClick={() => setServicioModal(false)} disabled={uploadingImage} style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#f0f0f0", color: "#111", cursor: "pointer", fontWeight: 600 }}>Cancelar</button>
                <button type="submit" disabled={uploadingImage} style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#ff5500", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                  {uploadingImage ? "Subiendo..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
