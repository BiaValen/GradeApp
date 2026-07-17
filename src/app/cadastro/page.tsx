"use client";

import Link from "next/link";
import { useActionState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { signup } from "./actions";

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(signup, undefined);

  if (state?.success) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-xl font-semibold">Confirme seu e-mail</h1>
        <p className="text-sm text-neutral-600">
          Enviamos um link de confirmação para o e-mail informado. Clique nele para ativar sua
          conta.
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
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <p className="text-sm text-neutral-600">
          Comece a acompanhar sua grade curricular no GradeFlow.
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

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
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
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="text-sm">
        Já tem conta?{" "}
        <Link href="/login" className="text-blue-600 underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
