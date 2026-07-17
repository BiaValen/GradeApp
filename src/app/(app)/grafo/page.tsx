import Link from "next/link";
import { getMateriasDoUsuario } from "@/lib/get-materias";
import { GrafoView } from "./grafo-view";

export default async function GrafoPage() {
  const { ucs, error } = await getMateriasDoUsuario();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Grafo de dependências</h1>

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
        <GrafoView ucs={ucs} />
      )}
    </main>
  );
}
