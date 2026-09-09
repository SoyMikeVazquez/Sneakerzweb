const items = [
  "LIMPIEZA PREMIUM",
  "RESTAURACIÓN",
  "PERSONALIZACIÓN",
  "RETOQUE DE COLOR",
  "BOLSAS DE LUJO",
  "GORRAS Y ACCESORIOS",
  "LIMPIEZA RESIDENCIAL",
  "SNEAKERZ MX",
];

export default function Ticker() {
  const repeated = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        {repeated.map((item, i) => (
          <span key={i} className="ticker-item">
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  );
}
