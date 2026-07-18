import Link from "next/link";
import { calcularAnalise } from "@/lib/analise";
import { getMateriasDoUsuario } from "@/lib/get-materias";
import { createClient } from "@/lib/supabase/server";
import { TIPO_LABELS } from "@/lib/uc-labels";

export default async function AnalisePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { ucs, curso, error } = await getMateriasDoUsuario();
  const { data: perfil } = await supabase
    .from("perfil")
    .select("semestre_atual")
    .eq("user_id", user!.id)
    .single();
  const { data: certificados } = await supabase
    .from("certificados")
    .select("horas")
    .eq("user_id", user!.id);
  const horasCertificados = (certificados ?? []).reduce((soma, c) => soma + c.horas, 0);

  if (error || !curso) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm text-red-600">Erro ao carregar UCs: {error ?? "curso não encontrado."}</p>
      </main>
    );
  }

  const resumo = calcularAnalise(ucs, curso, perfil?.semestre_atual ?? null, horasCertificados);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Análise</h1>

      <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-teal-500 to-amber-500 p-6 text-white">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Progresso geral</p>
            <p className="text-3xl font-bold">{resumo.percentualGeral}%</p>
          </div>
          {resumo.percentualGeral < 100 && (
            <div className="text-right">
              <p className="text-sm opacity-90">Previsão de conclusão</p>
              <p className="text-2xl font-bold">
                {resumo.semestresPrevistos} semestre{resumo.semestresPrevistos !== 1 ? "s" : ""}
              </p>
              <p className="text-xs opacity-80">({resumo.semanasPrevistas} semanas)</p>
            </div>
          )}
        </div>
        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${Math.min(100, resumo.percentualGeral)}%` }}
          />
        </div>
        <p className="text-sm opacity-90">
          {resumo.creditosConcluidos} de {resumo.creditosMeta} créditos concluídos
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          titulo="Créditos"
          valor={`${resumo.creditosConcluidos}/${resumo.creditosMeta}`}
          percentual={resumo.percentualGeral}
        />
        <StatCard
          titulo="Horas"
          valor={`${resumo.horasConcluidas}/${resumo.horasMeta}`}
          percentual={Math.round((resumo.horasConcluidas / resumo.horasMeta) * 100)}
        />
        <StatCard
          titulo="Obrigatórias"
          valor={`${resumo.obrigatoriasConcluidas}/${resumo.obrigatoriasTotal}`}
          percentual={Math.round((resumo.obrigatoriasConcluidas / resumo.obrigatoriasTotal) * 100)}
        />
        <StatCard
          titulo="Eletivas concluídas"
          valor={`${resumo.eletivasConcluidas}`}
          nota="mín. 4 interdisc. / 252h"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 p-4">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-green-700">
            <span>✓</span> Disponíveis para cursar ({resumo.disponiveis.length})
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {resumo.disponiveis.length === 0 ? (
              <p className="text-sm text-neutral-500">Nenhuma UC disponível no momento.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {resumo.disponiveis.map((uc) => (
                  <Link
                    key={uc.id}
                    href={`/materias`}
                    className="flex items-center justify-between rounded-md border border-neutral-200 p-2 text-sm hover:border-neutral-300"
                  >
                    <div>
                      <p className="font-medium">{uc.nome}</p>
                      <p className="font-mono text-xs text-neutral-500">{uc.codigo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">
                        {uc.creditos}cr
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                        {TIPO_LABELS[uc.tipo]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 p-4">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-amber-700">
            <span>⚠</span> Bloqueadas por pré-requisito ({resumo.bloqueadas.length})
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {resumo.bloqueadas.length === 0 ? (
              <p className="text-sm text-neutral-500">Nenhuma UC bloqueada no momento.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {resumo.bloqueadas.map(({ uc, faltando }) => (
                  <div
                    key={uc.id}
                    className="rounded-md border border-amber-200 bg-amber-50/50 p-2 text-sm"
                  >
                    <p className="font-medium">{uc.nome}</p>
                    <p className="font-mono text-xs text-neutral-500">{uc.codigo}</p>
                    <p className="mt-1 text-xs text-amber-700">
                      Falta: {faltando.map((f) => f.nome).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  titulo,
  valor,
  percentual,
  nota,
}: {
  titulo: string;
  valor: string;
  percentual?: number;
  nota?: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <p className="text-xs text-neutral-500">{titulo}</p>
      <p className="text-xl font-bold">{valor}</p>
      {percentual != null && (
        <>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${Math.min(100, percentual)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">{percentual}%</p>
        </>
      )}
      {nota && <p className="mt-1 text-xs text-neutral-500">{nota}</p>}
    </div>
  );
}
