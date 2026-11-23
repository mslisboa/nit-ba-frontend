import type { Metadata } from "next";
import "./globals.css";
import "./styles/site.css";
import "./styles/kit-ui.css";

export const metadata: Metadata = {
  title: {
    default: "NITs · Observatório de CT&I da Bahia",
    template: "%s · NITs",
  },
  description:
    "Núcleos de Inovação Tecnológica, instituições, pesquisadores e propriedade intelectual da Bahia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body data-version="v1">{children}</body>
    </html>
  );
}
