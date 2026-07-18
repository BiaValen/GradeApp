"use client";

import { useActionState } from "react";
import { updateCurso } from "./actions";

interface CursoOpcao {
  id: string;
  nome: string;
}

export function CursoForm({
  cursos,
  cursoAtualId,
}: {
  cursos: CursoOpcao[];
  cursoAtualId: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateCurso, undefined);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="curso_id" className="text-xs font-medium">
          Curso
        </label>
        <select
          id="curso_id"
          name="curso_id"
          defaultValue={cursoAtualId ?? ""}
          className="w-64 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        >
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.nome}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
