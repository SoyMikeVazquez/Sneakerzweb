import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "70px", minHeight: "100vh" }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/hero-sneakers.png"
      >
        <source src="/sneak.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay with subtle vignette */}
      <div className="hero-overlay absolute inset-0 z-0" />

      {/* Content */}
      <div
        className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto flex flex-col items-center gap-5"
      >
        {/* Streetwear top badge */}
        <div className="hero-anim-title inline-flex items-center gap-2 bg-yellow text-black font-black px-3.5 py-1 text-xs tracking-widest uppercase rounded-sm shadow-[3px_3px_0px_#000] transform -rotate-1">
          <span>⚡ SNEAKERZ BODY SHOP</span>
          <span className="opacity-40">/</span>
          <span>EST. DETAIL & CARE</span>
        </div>

        <h1 className="hero-title hero-anim-title">
          DAMOS NUEVA VIDA A TUS SNEAKERZ
        </h1>

        <div className="hero-subtitle-box hero-anim-subtitle relative">
          <p>
            Limpieza, restauración, detailing y protección profesional para
            tus sneakers y artículos de lujo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2 hero-anim-btns">
          <Link href="/agenda" className="btn-hero-primary">
            AGENDA TU RECOLECCIÓN
          </Link>
          <Link href="/servicios" className="btn-hero-secondary">
            VER SERVICIOS
          </Link>
        </div>

        {/* Scroll cue */}
        <div className="hero-scroll-cue hero-anim-btns" aria-hidden>
          <span />
        </div>
      </div>
    </section>
  );
}
