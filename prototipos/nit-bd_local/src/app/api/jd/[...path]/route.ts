import { NextRequest, NextResponse } from "next/server";
import { consultarAmostra } from "@/lib/consulta-amostra";

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const catalogo = path[0] === "pi-catalogos" && /^(PRG|MRC|DI|IG|TCI)$/.test(path[1] ?? "") &&
    (path.length === 2 || path.length === 3 && (["opcoes", "resumo", "exportar"].includes(path[2]) ||
      /^BADEPI:(PRG|MRC|DI|IG|TCI):[a-f0-9]{64}$/.test(path[2]) && path[2].split(":")[1] === path[1]));
  const allowed = catalogo || path[0] === "patentes" && (path.length === 1 || path.length === 2 &&
    (["opcoes", "resumo", "exportar"].includes(path[1]) || /^BADEPI:PTN:[a-f0-9]{64}$/.test(path[1]))) ||
    path.length === 1 && ["instituicoes", "cobertura", "presenca-territorial"].includes(path[0]) ||
    path[0] === "instituicoes" && /^[a-f0-9]{64}$/.test(path[1] ?? "") &&
    (path.length === 2 || path.length === 3 && path[2] === "categorias" ||
      path[2] === "pi" && (path.length === 3 || path.length === 4 &&
        (["classificacoes", "resumo"].includes(path[3]) || /^BADEPI:(PTN|PRG|MRC|DI|IG|TCI):[a-f0-9]{64}$/.test(path[3]))));
  if (!allowed) return NextResponse.json({ detail: "Consulta não disponível." }, { status: 404 });
  if (request.cookies.get("jd-dados")?.value !== "api") {
    const resposta = consultarAmostra(path, request.nextUrl.searchParams);
    resposta.headers.set("Cache-Control", "no-store");
    return resposta;
  }
  const base = process.env.JD_API_URL ?? "http://127.0.0.1:43121";
  if (base !== "http://127.0.0.1:43121") return NextResponse.json({ detail: "Destino JD não configurado." }, { status: 503 });
  try {
    const response = await fetch(`${base}/api/v1/${path.join("/")}${request.nextUrl.search}`, {
      cache: "no-store", signal: AbortSignal.timeout(12000),
    });
    if ((catalogo || path[0] === "patentes") && path.at(-1) === "exportar" && response.ok) {
      return new NextResponse(await response.arrayBuffer(), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": response.headers.get("content-disposition") ?? "attachment", "Cache-Control": "no-store" } });
    }
    const data = await response.json();
    return NextResponse.json(data, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ detail: "Base de consulta temporariamente indisponível. Tente novamente." }, { status: 503 });
  }
}
