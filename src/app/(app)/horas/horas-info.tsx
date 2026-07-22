"use client";

import { useState } from "react";
import { InfoIcon } from "@/components/icons";
import { Modal } from "@/components/Modal";
import type { CategoriaHoras } from "@/lib/horas";
import type { Curso } from "@/lib/types";

// Botão "i" que explica de onde vêm os números da tela — pra quem quiser conferir as
// contas contra o PPC oficial do curso (metas ficam salvas em cursos.meta_horas_*).
export function HorasInfoButton({
  curso,
  categorias,
  totalMeta,
}: {
  curso: Curso;
  categorias: CategoriaHoras[];
  totalMeta: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Como esses números são calculados"
        aria-label="Como esses números são calculados"
        className="text-white/80 hover:text-white"
      >
        <InfoIcon className="h-5 w-5" />
      </button>

      {open && (
        <Modal title="Como as horas são calculadas" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-3 text-sm text-neutral-700">
            <p>
              As metas abaixo vêm do PPC oficial do seu curso (<strong>{curso.nome}</strong>),
              cadastradas na tabela de cursos do app — dá pra conferir/trocar de curso em{" "}
              <span className="font-medium">Configurações</span>.
            </p>

            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200 text-xs text-neutral-500">
                  <th className="py-1 pr-2">Categoria</th>
                  <th className="py-1 text-right">Meta</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.chave} className="border-b border-neutral-100">
                    <td className="py-1.5 pr-2">{cat.titulo}</td>
                    <td className="py-1.5 text-right font-mono">{cat.meta}h</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-1.5 pr-2 font-medium">Total</td>
                  <td className="py-1.5 text-right font-mono font-medium">{totalMeta}h</td>
                </tr>
              </tbody>
            </table>

            <ul className="list-disc pl-4 text-xs text-neutral-500">
              <li>
                <span className="font-medium text-neutral-700">UCs Fixas</span> soma toda UC
                concluída cujo tipo termina em &quot;fixa&quot; — isso junta as UCs fixas do
                núcleo básico (ex: BCT) com as fixas específicas do curso numa categoria só.
              </li>
              <li>
                <span className="font-medium text-neutral-700">UCs Eletivas</span> soma toda UC
                concluída cujo tipo contém &quot;eletiva&quot; — junta eletivas interdisciplinares
                e regulares numa categoria só.
              </li>
              <li>
                <span className="font-medium text-neutral-700">Atividades Complementares</span>{" "}
                vem da soma dos certificados cadastrados em /certificados, não de UCs do
                catálogo.
              </li>
              <li>
                Carga horária de extensão curricularizada é informativa — já está embutida
                dentro das UCs fixas/eletivas concluídas, não soma à parte no total.
              </li>
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
}
