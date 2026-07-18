import { createClient } from "@/lib/supabase/server";
import { computeDisplayStatus } from "@/lib/status";
import type { Curso, Uc, UcCatalogo, UcOferta } from "@/lib/types";
import type { UcTipo } from "@/lib/seed-data";

export async function getMateriasDoUsuario(): Promise<{
  ucs: Uc[];
  curso: Curso | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ucs: [], curso: null, error: "Não autenticado." };

  const { data: perfil } = await supabase
    .from("perfil")
    .select("curso_id")
    .eq("user_id", user.id)
    .single();

  let curso: Curso | null = null;
  if (perfil?.curso_id) {
    const { data } = await supabase.from("cursos").select("*").eq("id", perfil.curso_id).single();
    curso = (data as Curso | null) ?? null;
  }
  // Perfil sem curso definido ainda (não deveria acontecer depois da tela /curso, mas
  // sem isso a lista viria vazia em vez de cair num curso padrão razoável).
  if (!curso) {
    const { data } = await supabase.from("cursos").select("*").order("nome").limit(1).single();
    curso = (data as Curso | null) ?? null;
  }

  if (!curso) return { ucs: [], curso: null, error: "Nenhum curso cadastrado." };

  const { data: cursoUcs, error: cursoUcsError } = await supabase
    .from("curso_ucs")
    .select("uc_id, tipo, semestre_sugerido, oferta")
    .eq("curso_id", curso.id);

  if (cursoUcsError) return { ucs: [], curso, error: cursoUcsError.message };

  const classificacaoPorUcId = new Map(
    (cursoUcs ?? []).map((c) => [
      c.uc_id as string,
      {
        tipo: c.tipo as UcTipo,
        semestre_sugerido: c.semestre_sugerido as number | null,
        oferta: c.oferta as UcOferta,
      },
    ]),
  );

  const ucIds = Array.from(classificacaoPorUcId.keys());
  if (ucIds.length === 0) return { ucs: [], curso, error: null };

  const { data: identidades, error: catalogoError } = await supabase
    .from("unidades_curriculares")
    .select(
      "id, criado_por, codigo, nome, creditos, carga_horaria_teorica, carga_horaria_pratica, carga_horaria_total, carga_horaria_extensao, pre_requisitos",
    )
    .in("id", ucIds);

  if (catalogoError) return { ucs: [], curso, error: catalogoError.message };

  const catalogoList: UcCatalogo[] = (identidades ?? []).map((uc) => {
    const classificacao = classificacaoPorUcId.get(uc.id)!;
    return { ...uc, ...classificacao };
  });
  catalogoList.sort((a, b) => {
    const semA = a.semestre_sugerido ?? Infinity;
    const semB = b.semestre_sugerido ?? Infinity;
    if (semA !== semB) return semA - semB;
    return a.codigo.localeCompare(b.codigo);
  });

  const { data: progresso } = await supabase
    .from("progresso_uc")
    .select("uc_id, status, grupo_eletiva, semestre_planejado, importante_pessoal")
    .eq("user_id", user.id);

  const progressoMap = new Map((progresso ?? []).map((p) => [p.uc_id, p]));
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
        importante_pessoal: progressoMap.get(uc.id)?.importante_pessoal ?? false,
      };
    });

  return { ucs, curso, error: null };
}
