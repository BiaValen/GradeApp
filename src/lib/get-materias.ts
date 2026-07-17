import { createClient } from "@/lib/supabase/server";
import { computeDisplayStatus } from "@/lib/status";
import type { Uc, UcCatalogo } from "@/lib/types";

export async function getMateriasDoUsuario(): Promise<{ ucs: Uc[]; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ucs: [], error: "Não autenticado." };

  const { data: catalogo, error: catalogoError } = await supabase
    .from("unidades_curriculares")
    .select("*")
    .order("semestre_sugerido", { ascending: true, nullsFirst: false })
    .order("codigo");

  if (catalogoError) return { ucs: [], error: catalogoError.message };

  const { data: progresso } = await supabase
    .from("progresso_uc")
    .select("uc_id, status, grupo_eletiva, semestre_planejado")
    .eq("user_id", user.id);

  const progressoMap = new Map((progresso ?? []).map((p) => [p.uc_id, p]));
  const catalogoList = (catalogo ?? []) as UcCatalogo[];
  const codigoById = new Map(catalogoList.map((uc) => [uc.id, uc.codigo]));

  const concludedCodes = new Set(
    (progresso ?? [])
      .filter((p) => p.status === "concluida")
      .map((p) => codigoById.get(p.uc_id))
      .filter((codigo): codigo is string => Boolean(codigo)),
  );

  const ucs: Uc[] = catalogoList
    .filter((uc) => progressoMap.has(uc.id))
    .map((uc) => {
      const storedStatus = (progressoMap.get(uc.id)?.status ?? "planejada") as Uc["status"];
      return {
        ...uc,
        status: computeDisplayStatus(storedStatus, uc.pre_requisitos, concludedCodes),
        grupo_eletiva: progressoMap.get(uc.id)?.grupo_eletiva ?? null,
        semestre_planejado: progressoMap.get(uc.id)?.semestre_planejado ?? null,
      };
    });

  return { ucs, error: null };
}
