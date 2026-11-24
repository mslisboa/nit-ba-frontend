import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Frame } from "@/components/frame";
import { dataAmostra } from "@/lib/consulta-amostra";
import "./globals.css";
import "./jd.css";
export const metadata: Metadata = { title: "Instituições e inovação · JD", description: "Consulta local das instituições e dados BADEPI analisados", robots: { index: false, follow: false } };
export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const comAmostra = (await cookies()).get("jd-dados")?.value !== "api";
  return <html lang="pt-BR"><body><Frame comAmostra={comAmostra} dataAmostra={dataAmostra}>{children}</Frame></body></html>;
}
