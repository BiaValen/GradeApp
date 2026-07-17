"use client";

export function Toast({
  message,
  onClose,
  tone = "error",
}: {
  message: string;
  onClose: () => void;
  tone?: "error" | "info";
}) {
  const toneClasses =
    tone === "error" ? "bg-red-600 text-white" : "bg-neutral-900 text-white";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        role="alert"
        className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-md px-4 py-3 text-sm shadow-lg ${toneClasses}`}
      >
        <span className="flex-1">{message}</span>
        <button type="button" onClick={onClose} aria-label="Fechar" className="shrink-0 opacity-80 hover:opacity-100">
          ✕
        </button>
      </div>
    </div>
  );
}
