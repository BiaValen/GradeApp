"use client";

import { useActionState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { updatePassword } from "./actions";

export default function RedefinirSenhaPage() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">Nova senha</h1>
        <p className="text-sm text-neutral-600">Escolha uma nova senha para sua conta.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Nova senha
          </label>
          <PasswordInput
            id="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </main>
  );
}
