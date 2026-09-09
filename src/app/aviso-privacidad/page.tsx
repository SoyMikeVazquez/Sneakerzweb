import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Sneakerz",
  description: "Aviso de privacidad de Sneakerz México.",
};

export default function AvisoPrivacidadPage() {
  return (
    <div style={{ paddingTop: "64px" }}>
      <div className="py-16 text-center" style={{ backgroundColor: "#0D0D0D" }}>
        <h1 className="font-bebas mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--white)" }}>
          AVISO DE <span style={{ color: "var(--orange)" }}>PRIVACIDAD</span>
        </h1>
      </div>
      <div className="orange-line" />
      <section className="py-16" style={{ backgroundColor: "var(--black)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8" style={{ color: "var(--gray-light)", lineHeight: 1.8 }}>
          <div>
            <h2 className="font-bebas mb-3" style={{ fontSize: "1.5rem", color: "var(--orange)" }}>RESPONSABLE</h2>
            <p className="text-sm">SNEAKERZ MX, con domicilio en Monterrey, Nuevo León, México, es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.</p>
          </div>
          <div>
            <h2 className="font-bebas mb-3" style={{ fontSize: "1.5rem", color: "var(--orange)" }}>DATOS QUE RECABAMOS</h2>
            <p className="text-sm">Recabamos datos de identificación (nombre, teléfono, correo electrónico) y datos de ubicación (domicilio para recolección) con la finalidad de prestar nuestros servicios de limpieza y restauración.</p>
          </div>
          <div>
            <h2 className="font-bebas mb-3" style={{ fontSize: "1.5rem", color: "var(--orange)" }}>FINALIDADES</h2>
            <p className="text-sm">Sus datos son utilizados para: prestar los servicios contratados, coordinar recolecciones y entregas, enviar comunicaciones sobre el estado de su pedido, y en su caso, informarle sobre nuestras promociones y servicios.</p>
          </div>
          <div>
            <h2 className="font-bebas mb-3" style={{ fontSize: "1.5rem", color: "var(--orange)" }}>SUS DERECHOS</h2>
            <p className="text-sm">Usted tiene derecho de Acceso, Rectificación, Cancelación y Oposición (ARCO) al tratamiento de sus datos. Para ejercerlos, contáctenos en: contacto@sneakerz.mx</p>
          </div>
          <p className="text-xs" style={{ color: "var(--gray)" }}>Última actualización: 2024</p>
        </div>
      </section>
    </div>
  );
}
