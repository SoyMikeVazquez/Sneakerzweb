"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "INICIO", href: "/" },
  { label: "SERVICIOS", href: "/servicios" },
  { label: "AGENDA TU RECOLECCIÓN", href: "/agenda" },
  { label: "SUCURSALES", href: "/sucursales" },
  { label: "ADQUIERE TU FRANQUICIA", href: "/franquicias" },
  { label: "DASHBOARD", href: "/admin/login" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`navbar transition-all duration-500 ${scrolled ? "h-[65px] bg-black/90 backdrop-blur-md" : "h-[75px] bg-black"}`}
      style={{ borderBottom: scrolled ? "1px solid rgba(255,85,0,0.3)" : "3px solid var(--orange)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Real logo */}
        <Link href="/" className="flex items-center transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/logomenu.png"
            alt="Sneakerz"
            width={120}
            height={40}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link relative group ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"
                animate={{ width: pathname === link.href ? "100%" : "0%" }}
              />
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu lg:hidden fixed top-[70px] left-0 right-0 glass-card border-none shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`nav-link text-lg ${pathname === link.href ? "text-orange-600" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
