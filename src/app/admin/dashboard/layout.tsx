"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabaseMain } from "@/lib/supabase";
import Link from "next/link";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: "Finanzas y Pedidos",
    href: "/admin/dashboard/finanzas",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Administrar",
    href: "/admin/dashboard/administrar",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
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
    const checkAuth = async () => {
      const { data: { session } } = await supabaseMain.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
      } else {
        setUserEmail(session.user.email ?? "");
        setChecking(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabaseMain.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/admin/login");
        } else {
          setUserEmail(session.user.email ?? "");
        }
      }
    );

    return () => subscription.unsubscribe();
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
          <div style={{ width: "32px", height: "32px", background: "#111", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#ff5500", fontWeight: 800, fontSize: "0.8rem", fontFamily: "Bebas Neue" }}>SZ</span>
          </div>
          {sidebarOpen && <span style={{ fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.1em", color: "#111" }}>SNEAKERZ</span>}
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
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            {sidebarOpen && <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? "220px" : "70px", transition: "margin 0.25s ease", display: "flex", flexDirection: "column" }}>
        
        {/* Topbar */}
        <header style={{ height: "64px", background: "#fff", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 90 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
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
