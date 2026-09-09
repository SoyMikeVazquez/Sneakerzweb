import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Agenda tu Recolección | Sneakerz",
  description:
    "Agenda fácilmente tu recolección de sneakers o artículos de lujo con Sneakerz. Servicio a domicilio en Monterrey.",
};

export default function AgendaPage() {
  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16 text-center lg:text-left">
          <h1 className="font-bebas text-white mb-4" style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 1 }}>
            AGENDA TU <span style={{ color: "var(--orange)" }}>RECOLECCIÓN</span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg">
            Estamos listos para darle nueva vida a tus piezas. Sigue los pasos y uno de nuestros agentes se encargará del resto.
          </p>
        </div>

        <BookingForm />
      </div>
    </div>
  );
}
