"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabaseMain } from "@/lib/supabase";
import Link from "next/link";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <i className="bx bxs-dashboard" style={{ fontSize: "1.25rem" }} />,
  },
  /* Ocultos temporalmente por requerimiento
  {
    label: "Finanzas y Pedidos",
    href: "/admin/dashboard/finanzas",
    icon: <i className="bx bx-dollar-circle" style={{ fontSize: "1.25rem" }} />,
  },
  {
    label: "Administrar",
    href: "/admin/dashboard/administrar",
    icon: <i className="bx bx-cog" style={{ fontSize: "1.25rem" }} />,
  },
  */
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const { data: { session } } = await supabaseMain.auth.getSession();
      if (!session) {
        if (isMounted) router.replace("/admin/login");
        return;
      }

      // Verify superAdmin status
      const { data: userData, error } = await supabaseMain
        .from('users')
        .select('superAdmin')
        .eq('id', session.user.id)
        .single();

      if (error || !userData?.superAdmin) {
        await supabaseMain.auth.signOut();
        if (isMounted) router.replace("/admin/login?error=unauthorized");
        return;
      }

      if (isMounted) {
        setUserEmail(session.user.email ?? "");
        setChecking(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabaseMain.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          if (isMounted) router.replace("/admin/login");
        } else {
          // Also verify on auth state changes (e.g. initial login)
          const { data: userData } = await supabaseMain
            .from('users')
            .select('superAdmin')
            .eq('id', session.user.id)
            .single();

          if (!userData?.superAdmin) {
            await supabaseMain.auth.signOut();
            if (isMounted) router.replace("/admin/login?error=unauthorized");
          } else if (isMounted) {
            setUserEmail(session.user.email ?? "");
            setChecking(false); // Make sure to hide the loader if this fired late
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabaseMain.auth.signOut();
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#ffffff" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #eee",
              borderTop: "3px solid #ff5500",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <p style={{ color: "#888", fontSize: "0.85rem" }}>Verificando sesión...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const initials = userEmail.slice(0, 2).toUpperCase() || "AD";

  // Rutas que NO queremos que tengan el sidebar
  const isExcluded = pathname === "/admin/login";
  if (isExcluded) return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? "220px" : "70px", background: "#fff", borderRight: "1px solid #ebebeb", display: "flex", flexDirection: "column", transition: "width 0.25s ease", overflow: "hidden", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100 }}>
        <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #f8f8f8" }}>
          <div style={{ width: "100%", display: "flex", justifyContent: sidebarOpen ? "flex-start" : "center", overflow: "hidden" }}>
            <span style={{ 
              fontFamily: "'Bebas Neue', sans-serif", 
              fontSize: sidebarOpen ? "1.8rem" : "1.6rem", 
              letterSpacing: sidebarOpen ? "2px" : "1px", 
              color: "#111", 
              fontWeight: 900, 
              lineHeight: 1,
              whiteSpace: "nowrap",
              userSelect: "none"
            }}>
              {sidebarOpen ? "Sneakerz" : "SZ"}
            </span>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: "20px 12px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", color: isActive ? "#ff5500" : "#666", background: isActive ? "#fff5f0" : "transparent", textDecoration: "none", marginBottom: "4px", transition: "all 0.2s" }}>
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #f8f8f8" }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", color: "#e53e3e", background: "none", border: "none", cursor: "pointer" }}>
            <i className="bx bx-log-out" style={{ fontSize: "1.25rem" }} />
            {sidebarOpen && <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? "220px" : "70px", transition: "margin 0.25s ease", display: "flex", flexDirection: "column" }}>
        
        {/* Topbar */}
        <header style={{ height: "64px", background: "#fff", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 90 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <i className="bx bx-menu" style={{ fontSize: "1.6rem" }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111", lineHeight: 1 }}>{userEmail.split("@")[0]}</p>
              <p style={{ fontSize: "0.7rem", color: "#999", marginTop: "2px" }}>Administrador</p>
            </div>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#111", fontSize: "0.8rem" }}>
              {initials}
            </div>
          </div>
        </header>

        <div style={{ padding: "32px", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
