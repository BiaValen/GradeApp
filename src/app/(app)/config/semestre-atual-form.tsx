"use client";

import { useActionState } from "react";
import { updateSemestreAtual } from "./actions";

export function SemestreAtualForm({ semestreAtual }: { semestreAtual: number | null }) {
  const [state, formAction, pending] = useActionState(updateSemestreAtual, undefined);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="semestre_atual" className="text-xs font-medium">
          Semestre
        </label>
        <input
          id="semestre_atual"
          name="semestre_atual"
          type="number"
          min={1}
          max={10}
          defaultValue={semestreAtual ?? undefined}
          className="w-24 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
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
