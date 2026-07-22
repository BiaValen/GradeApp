"use client";

import { useMemo, useState } from "react";
import type { CategoriaHoras } from "@/lib/horas";
import { STATUS_COLORS, STATUS_LABELS, TIPO_LABELS } from "@/lib/uc-labels";

export function CategoriaCard({
  cat,
  footer,
}: {
  cat: CategoriaHoras;
  footer?: React.ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const percentual = cat.meta > 0 ? Math.round((cat.concluidas / cat.meta) * 100) : 0;
  const cumprido = cat.meta > 0 && cat.concluidas >= cat.meta;

  const grupos = useMemo(() => {
    const mapa = new Map<string, typeof cat.ucs>();
    for (const uc of cat.ucs) {
      const lista = mapa.get(uc.tipo) ?? [];
      lista.push(uc);
      mapa.set(uc.tipo, lista);
    }
    return Array.from(mapa.entries());
  }, [cat.ucs]);

  return (
    <div className="rounded-lg border border-neutral-200 p-5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold">{cat.titulo}</h2>
        {cumprido && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800">
            Cumprido ✓
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-neutral-500">{cat.descricao}</p>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-2xl font-bold">
          {cat.concluidas}
          <span className="text-sm font-normal text-neutral-500">/{cat.meta}h</span>
        </p>
        <span className="text-sm font-medium text-blue-600">{percentual}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-amber-500"
          style={{ width: `${Math.min(100, percentual)}%` }}
        />
      </div>

      {cat.ucs.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="mt-3 text-xs text-blue-600 underline"
          >
            {aberto ? "Ocultar UCs" : `Ver UCs (${cat.ucs.length})`}
          </button>

          {aberto && (
            <div className="mt-3 flex flex-col gap-3 border-t border-neutral-100 pt-3">
              {grupos.map(([tipo, lista]) => (
                <div key={tipo}>
                  <p className="mb-1 text-xs font-medium text-neutral-500">
                    {TIPO_LABELS[tipo as keyof typeof TIPO_LABELS] ?? tipo}
                  </p>
                  <div className="flex flex-col gap-1">
                    {lista.map((uc) => (
                      <div
                        key={uc.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-neutral-100 px-2 py-1.5 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-neutral-800">{uc.nome}</p>
                          <p className="font-mono text-[10px] text-neutral-400">
                            {uc.codigo} · {uc.carga_horaria_total}h
                          </p>
                        </div>
                        <span
                          className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] ${STATUS_COLORS[uc.status]}`}
                        >
                          {STATUS_LABELS[uc.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {footer}
    </div>
  );
}
