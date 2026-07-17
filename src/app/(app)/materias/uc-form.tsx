"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import type { Uc } from "@/lib/types";
import { STATUS_LABELS, TIPO_LABELS, type UcStatus } from "@/lib/uc-labels";

// disponível/bloqueada são calculados a partir dos pré-requisitos — não aparecem como opção.
const EDITABLE_STATUS: Array<{ value: "concluida" | "cursando" | "planejada"; label: string }> = [
  { value: "planejada", label: "Planejada" },
  { value: "cursando", label: "Cursando" },
  { value: "concluida", label: "Concluída" },
];

function toEditableValue(status: UcStatus): "concluida" | "cursando" | "planejada" {
  if (status === "concluida" || status === "cursando") return status;
  return "planejada";
}

type FormAction = (
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) => Promise<{ error?: string; success?: boolean }>;

export function UcForm({
  action,
  initial,
  editableCatalogo = true,
  onSuccess,
}: {
  action: FormAction;
  initial?: Uc;
  editableCatalogo?: boolean;
  // se não for passado, navega pra /materias (comportamento da página standalone de edição).
  // se for passado (uso em modal), chama isso em vez de navegar.
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, undefined);
  const [temPreRequisitos, setTemPreRequisitos] = useState(
    (initial?.pre_requisitos?.length ?? 0) > 0,
  );

  useEffect(() => {
    if (state?.success) {
      if (onSuccess) onSuccess();
      else router.push("/materias");
    }
  }, [state, router, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {!editableCatalogo && (
        <p className="rounded-md bg-neutral-100 px-3 py-2 text-xs text-neutral-600">
          Essa é uma UC do catálogo oficial — só o status e o grupo/trilha são pessoais e
          editáveis. Os demais campos são fixos pra todo mundo que cursa essa UC.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Código"
          name="codigo"
          defaultValue={initial?.codigo}
          required
          disabled={!editableCatalogo}
        />
        <Field
          label="Semestre sugerido"
          name="semestre_sugerido"
          type="number"
          defaultValue={initial?.semestre_sugerido ?? ""}
          disabled={!editableCatalogo}
        />
      </div>

      <Field
        label="Nome"
        name="nome"
        defaultValue={initial?.nome}
        required
        disabled={!editableCatalogo}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="tipo" className="text-sm font-medium">
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            defaultValue={initial?.tipo ?? "bct_eletiva_interdisciplinar"}
            disabled={!editableCatalogo}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-100"
          >
            {Object.entries(TIPO_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="oferta" className="text-sm font-medium">
            Oferta
          </label>
          <select
            id="oferta"
            name="oferta"
            defaultValue={initial?.oferta ?? "ambos"}
            disabled={!editableCatalogo}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-100"
          >
            <option value="ambos">Todo semestre</option>
            <option value="impar">Só ímpar</option>
            <option value="par">Só par</option>
          </select>
        </div>
      </div>

      <p className="text-sm font-medium">Carga horária (horas por eixo)</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field
          label="Créditos"
          name="creditos"
          type="number"
          defaultValue={initial?.creditos}
          required
          disabled={!editableCatalogo}
        />
        <Field
          label="Teórica"
          name="carga_horaria_teorica"
          type="number"
          defaultValue={initial?.carga_horaria_teorica ?? 0}
          disabled={!editableCatalogo}
        />
        <Field
          label="Prática"
          name="carga_horaria_pratica"
          type="number"
          defaultValue={initial?.carga_horaria_pratica ?? 0}
          disabled={!editableCatalogo}
        />
        <Field
          label="Extensão"
          name="carga_horaria_extensao"
          type="number"
          defaultValue={initial?.carga_horaria_extensao ?? 0}
          disabled={!editableCatalogo}
        />
      </div>
      <Field
        label="Carga horária total"
        name="carga_horaria_total"
        type="number"
        defaultValue={initial?.carga_horaria_total}
        required
        disabled={!editableCatalogo}
      />
      <p className="-mt-2 text-xs text-neutral-500">
        Referência: 1 crédito = 18h/semestre. UC de 36h tem 1 aula de 2h/semana; UC de 72h tem 2
        aulas de 2h/semana.
      </p>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="tem_pre_requisitos"
            checked={temPreRequisitos}
            onChange={(e) => setTemPreRequisitos(e.target.checked)}
            disabled={!editableCatalogo}
          />
          Tem pré-requisitos?
        </label>
        {temPreRequisitos && (
          <Field
            label="Códigos dos pré-requisitos (separados por vírgula)"
            name="pre_requisitos"
            defaultValue={initial?.pre_requisitos?.join(", ")}
            disabled={!editableCatalogo}
          />
        )}
      </div>

      <hr className="border-neutral-200" />

      {initial && (
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={toEditableValue(initial.status)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {EDITABLE_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {(initial.status === "disponivel" || initial.status === "bloqueada") && (
            <p className="text-xs text-neutral-500">
              Hoje calculado como <strong>{STATUS_LABELS[initial.status]}</strong> a partir dos
              pré-requisitos — deixe como &quot;Planejada&quot; se ainda não vai cursar.
            </p>
          )}
        </div>
      )}

      <Field
        label="Grupo eletiva (opcional, ex: trilha-dados)"
        name="grupo_eletiva"
        defaultValue={initial?.grupo_eletiva ?? ""}
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? undefined}
        required={required}
        disabled={disabled}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-100 disabled:text-neutral-400"
      />
    </div>
  );
}
