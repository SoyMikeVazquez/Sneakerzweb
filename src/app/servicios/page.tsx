import type { Metadata } from "next";
import ServicesSection from "@/components/ServicesSection";

export const metadata: Metadata = {
  title: "Servicios | Sneakerz — Limpieza y Restauración Premium",
  description: "Descubre todos nuestros servicios de limpieza y restauración de sneakers, tapicería residencial y artículos de lujo.",
};

export default function ServiciosPage() {
  return (
    <div style={{ paddingTop: "70px" }}>
      <ServicesSection />
    </div>
  );
}
