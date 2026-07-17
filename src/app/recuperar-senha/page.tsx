"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "./actions";

export default function RecuperarSenhaPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  if (state?.success) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-xl font-semibold">Verifique seu e-mail</h1>
        <p className="text-sm text-neutral-600">
          Se o e-mail informado tiver uma conta, enviamos um link para redefinir sua senha.
        </p>
        <Link href="/login" className="text-sm font-medium text-blue-600 underline">
          Voltar para o login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">Recuperar senha</h1>
        <p className="text-sm text-neutral-600">
          Informe seu e-mail para receber um link de redefinição de senha.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Enviando..." : "Enviar link"}
        </button>
      </form>

      <Link href="/login" className="text-sm text-blue-600 underline">
        Voltar para o login
      </Link>
    </main>
  );
}
