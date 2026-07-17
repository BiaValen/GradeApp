"use client";

import Link from "next/link";
import { useActionState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { login } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen">
      <div className="relative hidden flex-1 flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-br from-blue-600 via-emerald-500 to-amber-400 px-12 py-16 text-white lg:flex">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
            <CapIcon className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold">GradeFlow</h1>
          <p className="max-w-sm text-white/90">
            Planeje sua grade universitária de forma inteligente. Distribua matérias por
            semestre com base nas suas horas disponíveis.
          </p>
        </div>

        <div className="flex gap-10">
          <FeatureIcon icon={<BookIcon className="h-6 w-6" />} label="Matérias" />
          <FeatureIcon icon={<CalendarIcon className="h-6 w-6" />} label="Semestres" />
          <FeatureIcon icon={<CapIcon className="h-6 w-6" />} label="Formatura" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-neutral-50 px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-neutral-900">Bem-vindo de volta!</h2>
            <p className="mt-1 text-sm text-neutral-500">Entre para acessar sua grade</p>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                Senha
              </label>
              <PasswordInput
                id="password"
                name="password"
                required
                autoComplete="current-password"
              />
            </div>

            <Link
              href="/recuperar-senha"
              className="-mt-1 self-end text-xs text-neutral-500 hover:text-blue-600 hover:underline"
            >
              Esqueceu a senha?
            </Link>

            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {pending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Não tem conta?{" "}
            <Link href="/cadastro" className="font-medium text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function FeatureIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
        {icon}
      </div>
      <span className="text-xs text-white/90">{label}</span>
    </div>
  );
}

function iconProps(className?: string) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

function CapIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
