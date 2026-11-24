import { Perfil } from "@/components/observatorio";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Perfil id={id} />;
}
