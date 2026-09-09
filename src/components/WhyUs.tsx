const stats = [
  { number: "5,000+", label: "Pares restaurados" },
  { number: "3", label: "Sucursales en MTY" },
  { number: "100%", label: "Satisfacción garantizada" },
  { number: "5★", label: "Calificación promedio" },
];

export default function WhyUs() {
  return (
    <section className="py-20" style={{ backgroundColor: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="font-bebas mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--white)" }}
          >
            ¿POR QUÉ{" "}
            <span style={{ color: "var(--orange)" }}>SNEAKERZ?</span>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--gray-light)" }}>
            Somos la empresa líder en México en el cuidado de sneakers y artículos de lujo. 
            Nuestros técnicos especializados utilizan productos premium para garantizar 
            resultados perfectos en cada pieza.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-bebas mb-2"
                style={{ fontSize: "3rem", color: "var(--orange)" }}
              >
                {stat.number}
              </div>
              <div className="text-sm uppercase tracking-widest" style={{ color: "var(--gray-light)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🔬",
              title: "Productos Premium",
              text: "Usamos los mejores productos del mercado, probados y aprobados por expertos en la industria del calzado de lujo.",
            },
            {
              icon: "🚚",
              title: "Recolección a Domicilio",
              text: "Agenda tu recolección desde la comodidad de tu casa. Nosotros vamos por tus prendas y te las devolvemos perfectas.",
            },
            {
              icon: "🛡️",
              title: "Garantía Total",
              text: "Si no quedas 100% satisfecho, lo volvemos a hacer sin costo adicional. Tu confianza es nuestra prioridad.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-8"
              style={{ border: "1px solid #1f1f1f", backgroundColor: "var(--black-card)" }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3
                className="font-bebas mb-3"
                style={{ fontSize: "1.4rem", color: "var(--orange)", letterSpacing: "0.08em" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--gray-light)" }}>
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
