import Link from "next/link";
import { getMateriasDoUsuario } from "@/lib/get-materias";
import { calcularHoras } from "@/lib/horas";
import { createClient } from "@/lib/supabase/server";
import { CategoriaCard } from "./categoria-card";
import { HorasInfoButton } from "./horas-info";

export default async function HorasPage() {
  const { ucs, curso, error } = await getMateriasDoUsuario();

  if (error || !curso) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm text-red-600">Erro ao carregar UCs: {error ?? "curso não encontrado."}</p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: certificados } = await supabase
    .from("certificados")
    .select("horas")
    .eq("user_id", user!.id);
  const horasCertificados = (certificados ?? []).reduce((soma, c) => soma + c.horas, 0);

  const { categorias, totalConcluido, totalMeta } = calcularHoras(ucs, curso, horasCertificados);
  const percentualTotal = totalMeta > 0 ? Math.round((totalConcluido / totalMeta) * 100) : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Horas</h1>

      <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-teal-500 to-amber-500 p-6 text-white">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm opacity-90">Horas para formatura</p>
              <HorasInfoButton curso={curso} categorias={categorias} totalMeta={totalMeta} />
            </div>
            <p className="text-3xl font-bold">
              {totalConcluido}/{totalMeta}h
            </p>
          </div>
          <p className="text-4xl font-bold">{percentualTotal}%</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${Math.min(100, percentualTotal)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categorias.map((cat) => (
          <CategoriaCard
            key={cat.chave}
            cat={cat}
            footer={
              cat.chave === "complementares" ? (
                <Link href="/certificados" className="mt-3 inline-block text-xs text-blue-600 underline">
                  Gerenciar certificados →
                </Link>
              ) : undefined
            }
          />
        ))}
      </div>
    </main>
  );
}
