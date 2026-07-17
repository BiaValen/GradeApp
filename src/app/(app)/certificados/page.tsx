import { createClient } from "@/lib/supabase/server";
import type { Certificado } from "@/lib/types";
import { CertificadosManager } from "./certificados-manager";

export default async function CertificadosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: certificados, error } = await supabase
    .from("certificados")
    .select("*")
    .eq("user_id", user!.id)
    .order("ano", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Certificados</h1>

      {error ? (
        <p className="text-sm text-red-600">
          Erro ao carregar: {error.message}. Rode as migrations mais recentes no Supabase.
        </p>
      ) : (
        <CertificadosManager certificados={(certificados ?? []) as Certificado[]} />
      )}
    </main>
  );
}
