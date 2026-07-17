"use client";

import type { UcStatus } from "@/lib/uc-labels";

export function ConcluidaCheckbox({
  status,
  disabled,
  onChange,
  showLabel = true,
  className = "",
}: {
  status: UcStatus;
  disabled?: boolean;
  onChange: (novoStatus: "concluida" | "planejada") => void;
  showLabel?: boolean;
  className?: string;
}) {
  const checked = status === "concluida";
  const input = (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked ? "concluida" : "planejada")}
      title="Concluída"
      className={`h-3.5 w-3.5 cursor-pointer ${className}`}
    />
  );

  if (!showLabel) return input;

  return (
    <label className="flex items-center gap-1.5 text-xs text-neutral-600">
      {input}
      Concluída
    </label>
  );
}
