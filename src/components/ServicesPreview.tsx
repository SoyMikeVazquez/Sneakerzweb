"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabaseMain } from "@/lib/supabase";

const fallbackServices = [
  {
    id: "sneakers",
    title: "SNEAKERS",
    description:
      "¡Es hora de mimar a tus gorras y sneakers! Con nuestros servicios de limpieza, retoque de color, restauración y personalización, tus favoritos van a brillar más que nunca.",
    image: "/services-graphic.png",
    imageAlt: "Servicio de limpieza de sneakers",
  },
  {
    id: "residencial",
    title: "RESIDENCIAL",
    description:
      "¡Ahora puedes programar la limpieza de tu sala, colchón y sillas para que tus muebles siempre estén frescos y huelan increíble! Dile adiós a las alergias.",
    image: "/luxury-handbag.png",
    imageAlt: "Servicio de limpieza residencial",
  },
  {
    id: "lujo",
    title: "ARTÍCULOS DE LUJO",
    description:
      "Bolsas, carteras y accesorios de las mejores marcas del mundo merecen el cuidado que les corresponde. Nuestros especialistas los devuelven a su esplendor original.",
    image: "/luxury-handbag.png",
    imageAlt: "Artículos de lujo",
  },
];

export default function ServicesPreview() {
  const [finalServices, setFinalServices] = useState(fallbackServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabaseMain.from("servicios").select("*").order("created_at", { ascending: true });
        if (data && data.length > 0) {
          setFinalServices(data.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            image: s.image,
            imageAlt: s.image_alt || s.title,
          })));
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <section
      className="py-20"
      style={{ backgroundColor: "var(--black)" }}
      id="servicios"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          <div className="lg:w-1/3">
            <div className="mb-6">
              <div
                className="font-bebas"
                style={{
                  fontSize: "clamp(3rem, 5vw, 4.5rem)",
                  lineHeight: 0.95,
                  color: "var(--white)",
                }}
              >
                <div>NUESTROS</div>
                <div
                  className="px-3 py-1 inline-block"
                  style={{
                    backgroundColor: "var(--orange)",
                    color: "var(--white)",
                  }}
                >
                  SERVICIOS
                </div>
              </div>
            </div>
            <div className="border-l-4 pl-4" style={{ borderColor: "var(--orange)" }}>
              <p className="text-white text-lg leading-relaxed">
                No es solo limpieza. Es darle{" "}
                <span
                  className="underline"
                  style={{ color: "var(--orange)", textDecorationColor: "var(--orange)" }}
                >
                  amor
                </span>{" "}
                a tus pares. Checa lo que hacemos por ti.
              </p>
            </div>

            <div className="mt-4">
              <Image
                src="/services-graphic.png"
                alt="Sneakerz service graphic"
                width={280}
                height={280}
                className="w-full max-w-xs"
                style={{
                  border: "2px solid var(--orange)",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Service Cards */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {finalServices.map((service) => (
              <div key={service.id} className="service-card flex flex-col">
                <div className="overflow-hidden mb-4" style={{ height: "200px" }}>
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3
                  className="font-bebas mb-3"
                  style={{ fontSize: "1.5rem", color: "var(--orange)", letterSpacing: "0.1em" }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4 flex-grow"
                  style={{ color: "var(--gray-light)" }}
                >
                  {service.description}
                </p>
                <Link href="/agenda" className="btn-secondary self-start text-xs">
                  AGENDAR AHORA
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
