import Image from "next/image";

export function InstitutionalBrands() {
  return (
    <div className="prototype-bar" role="banner">
      <div className="institutional-brands">
        <Image
          className="government-logo"
          src="/assets/logos/governo-bahia.jpeg"
          alt="Governo da Bahia — Secretaria de Ciência, Tecnologia e Inovação"
          width={142}
          height={50}
          priority
        />
        <span className="institutional-divider" aria-hidden="true" />
        <Image
          className="observatory-symbol-logo"
          src="/assets/logos/observatorio.png"
          alt="Observatório"
          width={126}
          height={38}
          priority
        />
        <Image
          className="observatory-cti-logo"
          src="/assets/logos/observatorio-cti.png"
          alt="Observatório de CT&I da Bahia"
          width={150}
          height={40}
          priority
        />
      </div>
    </div>
  );
}
