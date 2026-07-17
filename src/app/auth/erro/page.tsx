import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold">Link inválido ou expirado</h1>
      <p className="text-sm text-neutral-600">
        O link que você usou não é mais válido. Solicite um novo e-mail de confirmação ou
        recuperação de senha.
      </p>
      <Link href="/login" className="text-sm font-medium text-blue-600 underline">
        Voltar para o login
      </Link>
    </main>
  );
}
