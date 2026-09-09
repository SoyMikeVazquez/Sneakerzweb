"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseMain } from "@/lib/supabase"; // Usando la nueva base de datos principal

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState(""); // Nuevo campo para el nombre
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Alternar entre login y registro

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isRegistering) {
      // --- LÓGICA DE REGISTRO ---
      const { data, error: signUpError } = await supabaseMain.auth.signUp({
        email,
        password,
        options: {
          data: { nombre }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Asignar isAdmin: true en la tabla users
        const { error: updateError } = await supabaseMain
          .from('users')
          .update({ is_admin: true })
          .eq('id', data.user.id);

        if (updateError) {
          setError("Usuario creado, pero hubo un problema con los permisos.");
        } else {
          setSuccess("¡Administrador registrado con éxito! Ya puedes iniciar sesión.");
          setIsRegistering(false);
        }
      }
    } else {
      // --- LÓGICA DE LOGIN ---
      const { data, error: authError } = await supabaseMain.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Credenciales inválidas o el usuario no existe.");
        setLoading(false);
        return;
      }

      // Verificar si es admin antes de entrar al dashboard
      const { data: userData, error: userError } = await supabaseMain
        .from('users')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        await supabaseMain.auth.signOut();
        setError(`Error al verificar permisos: ${userError.message}`);
        setLoading(false);
        return;
      }

      if (!userData?.is_admin) {
        await supabaseMain.auth.signOut();
        setError("Acceso denegado. No tienes permisos de administrador.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#f0f2f5" }}>
      <div className="w-full max-w-md flex flex-col items-center" style={{ padding: "0 16px" }}>
        
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{ background: "#111" }}>
            <span style={{ fontFamily: "Bebas Neue, sans-serif", color: "#ff5500", fontSize: "1.4rem" }}>SZ</span>
          </div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#111" }}>
            {isRegistering ? "CREAR ADMINISTRADOR" : "ADMINISTRACIÓN"}
          </h1>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            {isRegistering ? "Registra una nueva cuenta de gestión" : "Ingresa tus credenciales"}
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full" style={{ background: "#fff", borderRadius: "16px", padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            
            {isRegistering && (
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#333", display: "block", marginBottom: "6px" }}>Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Vidal Cavazos"
                  required
                  style={{ width: "100%", padding: "12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", color: "#000" }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#333", display: "block", marginBottom: "6px" }}>Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vidal@example.com"
                required
                style={{ width: "100%", padding: "12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", color: "#000" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#333", display: "block", marginBottom: "6px" }}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: "100%", padding: "12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", color: "#000" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#aaa", fontSize: "0.8rem", background: "none", border: "none" }}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {error && <div style={{ color: "#e53e3e", fontSize: "0.85rem", background: "#fff5f5", padding: "10px", borderRadius: "8px" }}>⚠️ {error}</div>}
            {success && <div style={{ color: "#38a169", fontSize: "0.85rem", background: "#f0fff4", padding: "10px", borderRadius: "8px" }}>✅ {success}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#ccc" : "#ff5500",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "PROCESANDO..." : isRegistering ? "REGISTRAR ADMIN" : "ENTRAR AL PANEL →"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => { setIsRegistering(!isRegistering); setError(null); setSuccess(null); }}
              style={{ background: "none", border: "none", color: "#ff5500", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}
            >
              {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate como Admin"}
            </button>
          </div>
        </div>

        <p style={{ color: "#bbb", fontSize: "0.8rem", marginTop: "32px" }}>© 2026 Sneakerz.mx — Panel Administrativo</p>
      </div>
    </div>
  );
}
