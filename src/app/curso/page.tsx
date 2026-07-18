import { createClient } from "@/lib/supabase/server";
import { selecionarCurso } from "./actions";

export default async function CursoPage() {
  const supabase = await createClient();
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, nome, universidade")
    .order("nome");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-emerald-500 to-amber-400 px-4 py-16">
      <div className="flex flex-col items-center gap-3 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
          <CapIcon className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold">GradeFlow</h1>
        <p className="max-w-sm text-sm text-white/90">
          Um app da UNIFESP pra planejar sua grade curricular acompanhando o PPC oficial.
        </p>
      </div>

      <div className="mt-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-center text-lg font-semibold text-neutral-900">
          Qual é o seu curso?
        </h2>
        <p className="mb-5 text-center text-sm text-neutral-500">
          Escolha o curso pra acessar sua grade.
        </p>

        <div className="flex flex-col gap-2">
          {(cursos ?? []).map((curso) => (
            <form key={curso.id} action={selecionarCurso.bind(null, curso.id)}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 p-3 text-left transition-colors hover:border-blue-400 hover:bg-blue-50"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <CapIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{curso.nome}</p>
                  <p className="text-xs text-neutral-500">{curso.universidade}</p>
                </div>
              </button>
            </form>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-white/80">
        Criado por Bianca Valenciani e ClaudeIA · UNIFESP · 2026
      </p>
    </main>
  );
}

function CapIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}
