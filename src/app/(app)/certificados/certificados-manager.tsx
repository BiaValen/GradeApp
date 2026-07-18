"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { PencilIcon, TrashIcon } from "@/components/icons";
import { EIXO_COLORS, EIXO_DOT_COLORS, EIXO_LABELS } from "@/lib/certificado-labels";
import type { Certificado, CertificadoEixo } from "@/lib/types";
import { createCertificado, deleteCertificado, updateCertificado } from "./actions";

export function CertificadosManager({
  certificados,
  metaHoras,
}: {
  certificados: Certificado[];
  metaHoras: number;
}) {
  const totalHoras = useMemo(
    () => certificados.reduce((soma, c) => soma + c.horas, 0),
    [certificados],
  );
  const percentual = Math.min(100, Math.round((totalHoras / metaHoras) * 100));

  const subtotaisPorEixo = useMemo(() => {
    const mapa = new Map<CertificadoEixo, number>();
    for (const c of certificados) {
      mapa.set(c.eixo, (mapa.get(c.eixo) ?? 0) + c.horas);
    }
    return mapa;
  }, [certificados]);

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-teal-500 to-amber-500 p-6 text-white">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Atividades complementares</p>
            <p className="text-3xl font-bold">
              {totalHoras}/{metaHoras}h
            </p>
          </div>
          <p className="text-4xl font-bold">{percentual}%</p>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs opacity-90">
          {(Object.keys(EIXO_LABELS) as CertificadoEixo[]).map((eixo) => (
            <span key={eixo} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: EIXO_DOT_COLORS[eixo] }}
              />
              {EIXO_LABELS[eixo]}: {subtotaisPorEixo.get(eixo) ?? 0}h
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-500">
        O PPC do seu curso exige {metaHoras}h no total em atividades complementares
        (Iniciação Científica, monitoria, palestras, organização de eventos, participação
        em projetos de extensão etc.) — sem limite individual por eixo.
      </p>

      <div className="flex flex-col gap-2">
        {certificados.length === 0 && (
          <p className="text-sm text-neutral-500">Nenhum certificado cadastrado ainda.</p>
        )}
        {certificados.map((c) => (
          <CertificadoRow key={c.id} certificado={c} />
        ))}
      </div>

      <div className="rounded-md border border-neutral-200 p-4">
        <h2 className="mb-3 text-sm font-semibold">Novo certificado</h2>
        <CertificadoForm action={createCertificado} />
      </div>
    </div>
  );
}

function CertificadoRow({ certificado }: { certificado: Certificado }) {
  const [editando, setEditando] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editando) {
    return (
      <div className="rounded-md border border-neutral-300 p-4">
        <CertificadoForm
          action={updateCertificado.bind(null, certificado.id)}
          initial={certificado}
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
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{certificado.nome}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${EIXO_COLORS[certificado.eixo]}`}
        >
          {EIXO_LABELS[certificado.eixo]}
        </span>
        <span className="text-xs text-neutral-500">
          {certificado.ano ? `${certificado.ano} · ` : ""}
          {certificado.horas}h
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
            if (confirm(`Remover "${certificado.nome}"?`)) {
              startTransition(() => deleteCertificado(certificado.id));
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

function CertificadoForm({
  action,
  initial,
  onDone,
}: {
  action: (
    prevState: { error?: string; success?: boolean } | undefined,
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean }>;
  initial?: Certificado;
  onDone?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.success) onDone?.();
  }, [state, onDone]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-medium">Nome</label>
          <input
            name="nome"
            required
            defaultValue={initial?.nome}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Ano</label>
          <input
            name="ano"
            type="number"
            defaultValue={initial?.ano ?? ""}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Horas</label>
          <input
            name="horas"
            type="number"
            step="0.5"
            min={0.5}
            required
            defaultValue={initial?.horas}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-4">
          <label className="text-xs font-medium">Eixo</label>
          <select
            name="eixo"
            defaultValue={initial?.eixo ?? "pessoal_cientifica"}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
            {(Object.entries(EIXO_LABELS) as Array<[CertificadoEixo, string]>).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
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
