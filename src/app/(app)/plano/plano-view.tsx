"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ConcluidaCheckbox } from "@/components/ConcluidaCheckbox";
import { ExclamationIcon } from "@/components/icons";
import { Modal } from "@/components/Modal";
import { Toast } from "@/components/Toast";
import { agruparPorSemestre, CARGA_BAR_COLORS, CARGA_COLORS, CARGA_LABELS, percentualCarga } from "@/lib/carga";
import { calcularPosteriores } from "@/lib/dependencias";
import { calcularImportancia } from "@/lib/importancia";
import { aplicarStatusLocal, missingPrerequisites } from "@/lib/status";
import type { AtividadeExtra, Uc } from "@/lib/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/uc-labels";
import { moverUcSemestre, toggleImportantePessoal, updateUcStatus } from "../materias/actions";
import { UcEditModal } from "../materias/uc-edit-modal";

const STORAGE_KEY = "gradeflow:plano:semestres-ocultos";
const EXTRAS_KEY = "gradeflow:plano:semestres-extras";

// A trava de paridade usa o atributo "oferta" da UC (ímpar/par/ambos), não mais o tipo
// nem a paridade do semestre_sugerido diretamente — UCs BCT costumam rodar todo
// semestre e UCs específicas da Ecomp costumam rodar só uma vez por ano.
function paridadeBate(uc: Uc, destino: number): boolean {
  // se a migration da coluna "oferta" ainda não rodou, o valor vem undefined — trata
  // como "ambos" pra não travar o Plano numa trava de paridade inválida.
  if (!uc.oferta || uc.oferta === "ambos") return true;
  const paridadeDestino = destino % 2 === 0 ? "par" : "impar";
  return uc.oferta === paridadeDestino;
}

export function PlanoView({
  ucs: ucsIniciais,
  atividadesExtras,
  semestreAtual,
  currentUserId,
}: {
  ucs: Uc[];
  atividadesExtras: AtividadeExtra[];
  semestreAtual?: number | null;
  currentUserId: string;
}) {
  const [ucs, setUcs] = useState(ucsIniciais);
  const [ocultos, setOcultos] = useState<Set<string>>(new Set());
  const [semestresExtras, setSemestresExtras] = useState<number[]>([]);
  const [hidratado, setHidratado] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [moveError, setMoveError] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [editingUc, setEditingUc] = useState<Uc | null>(null);
  const [desbloqueiosDeUc, setDesbloqueiosDeUc] = useState<Uc | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setUcs(ucsIniciais), [ucsIniciais]);

  const colunas = useMemo(
    () => agruparPorSemestre(ucs, atividadesExtras, semestreAtual ?? null, semestresExtras),
    [ucs, atividadesExtras, semestreAtual, semestresExtras],
  );

  const importancia = useMemo(() => calcularImportancia(ucs), [ucs]);
  const concludedCodes = useMemo(
    () => new Set(ucs.filter((u) => u.status === "concluida").map((u) => u.codigo)),
    [ucs],
  );
  const nomePorCodigo = useMemo(() => new Map(ucs.map((u) => [u.codigo, u.nome])), [ucs]);

  const ucsDesbloqueadas = useMemo(() => {
    if (!desbloqueiosDeUc) return [];
    const codigos = calcularPosteriores(ucs, desbloqueiosDeUc.codigo);
    return ucs
      .filter((u) => codigos.has(u.codigo))
      .sort((a, b) => (a.semestre_sugerido ?? 999) - (b.semestre_sugerido ?? 999) || a.nome.localeCompare(b.nome));
  }, [ucs, desbloqueiosDeUc]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setOcultos(new Set(JSON.parse(saved)));
      const savedExtras = localStorage.getItem(EXTRAS_KEY);
      if (savedExtras) setSemestresExtras(JSON.parse(savedExtras));
    } catch {
      // ignora localStorage indisponível
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (hidratado) localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ocultos)));
  }, [ocultos, hidratado]);

  useEffect(() => {
    if (hidratado) localStorage.setItem(EXTRAS_KEY, JSON.stringify(semestresExtras));
  }, [semestresExtras, hidratado]);

  useEffect(() => {
    if (!moveError) return;
    const timer = setTimeout(() => setMoveError(null), 6000);
    return () => clearTimeout(timer);
  }, [moveError]);

  function ocultar(chave: string) {
    setOcultos((prev) => new Set(prev).add(chave));
  }

  function mostrarTodos() {
    setOcultos(new Set());
  }

  function adicionarSemestre() {
    const numerosExistentes = colunas
      .map((col) => col.semestre)
      .filter((s): s is number => typeof s === "number");
    const proximo = (numerosExistentes.length > 0 ? Math.max(...numerosExistentes) : 10) + 1;
    setSemestresExtras((prev) => [...prev, proximo]);
    setOcultos((prev) => {
      const novo = new Set(prev);
      novo.delete(String(proximo));
      return novo;
    });
  }

  function scroll(direction: -1 | 1) {
    scrollRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

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

  function handleImportanteChange(ucId: string, valor: boolean) {
    const anterior = ucs;
    setUcs((prev) =>
      prev.map((u) => (u.id === ucId ? { ...u, importante_pessoal: valor } : u)),
    );
    startTransition(async () => {
      const result = await toggleImportantePessoal(ucId, valor);
      if (result?.error) {
        setUcs(anterior);
        setMoveError(result.error);
      }
    });
  }

  function moverPara(ucId: string, destino: number | null) {
    const uc = ucs.find((u) => u.id === ucId);
    if (!uc) return;
    if (destino !== null && !paridadeBate(uc, destino)) {
      const label = uc.oferta === "par" ? "par" : "ímpar";
      setMoveError(`Essa UC só é oferecida em semestres ${label}.`);
      return;
    }

    const anterior = ucs;
    setUcs((prev) => prev.map((u) => (u.id === ucId ? { ...u, semestre_planejado: destino } : u)));
    setMoveError(null);
    startTransition(async () => {
      const result = await moverUcSemestre(ucId, destino);
      if (result?.error) {
        setUcs(anterior);
        setMoveError(result.error);
      }
    });
  }

  function handleDrop(colSemestre: number | "eletivas" | "atrasadas") {
    return (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverCol(null);
      if (colSemestre === "atrasadas") {
        setMoveError('"Atrasadas" é calculado automaticamente — arraste a UC pro semestre em que ela vai entrar de verdade.');
        return;
      }
      const ucId = e.dataTransfer.getData("text/plain");
      if (!ucId) return;
      moverPara(ucId, colSemestre === "eletivas" ? null : colSemestre);
    };
  }

  if (!hidratado) return null;

  const colunaAtrasadas = colunas.find((col) => col.semestre === "atrasadas");
  // mais importantes (mais UCs desbloqueadas) primeiro — são as que mais vale priorizar.
  const atrasadasOrdenadas = colunaAtrasadas
    ? [...colunaAtrasadas.ucs].sort(
        (a, b) => (importancia.get(b.codigo) ?? 0) - (importancia.get(a.codigo) ?? 0),
      )
    : [];
  const colunasSemestre = colunas.filter((col) => col.semestre !== "atrasadas");
  const visiveis = colunasSemestre.filter((col) => !ocultos.has(String(col.semestre)));
  const atrasadasOculta = ocultos.has("atrasadas");
  // opções do "mover p/..." não ficam presas às colunas já abertas — senão uma UC
  // atrasada de paridade que não tem coluna visível no momento ficaria sem destino.
  const numerosExistentes = colunasSemestre
    .map((col) => col.semestre)
    .filter((s): s is number => typeof s === "number");
  const maiorSemestre = Math.max(12, ...numerosExistentes);
  const todosSemestres = Array.from({ length: maiorSemestre }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-neutral-500">
        Arraste um card pra outro semestre pra replanejar (só entre semestres de mesma
        paridade — UCs de semestre ímpar só vão pra ímpar, par só pra par).
      </p>

      {moveError && <Toast message={moveError} onClose={() => setMoveError(null)} />}

      {ocultos.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <span>{ocultos.size} item(ns) oculto(s).</span>
          <button type="button" onClick={mostrarTodos} className="text-blue-600 underline">
            Mostrar todos
          </button>
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Rolar pra esquerda"
          className="absolute top-1/2 -left-3 z-10 hidden -translate-y-1/2 rounded-full border border-neutral-300 bg-white p-1.5 shadow sm:block"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Rolar pra direita"
          className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 rounded-full border border-neutral-300 bg-white p-1.5 shadow sm:block"
        >
          ›
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-4">
          {visiveis.map((col) => {
            const chave = String(col.semestre);
            const isAtual = col.semestre !== "eletivas" && col.semestre === semestreAtual;
            return (
              <div
                key={col.semestre}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(chave);
                }}
                onDragLeave={() => setDragOverCol((c) => (c === chave ? null : c))}
                onDrop={handleDrop(col.semestre)}
                className={`flex w-72 flex-shrink-0 flex-col gap-3 rounded-md border p-3 transition-colors ${
                  dragOverCol === chave
                    ? "border-blue-400 bg-blue-50"
                    : isAtual
                      ? "border-blue-300 bg-blue-50/40"
                      : "border-neutral-200 bg-neutral-50"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">
                        {col.semestre === "eletivas" ? "Eletivas" : `${col.semestre}º Semestre`}
                      </h2>
                      {isAtual && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Atual
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => ocultar(chave)}
                      title="Ocultar esse semestre"
                      className="text-xs text-neutral-400 hover:text-neutral-700"
                    >
                      ocultar
                    </button>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 text-xs text-neutral-600">
                    <span>{col.creditos} créd.</span>
                    <span>·</span>
                    <span>{col.horasTotais}h totais</span>
                    {col.horasExtrasPorSemana > 0 && (
                      <>
                        <span>·</span>
                        <span>+{col.horasExtrasPorSemana}h extra</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-600">
                    <span>{col.horasPorSemana.toFixed(1)}h/sem</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${CARGA_COLORS[col.nivel]}`}
                    >
                      {CARGA_LABELS[col.nivel]}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className={`h-full rounded-full ${CARGA_BAR_COLORS[col.nivel]}`}
                      style={{ width: `${percentualCarga(col.horasPorSemana)}%` }}
                    />
                  </div>
                </div>

                <div className="flex max-h-[30rem] flex-col gap-2 overflow-y-auto pr-1">
                  {col.atividades.map((a) => (
                    <Link
                      key={a.id}
                      href="/config"
                      className="rounded-md border border-dashed border-purple-300 bg-purple-50 p-2 text-xs hover:border-purple-400"
                    >
                      <span className="font-medium text-purple-900">{a.nome}</span>
                      <div className="text-purple-700">{a.horas_semana}h/semana</div>
                    </Link>
                  ))}

                  {col.ucs.map((uc) => (
                    <UcCard
                      key={uc.id}
                      uc={uc}
                      score={importancia.get(uc.codigo) ?? 0}
                      isPending={isPending}
                      error={rowErrors[uc.id]}
                      onEdit={() => setEditingUc(uc)}
                      onStatusChange={(status) => handleStatusChange(uc.id, status)}
                      onMove={(destino) => moverPara(uc.id, destino)}
                      onImportanteChange={(valor) => handleImportanteChange(uc.id, valor)}
                      onVerDesbloqueios={() => setDesbloqueiosDeUc(uc)}
                      todosSemestres={todosSemestres}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={adicionarSemestre}
            className="flex w-24 flex-shrink-0 items-center justify-center rounded-md border-2 border-dashed border-neutral-300 text-2xl text-neutral-400 hover:border-neutral-400 hover:text-neutral-600"
            title="Adicionar mais um semestre"
          >
            +
          </button>
        </div>
      </div>

      {colunaAtrasadas && colunaAtrasadas.ucs.length > 0 && !atrasadasOculta && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverCol("atrasadas-topo");
          }}
          onDragLeave={() => setDragOverCol((c) => (c === "atrasadas-topo" ? null : c))}
          onDrop={handleDrop("atrasadas")}
          className={`rounded-md border p-3 transition-colors ${
            dragOverCol === "atrasadas-topo"
              ? "border-blue-400 bg-blue-50"
              : "border-red-300 bg-red-50/40"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Atrasadas</h2>
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                {colunaAtrasadas.ucs.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => ocultar("atrasadas")}
              title="Ocultar essa seção"
              className="text-xs text-neutral-400 hover:text-neutral-700"
            >
              ocultar
            </button>
          </div>
          <p className="mb-2 text-xs text-neutral-500">
            Estas UCs não estão em nenhum semestre. Clique num semestre pra alocar direto, sem
            precisar arrastar — inclusive semestres anteriores ao atual, caso já tenha cursado.
          </p>
          <div className="grid max-h-72 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {atrasadasOrdenadas.map((uc) => {
              const faltando = missingPrerequisites(uc.pre_requisitos, concludedCodes).map(
                (codigo) => nomePorCodigo.get(codigo) ?? codigo,
              );
              const opcoesSemestre = todosSemestres.filter((s) => paridadeBate(uc, s));
              return (
                <AtrasadaCard
                  key={uc.id}
                  uc={uc}
                  score={importancia.get(uc.codigo) ?? 0}
                  isPending={isPending}
                  faltando={faltando}
                  opcoesSemestre={opcoesSemestre}
                  onEdit={() => setEditingUc(uc)}
                  onMove={(destino) => moverPara(uc.id, destino)}
                  onImportanteChange={(valor) => handleImportanteChange(uc.id, valor)}
                  onVerDesbloqueios={() => setDesbloqueiosDeUc(uc)}
                />
              );
            })}
          </div>
        </div>
      )}

      {editingUc && (
        <UcEditModal
          uc={editingUc}
          isPersonal={editingUc.criado_por === currentUserId}
          onClose={() => setEditingUc(null)}
        />
      )}

      {desbloqueiosDeUc && (
        <Modal
          title={`O que ${desbloqueiosDeUc.nome} desbloqueia`}
          onClose={() => setDesbloqueiosDeUc(null)}
        >
          {ucsDesbloqueadas.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Nenhuma UC depende dessa, direta ou indiretamente.
            </p>
          ) : (
            <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto">
              {ucsDesbloqueadas.map((uc) => (
                <li
                  key={uc.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 p-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{uc.nome}</p>
                    <p className="font-mono text-xs text-neutral-500">{uc.codigo}</p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    {uc.semestre_sugerido ? `${uc.semestre_sugerido}º sem.` : "eletiva"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}

function UcCard({
  uc,
  score,
  isPending,
  error,
  onEdit,
  onStatusChange,
  onMove,
  onImportanteChange,
  onVerDesbloqueios,
  todosSemestres = [],
  className = "",
}: {
  uc: Uc;
  score: number;
  isPending: boolean;
  error?: string;
  onEdit: () => void;
  onStatusChange: (status: "concluida" | "planejada") => void;
  onMove?: (destino: number | null) => void;
  onImportanteChange?: (valor: boolean) => void;
  onVerDesbloqueios?: () => void;
  todosSemestres?: number[];
  className?: string;
}) {
  const opcoesSemestre =
    uc.oferta === "ambos" ? todosSemestres : todosSemestres.filter((s) => paridadeBate(uc, s));
  const semestreAtualUc = uc.semestre_planejado ?? uc.semestre_sugerido ?? null;

  const corCard =
    uc.status === "concluida"
      ? "border-green-200 bg-green-50"
      : uc.status === "reprovada"
        ? "border-rose-200 bg-rose-50"
        : uc.importante_pessoal
          ? "border-amber-300 bg-amber-50"
          : "border-neutral-200 bg-white";

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", uc.id)}
      className={`cursor-grab rounded-md border p-2 text-xs shadow-sm active:cursor-grabbing ${corCard} ${className}`}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="truncate text-left font-medium text-neutral-900 hover:underline"
        >
          {uc.nome}
        </button>
        <div className="flex flex-shrink-0 items-center gap-1">
          {onImportanteChange && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onImportanteChange(!uc.importante_pessoal)}
              title="Marcar como importante pra mim"
              className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full disabled:opacity-50 ${
                uc.importante_pessoal
                  ? "text-amber-500"
                  : "text-neutral-300 hover:text-amber-400"
              }`}
            >
              <ExclamationIcon className="h-4 w-4" filled={uc.importante_pessoal} />
            </button>
          )}
          <ConcluidaCheckbox
            status={uc.status}
            disabled={isPending}
            showLabel={false}
            className="mt-0.5"
            onChange={onStatusChange}
          />
        </div>
      </div>
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-neutral-500">
        <span>{uc.creditos} créd.</span>
        <span>{uc.carga_horaria_total}h</span>
        <span>
          {uc.pre_requisitos.length} pré-req
          {uc.pre_requisitos.length !== 1 ? "s" : ""}
        </span>
        {score > 0 &&
          (onVerDesbloqueios ? (
            <button
              type="button"
              onClick={onVerDesbloqueios}
              title={`Ver o que essa UC desbloqueia (${score} UC${score !== 1 ? "s" : ""}, direta ou indiretamente)`}
              className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800 hover:bg-indigo-200"
            >
              ★ {score}
            </button>
          ) : (
            <span
              title={`Desbloqueia ${score} UC${score !== 1 ? "s" : ""} (direta ou indiretamente)`}
              className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800"
            >
              ★ {score}
            </span>
          ))}
      </div>
      <div className="mb-1.5 flex items-center justify-between gap-1">
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${STATUS_COLORS[uc.status]}`}>
          {STATUS_LABELS[uc.status]}
        </span>
        {onMove && (
          <select
            value=""
            disabled={isPending}
            onChange={(e) => {
              const valor = e.target.value;
              if (!valor) return;
              onMove(valor === "eletivas" ? null : Number(valor));
            }}
            title="Mover pra outro semestre (alternativa a arrastar)"
            className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 text-[10px] text-neutral-500"
          >
            <option value="">Mover p/...</option>
            {uc.semestre_sugerido == null && (
              <option value="eletivas" disabled={semestreAtualUc === null}>
                Eletivas
              </option>
            )}
            {opcoesSemestre.map((s) => (
              <option key={s} value={s} disabled={s === semestreAtualUc}>
                {s}º semestre
              </option>
            ))}
          </select>
        )}
      </div>
      {error && <p className="mt-1 text-[10px] text-red-600">{error}</p>}
    </div>
  );
}

// Card compacto pra "Atrasadas": em vez de arrastar, cada semestre válido vira um botão
// clicável que já chama moverPara direto — e se a UC estiver bloqueada, mostra o que falta
// em vez de oferecer semestres (não adianta alocar sem cumprir o pré-requisito antes).
function AtrasadaCard({
  uc,
  score,
  isPending,
  faltando,
  opcoesSemestre,
  onEdit,
  onMove,
  onImportanteChange,
  onVerDesbloqueios,
}: {
  uc: Uc;
  score: number;
  isPending: boolean;
  faltando: string[];
  opcoesSemestre: number[];
  onEdit: () => void;
  onMove: (destino: number) => void;
  onImportanteChange?: (valor: boolean) => void;
  onVerDesbloqueios?: () => void;
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-sm shadow-sm ${
        uc.importante_pessoal ? "border-amber-300 bg-amber-50" : "border-neutral-200 bg-white"
      }`}
    >
      <div className="mb-0.5 flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="text-left font-medium text-neutral-900 hover:underline"
        >
          {uc.nome}
        </button>
        {onImportanteChange && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => onImportanteChange(!uc.importante_pessoal)}
            title="Marcar como importante pra mim"
            className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full disabled:opacity-50 ${
              uc.importante_pessoal ? "text-amber-500" : "text-neutral-300 hover:text-amber-400"
            }`}
          >
            <ExclamationIcon className="h-4 w-4" filled={uc.importante_pessoal} />
          </button>
        )}
      </div>
      <p className="font-mono text-xs text-neutral-400">{uc.codigo}</p>
      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
        <span>{uc.creditos} cr</span>
        <span>{uc.carga_horaria_total}h</span>
        {score > 0 &&
          (onVerDesbloqueios ? (
            <button
              type="button"
              onClick={onVerDesbloqueios}
              title={`Ver o que essa UC desbloqueia (${score} UC${score !== 1 ? "s" : ""}, direta ou indiretamente)`}
              className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800 hover:bg-indigo-200"
            >
              ★ {score}
            </button>
          ) : (
            <span
              title={`Desbloqueia ${score} UC${score !== 1 ? "s" : ""} (direta ou indiretamente)`}
              className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800"
            >
              ★ {score}
            </span>
          ))}
      </div>

      {faltando.length > 0 ? (
        <p className="mt-2 flex items-start gap-1 text-xs text-red-600">
          <span>⚠</span>
          <span>Falta: {faltando.join(", ")}</span>
        </p>
      ) : (
        <div className="mt-2">
          <p className="mb-1 text-xs text-neutral-500">Alocar em:</p>
          {opcoesSemestre.length === 0 ? (
            <p className="text-xs text-neutral-400">Nenhum semestre disponível ainda.</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {opcoesSemestre.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={isPending}
                  onClick={() => onMove(s)}
                  className="rounded-full border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                >
                  {s}º
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
