import { createClient } from "@/lib/supabase/server";
import type { AtividadeExtra } from "@/lib/types";
import { AtividadesManager } from "./atividades-manager";
import { SemestreAtualForm } from "./semestre-atual-form";

export default async function ConfigPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: atividades, error } = await supabase
    .from("atividades_extras")
    .select("*")
    .eq("user_id", user!.id)
    .order("semestre");

  const { data: perfil } = await supabase
    .from("perfil")
    .select("semestre_atual")
    .eq("user_id", user!.id)
    .single();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Configurações pessoais</h1>

      <div className="mb-8 rounded-md border border-neutral-200 p-4">
        <h2 className="mb-1 text-sm font-semibold">Semestre atual</h2>
        <p className="mb-3 text-xs text-neutral-500">
          Mostra o selo &quot;Atual&quot; na coluna certa do Plano.
        </p>
        <SemestreAtualForm semestreAtual={perfil?.semestre_atual ?? null} />
      </div>

      <h2 className="mb-1 text-lg font-semibold">Atividades extras</h2>
      <p className="mb-4 text-sm text-neutral-600">
        Extensão, iniciação científica, estágio não-curricular etc. — não são UCs, mas entram no
        cálculo de carga do Plano.
      </p>

      {error ? (
        <p className="text-sm text-red-600">
          Erro ao carregar: {error.message}. Rode as migrations mais recentes no Supabase.
        </p>
      ) : (
        <AtividadesManager atividades={(atividades ?? []) as AtividadeExtra[]} />
      )}
    </main>
  );
}
