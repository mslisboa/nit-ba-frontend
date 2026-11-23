import Image from "next/image";

const LOGOS: Record<string, string> = {
  UFBA: "ufba.png",
  BAHIANA: "bahiana.png",
  UESB: "uesb.png",
  UFOB: "ufob.png",
  UFSB: "ufsb.png",
  UEFS: "uefs.png",
  UESC: "uesc.png",
  UFRB: "ufrb.png",
  UNEB: "uneb.png",
  IFBA: "ifba.png",
  FIOCRUZ: "fiocruz-bahia.png",
  CIMATEC: "senai-cimatec.png",
  "SENAI CIMATEC": "senai-cimatec.png",
};

type InstitutionLogoProps = {
  sigla: string;
  variant?: "card" | "compact" | "profile" | "inline";
};

export function InstitutionLogo({
  sigla,
  variant = "card",
}: InstitutionLogoProps) {
  const file = LOGOS[sigla];

  if (!file) {
    return <span className="entity-logo">{sigla}</span>;
  }

  return (
    <span className={`institution-logo institution-logo-${variant}`}>
      <Image
        src={`/assets/logos/instituicoes/${file}`}
        alt={`Logomarca ${sigla}`}
        width={150}
        height={56}
        sizes="(max-width: 640px) 125px, 190px"
      />
    </span>
  );
}
