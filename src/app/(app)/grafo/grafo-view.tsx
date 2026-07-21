"use client";

import { useMemo, useState } from "react";
import { calcularAnteriores, calcularPosteriores } from "@/lib/dependencias";
import type { Uc } from "@/lib/types";
import { STATUS_LABELS, type UcStatus } from "@/lib/uc-labels";

const STATUS_FILL: Record<UcStatus, string> = {
  concluida: "#16a34a",
  disponivel: "#2563eb",
  bloqueada: "#ea580c",
  cursando: "#7c3aed",
  planejada: "#a3a3a3",
  reprovada: "#e11d48",
};

const COR_ANTERIOR = "#2563eb"; // pré-requisitos do selecionado (ramo "antes")
const COR_POSTERIOR = "#d97706"; // UCs que dependem do selecionado (ramo "depois")

const COL_WIDTH = 190;
const NODE_WIDTH = 168;
const NODE_HEIGHT = 50;
const ROW_HEIGHT = 64;
const HEADER_HEIGHT = 40;
const PADDING = 20;

interface NodePos {
  uc: Uc;
  x: number;
  y: number;
}

// Sobe a cadeia de pré-requisitos (o que precisa vir ANTES do selecionado) e desce a
// cadeia de dependentes (o que só pode vir DEPOIS dele) — lógica compartilhada com o
// botão "o que desbloqueia" do Plano (ver src/lib/dependencias.ts).
function useDependencias(ucs: Uc[], selecionado: string | null) {
  return useMemo(() => {
    if (!selecionado) return { anteriores: new Set<string>(), posteriores: new Set<string>() };
    return {
      anteriores: calcularAnteriores(ucs, selecionado),
      posteriores: calcularPosteriores(ucs, selecionado),
    };
  }, [ucs, selecionado]);
}

export function GrafoView({ ucs }: { ucs: Uc[] }) {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const { anteriores, posteriores } = useDependencias(ucs, selecionado);

  function alternarSelecao(codigo: string) {
    setSelecionado((atual) => (atual === codigo ? null : codigo));
  }

  function estadoDoNo(codigo: string): "selecionado" | "anterior" | "posterior" | "dim" | "normal" {
    if (!selecionado) return "normal";
    if (codigo === selecionado) return "selecionado";
    if (anteriores.has(codigo)) return "anterior";
    if (posteriores.has(codigo)) return "posterior";
    return "dim";
  }

  const { nodes, edges, width, height, semesters, eletivas } = useMemo(() => {
    const semestredUcs = ucs.filter((u) => u.semestre_sugerido != null);
    const eletivasList = ucs.filter((u) => u.semestre_sugerido == null);

    const semestersSet = Array.from(
      new Set(semestredUcs.map((u) => u.semestre_sugerido as number)),
    ).sort((a, b) => a - b);

    const nodeList: NodePos[] = [];
    const colIndexOf = new Map(semestersSet.map((s, i) => [s, i]));

    const countPerCol = new Map<number, number>();
    for (const uc of semestredUcs) {
      const sem = uc.semestre_sugerido as number;
      const col = colIndexOf.get(sem)!;
      const row = countPerCol.get(sem) ?? 0;
      countPerCol.set(sem, row + 1);
      nodeList.push({
        uc,
        x: PADDING + col * COL_WIDTH,
        y: PADDING + HEADER_HEIGHT + row * ROW_HEIGHT,
      });
    }

    const posByCodigo = new Map(nodeList.map((n) => [n.uc.codigo, n]));

    const edgeList: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      key: string;
      de: string;
      para: string;
    }> = [];
    for (const n of nodeList) {
      for (const prereqCodigo of n.uc.pre_requisitos) {
        const from = posByCodigo.get(prereqCodigo);
        if (!from) continue;
        edgeList.push({
          x1: from.x + NODE_WIDTH,
          y1: from.y + NODE_HEIGHT / 2,
          x2: n.x,
          y2: n.y + NODE_HEIGHT / 2,
          key: `${prereqCodigo}->${n.uc.codigo}`,
          de: prereqCodigo,
          para: n.uc.codigo,
        });
      }
    }

    const maxRows = Math.max(1, ...Array.from(countPerCol.values()));
    const totalWidth = PADDING * 2 + semestersSet.length * COL_WIDTH;
    const totalHeight = PADDING * 2 + HEADER_HEIGHT + maxRows * ROW_HEIGHT;

    return {
      nodes: nodeList,
      edges: edgeList,
      width: totalWidth,
      height: totalHeight,
      semesters: semestersSet,
      eletivas: eletivasList,
    };
  }, [ucs]);

  function estiloAresta(de: string, para: string) {
    if (!selecionado) {
      return { stroke: "#e5e5e5", strokeWidth: 1.2, opacity: 0.6 };
    }
    const noRamoAnterior =
      anteriores.has(de) && (para === selecionado || anteriores.has(para));
    const noRamoPosterior =
      (de === selecionado || posteriores.has(de)) && posteriores.has(para);
    if (noRamoAnterior) return { stroke: COR_ANTERIOR, strokeWidth: 2.5, opacity: 0.9 };
    if (noRamoPosterior) return { stroke: COR_POSTERIOR, strokeWidth: 2.5, opacity: 0.9 };
    return { stroke: "#e5e5e5", strokeWidth: 1, opacity: 0.15 };
  }

  function estiloNo(codigo: string) {
    const estado = estadoDoNo(codigo);
    switch (estado) {
      case "selecionado":
        return { opacity: 1, ring: "0 0 0 3px #111827" };
      case "anterior":
        return { opacity: 1, ring: `0 0 0 3px ${COR_ANTERIOR}` };
      case "posterior":
        return { opacity: 1, ring: `0 0 0 3px ${COR_POSTERIOR}` };
      case "dim":
        return { opacity: 0.2, ring: "none" };
      default:
        return { opacity: 1, ring: "none" };
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-sm">
          {(Object.keys(STATUS_LABELS) as UcStatus[]).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: STATUS_FILL[status] }}
              />
              {STATUS_LABELS[status]}
            </div>
          ))}
        </div>
        {selecionado ? (
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COR_ANTERIOR }} />
              Pré-requisitos (antes)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COR_POSTERIOR }} />
              Dependentes (depois)
            </span>
            <button
              type="button"
              onClick={() => setSelecionado(null)}
              className="rounded-md border border-neutral-300 px-2 py-1 text-neutral-600 hover:bg-neutral-50"
            >
              Limpar seleção
            </button>
          </div>
        ) : (
          <p className="text-xs text-neutral-500">
            Clique numa UC pra destacar a cadeia de pré-requisitos e dependentes dela.
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200 p-2">
        <svg width={width} height={height}>
          {semesters.map((sem, i) => (
            <foreignObject
              key={sem}
              x={PADDING + i * COL_WIDTH}
              y={PADDING}
              width={NODE_WIDTH}
              height={HEADER_HEIGHT}
            >
              <div className="text-sm font-semibold text-neutral-700">{sem}º semestre</div>
            </foreignObject>
          ))}

          {edges.map((e) => {
            const midX = (e.x1 + e.x2) / 2;
            const estilo = estiloAresta(e.de, e.para);
            return (
              <path
                key={e.key}
                d={`M ${e.x1} ${e.y1} C ${midX} ${e.y1}, ${midX} ${e.y2}, ${e.x2} ${e.y2}`}
                fill="none"
                stroke={estilo.stroke}
                strokeWidth={estilo.strokeWidth}
                opacity={estilo.opacity}
                style={{ transition: "opacity 150ms, stroke 150ms" }}
              />
            );
          })}

          {nodes.map(({ uc, x, y }) => {
            const estilo = estiloNo(uc.codigo);
            return (
              <foreignObject key={uc.id} x={x} y={y} width={NODE_WIDTH} height={NODE_HEIGHT}>
                <button
                  type="button"
                  title={`${uc.codigo} — ${uc.nome}`}
                  onClick={() => alternarSelecao(uc.codigo)}
                  className="flex h-full w-full flex-col items-start justify-center overflow-hidden rounded-md border px-2 text-left text-white"
                  style={{
                    backgroundColor: STATUS_FILL[uc.status],
                    borderColor: STATUS_FILL[uc.status],
                    opacity: estilo.opacity,
                    boxShadow: estilo.ring === "none" ? undefined : estilo.ring,
                    transition: "opacity 150ms, box-shadow 150ms",
                  }}
                >
                  <span className="w-full truncate text-[11px] font-mono opacity-90">
                    {uc.codigo}
                  </span>
                  <span className="w-full truncate text-xs font-medium">{uc.nome}</span>
                </button>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {eletivas.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-semibold">Eletivas (livre escolha)</h2>
          <div className="flex flex-wrap gap-2">
            {eletivas.map((uc) => {
              const estilo = estiloNo(uc.codigo);
              return (
                <button
                  key={uc.id}
                  type="button"
                  title={`${uc.codigo} — ${uc.nome}`}
                  onClick={() => alternarSelecao(uc.codigo)}
                  className="max-w-[220px] truncate rounded-full px-3 py-1 text-left text-xs text-white"
                  style={{
                    backgroundColor: STATUS_FILL[uc.status],
                    opacity: estilo.opacity,
                    boxShadow: estilo.ring === "none" ? undefined : estilo.ring,
                    transition: "opacity 150ms, box-shadow 150ms",
                  }}
                >
                  {uc.nome}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
