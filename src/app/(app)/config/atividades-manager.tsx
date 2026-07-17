"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { PencilIcon, TrashIcon } from "@/components/icons";
import type { AtividadeExtra, AtividadeExtraTipo } from "@/lib/types";
import { createAtividade, deleteAtividade, updateAtividade } from "./actions";

const TIPO_LABELS: Record<AtividadeExtraTipo, string> = {
  extensao: "Extensão",
  ic: "Iniciação Científica",
  estagio: "Estágio não-curricular",
  outro: "Outro",
};

export function AtividadesManager({ atividades }: { atividades: AtividadeExtra[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {atividades.length === 0 && (
          <p className="text-sm text-neutral-500">Nenhuma atividade extra cadastrada ainda.</p>
        )}
        {atividades.map((a) => (
          <AtividadeRow key={a.id} atividade={a} />
        ))}
      </div>

      <div className="rounded-md border border-neutral-200 p-4">
        <h2 className="mb-3 text-sm font-semibold">Nova atividade</h2>
        <AtividadeForm action={createAtividade} />
      </div>
    </div>
  );
}

function AtividadeRow({ atividade }: { atividade: AtividadeExtra }) {
  const [editando, setEditando] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editando) {
    return (
      <div className="rounded-md border border-neutral-300 p-4">
        <AtividadeForm
          action={updateAtividade.bind(null, atividade.id)}
          initial={atividade}
          onDone={() => setEditando(false)}
        />
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="mt-2 text-xs text-neutral-500 underline"
        >
          cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-200 p-3 text-sm">
      <div>
        <span className="font-medium">{atividade.nome}</span>{" "}
        <span className="text-xs text-neutral-500">
          {TIPO_LABELS[atividade.tipo]} · {atividade.semestre}º semestre ·{" "}
          {atividade.horas_semana}h/semana
        </span>
      </div>
      <div className="flex flex-shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setEditando(true)}
          title="Editar"
          aria-label="Editar"
          className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm(`Remover "${atividade.nome}"?`)) {
              startTransition(() => deleteAtividade(atividade.id));
            }
          }}
          title="Remover"
          aria-label="Remover"
          className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function AtividadeForm({
  action,
  initial,
  onDone,
}: {
  action: (
    prevState: { error?: string; success?: boolean } | undefined,
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean }>;
  initial?: AtividadeExtra;
  onDone?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.success) onDone?.();
  }, [state, onDone]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Nome</label>
          <input
            name="nome"
            required
            defaultValue={initial?.nome}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Tipo</label>
          <select
            name="tipo"
            defaultValue={initial?.tipo ?? "outro"}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
            {Object.entries(TIPO_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Semestre</label>
          <input
            name="semestre"
            type="number"
            min={1}
            max={10}
            required
            defaultValue={initial?.semestre}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Horas/semana</label>
          <input
            name="horas_semana"
            type="number"
            step="0.5"
            min={0}
            required
            defaultValue={initial?.horas_semana}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
