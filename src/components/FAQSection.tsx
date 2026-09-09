"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "¿Cuánto tiempo toma el servicio?",
    a: "El tiempo varía según el servicio. La limpieza básica de sneakers toma entre 3-5 días hábiles. Servicios de restauración o personalización pueden tomar entre 7-14 días. Te mantenemos informado en todo momento.",
  },
  {
    q: "¿Hacen recolección a domicilio?",
    a: "¡Sí! Ofrecemos servicio de recolección y entrega a domicilio en el área metropolitana de Monterrey. También puedes llevar tus piezas directamente a cualquiera de nuestras sucursales.",
  },
  {
    q: "¿Qué marcas trabajan?",
    a: "Trabajamos con todas las marcas: Nike, Adidas, Jordan, New Balance, Converse, Vans, Balenciaga, Louis Vuitton, Gucci, Prada, Hermès y muchas más. Si tienes dudas, contáctanos.",
  },
  {
    q: "¿Los productos que usan dañan los materiales?",
    a: "No. Utilizamos exclusivamente productos premium especialmente formulados para cada tipo de material: cuero, gamuza, malla, lona, etc. Todos nuestros productos son seguros y probados por expertos.",
  },
  {
    q: "¿Tienen garantía?",
    a: "Sí. Si no quedas 100% satisfecho con el resultado, lo volvemos a hacer sin costo adicional. Tu satisfacción es nuestra prioridad y garantía total.",
  },
  {
    q: "¿Cuánto cuesta el servicio?",
    a: "Los precios varían según el tipo de servicio, el estado de la preza y la marca. Contáctanos por WhatsApp o visita una de nuestras sucursales para obtener un presupuesto personalizado sin costo.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20" style={{ backgroundColor: "#0D0D0D" }} id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2
          className="font-bebas text-center mb-12"
          style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "var(--white)" }}
        >
          PREGUNTAS{" "}
          <span style={{ color: "var(--orange)" }}>FRECUENTES</span>
        </h2>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-question w-full text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={20}
                  style={{
                    color: "var(--orange)",
                    transition: "transform 0.3s ease",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    flexShrink: 0,
                  }}
                />
              </button>
              {open === i && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
