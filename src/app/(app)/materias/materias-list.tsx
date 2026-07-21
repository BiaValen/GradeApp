"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ConcluidaCheckbox } from "@/components/ConcluidaCheckbox";
import { PencilIcon, TrashIcon } from "@/components/icons";
import { calcularImportancia } from "@/lib/importancia";
import { aplicarStatusLocal, missingPrerequisites } from "@/lib/status";
import type { Uc } from "@/lib/types";
import { STATUS_COLORS, STATUS_LABELS, TIPO_LABELS, type UcStatus } from "@/lib/uc-labels";
import { deleteUc, updateUcStatus } from "./actions";
import { UcEditModal } from "./uc-edit-modal";

const STATUS_FILTERS: Array<{ value: "todas" | UcStatus; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "concluida", label: "Concluídas" },
  { value: "cursando", label: "Cursando" },
  { value: "disponivel", label: "Disponíveis" },
  { value: "bloqueada", label: "Bloqueadas" },
  { value: "planejada", label: "Planejadas" },
  { value: "reprovada", label: "Reprovadas" },
];

export function MateriasList({
  ucs: ucsIniciais,
  currentUserId,
}: {
  ucs: Uc[];
  currentUserId: string;
}) {
  const [ucs, setUcs] = useState(ucsIniciais);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todas" | UcStatus>("todas");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [isPending, startTransition] = useTransition();
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [editingUc, setEditingUc] = useState<Uc | null>(null);

  useEffect(() => setUcs(ucsIniciais), [ucsIniciais]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ucs.filter((uc) => {
      const matchesSearch =
        !term || uc.nome.toLowerCase().includes(term) || uc.codigo.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "todas" || uc.status === statusFilter;
      const matchesTipo = tipoFilter === "todos" || uc.tipo === tipoFilter;
      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [ucs, search, statusFilter, tipoFilter]);

  const importancia = useMemo(() => calcularImportancia(ucs), [ucs]);
  const nomePorCodigo = useMemo(() => new Map(ucs.map((u) => [u.codigo, u.nome])), [ucs]);

  function handleStatusChange(ucId: string, status: "concluida" | "planejada") {
    setRowErrors((prev) => ({ ...prev, [ucId]: "" }));

    if (status === "concluida") {
      const uc = ucs.find((u) => u.id === ucId);
      const concludedCodes = new Set(
        ucs.filter((u) => u.status === "concluida").map((u) => u.codigo),
      );
      const faltando = uc ? missingPrerequisites(uc.pre_requisitos, concludedCodes) : [];
      if (faltando.length > 0) {
        setRowErrors((prev) => ({
          ...prev,
          [ucId]: `Faltam pré-requisitos: ${faltando.join(", ")}`,
        }));
        return;
      }
    }

    const anterior = ucs;
    setUcs((prev) => aplicarStatusLocal(prev, ucId, status));

    startTransition(async () => {
      const result = await updateUcStatus(ucId, status);
      if (result?.error) {
        setUcs(anterior);
        setRowErrors((prev) => ({ ...prev, [ucId]: result.error! }));
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Buscar por nome ou código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "todas" | UcStatus)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="todos">Todos os tipos</option>
          {Object.entries(TIPO_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-neutral-500">
        {filtered.length} de {ucs.length} UCs
      </p>

      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left">
            <tr>
              <th className="px-3 py-2">Código</th>
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">Sem.</th>
              <th className="px-3 py-2">Créd.</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Pré-requisitos</th>
              <th className="px-3 py-2" title="Quantas UCs dependem dessa, direta ou indiretamente">
                Importância
              </th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((uc) => {
              const isPersonal = uc.criado_por === currentUserId;
              const score = importancia.get(uc.codigo) ?? 0;
              return (
                <tr
                  key={uc.id}
                  className={`border-t border-neutral-100 align-top ${
                    uc.status === "concluida" ? "bg-green-50" : ""
                  }`}
                >
                  <td className="px-3 py-2 font-mono text-xs">{uc.codigo}</td>
                  <td className="px-3 py-2">
                    {uc.nome}
                    {isPersonal && (
                      <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
                        pessoal
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{uc.semestre_sugerido ?? "—"}</td>
                  <td className="px-3 py-2">{uc.creditos}</td>
                  <td className="px-3 py-2 text-xs text-neutral-600">{TIPO_LABELS[uc.tipo]}</td>
                  <td className="max-w-[220px] px-3 py-2 text-xs text-neutral-600">
                    {uc.pre_requisitos.length === 0
                      ? "—"
                      : uc.pre_requisitos
                          .map((codigo) => nomePorCodigo.get(codigo) ?? codigo)
                          .join(", ")}
                  </td>
                  <td className="px-3 py-2 text-xs text-neutral-600">
                    {score > 0 ? (
                      <span
                        title={`Desbloqueia ${score} UC${score !== 1 ? "s" : ""}`}
                        className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-indigo-800"
                      >
                        ★ {score}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex w-fit items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[uc.status]}`}
                        >
                          {STATUS_LABELS[uc.status]}
                        </span>
                        <ConcluidaCheckbox
                          status={uc.status}
                          disabled={isPending}
                          showLabel={false}
                          onChange={(novoStatus) => handleStatusChange(uc.id, novoStatus)}
                        />
                      </div>
                      {rowErrors[uc.id] && (
                        <span className="max-w-[180px] text-xs text-red-600">
                          {rowErrors[uc.id]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingUc(uc)}
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
                          const msg = isPersonal
                            ? `Remover "${uc.nome}" permanentemente?`
                            : `Remover "${uc.nome}" da sua lista? (continua no catálogo oficial)`;
                          if (confirm(msg)) {
                            startTransition(() => deleteUc(uc.id, isPersonal));
                          }
                        }}
                        title="Remover"
                        aria-label="Remover"
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingUc && (
        <UcEditModal
          uc={editingUc}
          isPersonal={editingUc.criado_por === currentUserId}
          onClose={() => setEditingUc(null)}
        />
      )}
    </div>
  );
}
