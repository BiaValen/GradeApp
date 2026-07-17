import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMateriasDoUsuario } from "@/lib/get-materias";
import { MateriasList } from "./materias-list";
import { SeedButton } from "./seed-button";

export default async function MateriasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { ucs, error } = await getMateriasDoUsuario();

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-red-600">
          Erro ao carregar UCs: {error}. Verifique se as migrations foram aplicadas no Supabase.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Matérias</h1>
        <Link
          href="/materias/nova"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
        >
          + Nova UC
        </Link>
      </div>

      {ucs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-neutral-300 py-12 text-center">
          <p className="text-sm text-neutral-600">
            Você ainda não tem nenhuma UC na sua lista. Importe o catálogo oficial do curso (PPC
            2023) pra começar.
          </p>
          <SeedButton />
        </div>
      ) : (
        <MateriasList ucs={ucs} currentUserId={user!.id} />
      )}
    </main>
  );
}
