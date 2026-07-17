import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMateriasDoUsuario } from "@/lib/get-materias";
import type { AtividadeExtra } from "@/lib/types";
import { PlanoView } from "./plano-view";

export default async function PlanoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { ucs, error } = await getMateriasDoUsuario();
  const { data: atividades } = await supabase
    .from("atividades_extras")
    .select("*")
    .eq("user_id", user!.id);
  const { data: perfil } = await supabase
    .from("perfil")
    .select("semestre_atual")
    .eq("user_id", user!.id)
    .single();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Plano</h1>

      {error ? (
        <p className="text-sm text-red-600">Erro ao carregar UCs: {error}</p>
      ) : ucs.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Você ainda não importou suas UCs.{" "}
          <Link href="/materias" className="text-blue-600 underline">
            Volte pra Matérias
          </Link>{" "}
          e clique em &quot;Importar grade oficial do PPC&quot;.
        </p>
      ) : (
        <PlanoView
          ucs={ucs}
          atividadesExtras={(atividades ?? []) as AtividadeExtra[]}
          semestreAtual={perfil?.semestre_atual ?? null}
          currentUserId={user!.id}
        />
      )}
    </main>
  );
}
