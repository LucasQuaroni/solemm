import Image from 'next/image'
import type { StoreSettings } from '@/types'

interface AboutSectionProps {
  settings: StoreSettings
}

export default function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="nosotros" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative rounded-lg overflow-hidden aspect-[4/3] shadow-xl">
            <Image
              src={settings.aboutImage || "/banners/banner-2.jpg"}
              alt="Solemm Cueros - Artesanía"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-leather-dark/10" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="font-body text-xs tracking-widest uppercase text-primary font-semibold">
                Quienes somos
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mt-2 leading-tight text-balance">
                {settings.aboutTitle}
              </h2>
            </div>
            <div className="w-12 h-1 bg-primary rounded-full" />
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              {settings.aboutText}
            </p>

            <div className="grid grid-cols-3 gap-6 mt-4">
              {[
                { value: "Productos", label: "premium" },
                { value: "Hecho", label: "a mano" },
                { value: "+10", label: "Años de exp." },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-sans text-2xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-1 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/contacto"
              className="self-start mt-2 inline-block border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body font-semibold py-3 px-7 rounded-sm transition-colors tracking-wide uppercase text-sm"
            >
              Contactanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
