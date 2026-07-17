"use client";

import { useState, useTransition } from "react";
import { seedOfficialData } from "./actions";

export function SeedButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await seedOfficialData();
            if (result?.error) setError(result.error);
          })
        }
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Importando..." : "Importar grade oficial do PPC"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
