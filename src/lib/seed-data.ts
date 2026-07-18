// Catálogo oficial de UCs do curso de Engenharia de Computação (UNIFESP), PPC 2023.
// Fontes: Projeto_Pedagogico_EC_2023.pdf, Matriz_Curricular.pdf, Pre-requisitos_ECOMP.pdf,
// UCs_Eletivas_Interdisciplinares_PPC_2023.pdf. Códigos "SC-*" são UCs sem código oficial no PPC.
// Eletivas (interdisciplinares/regulares) não têm semestre fixo — são de livre escolha.
//
// Fontes complementares usadas só para preencher lacunas pontuais (códigos/CH de IA, UX, IoT):
// planilha "LISTA DE UCs - BCT" (docs.google.com/spreadsheets/d/1uOFS9nw3GPWgK7xGMLiDNe6OKqfjBcuuKKtByK-prqQ)
// e https://ajudauni.com/data/{Courses,Subjects}.json. Nenhuma delas é específica de ECOMP — cobrem
// o BCT inteiro (todas as especializações: Biomédica, Materiais, Biotecnologia etc.) e têm eletivas
// fora do escopo deste curso. Guardadas aqui como referência para quando o app suportar multi-curso
// (ver seção 6/7 do pedido original) — não usar para seedar UCs de outras especializações agora.

export type UcTipo =
  | "bct_fixa"
  | "bct_eletiva_interdisciplinar"
  | "bct_eletiva_regular"
  | "ecomp_fixa"
  | "ecomp_trajetoria_integrada"
  | "bcc_fixa"
  | "bcc_eletiva_regular"
  | "estagio"
  | "tcc"
  | "atividade_complementar";

export interface UcSeed {
  codigo: string;
  nome: string;
  semestre_sugerido: number | null;
  creditos: number;
  carga_horaria_teorica: number;
  carga_horaria_pratica: number;
  carga_horaria_total: number;
  carga_horaria_extensao: number;
  tipo: UcTipo;
  pre_requisitos: string[];
}

export const seedData: UcSeed[] = [
  // ===== Semestre 1 =====
  { codigo: "5702", nome: "Cálculo em Uma Variável", semestre_sugerido: 1, creditos: 6, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 108, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "2672", nome: "Ciência, Tecnologia e Sociedade", semestre_sugerido: 1, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "9394", nome: "Lógica de Programação", semestre_sugerido: 1, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "5704", nome: "Química Geral", semestre_sugerido: 1, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "5703", nome: "Fundamentos de Biologia Moderna", semestre_sugerido: 1, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },

  // ===== Semestre 2 =====
  { codigo: "4369", nome: "Fenômenos Mecânicos", semestre_sugerido: 2, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "5870", nome: "Ciência, Tecnologia, Sociedade e Ambiente", semestre_sugerido: 2, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "2832", nome: "Algoritmos e Estruturas de Dados I", semestre_sugerido: 2, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["9394"] },
  { codigo: "2650", nome: "Geometria Analítica", semestre_sugerido: 2, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "4328", nome: "Séries e Equações Diferenciais Ordinárias", semestre_sugerido: 2, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["5702"] },
  { codigo: "2201", nome: "Matemática Discreta", semestre_sugerido: 2, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "5900", nome: "Desenho Técnico Básico", semestre_sugerido: 2, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },

  // ===== Semestre 3 =====
  { codigo: "4348", nome: "Fenômenos do Contínuo", semestre_sugerido: 3, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "2833", nome: "Algoritmos e Estruturas de Dados II", semestre_sugerido: 3, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["2832"] },
  { codigo: "5359", nome: "Cálculo em Várias Variáveis", semestre_sugerido: 3, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["5702", "2650"] },
  { codigo: "2475", nome: "Álgebra Linear", semestre_sugerido: 3, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["2650"] },
  { codigo: "2609", nome: "Probabilidade e Estatística", semestre_sugerido: 3, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 18, tipo: "ecomp_trajetoria_integrada", pre_requisitos: ["5702"] },
  { codigo: "3518", nome: "Circuitos Digitais", semestre_sugerido: 3, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 20, tipo: "ecomp_trajetoria_integrada", pre_requisitos: [] },

  // ===== Semestre 4 =====
  { codigo: "3579", nome: "Projeto e Análise de Algoritmos", semestre_sugerido: 4, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["2201", "2833"] },
  { codigo: "2471", nome: "Programação Orientada a Objetos", semestre_sugerido: 4, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["2832"] },
  { codigo: "5902", nome: "Circuitos Elétricos I", semestre_sugerido: 4, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "4748", nome: "Fenômenos Eletromagnéticos", semestre_sugerido: 4, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "3519", nome: "Arquitetura e Organização de Computadores", semestre_sugerido: 4, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["9394", "3518"] },
  { codigo: "5928", nome: "Lab. de Sist. Computacionais: Circuitos Digitais", semestre_sugerido: 4, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["3518"] },

  // ===== Semestre 5 =====
  { codigo: "SC-INTRO-MAT-ELET", nome: "Introdução aos Materiais Elétricos", semestre_sugerido: 5, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["4748"] },
  { codigo: "5132", nome: "Análise de Sinais", semestre_sugerido: 5, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["4328"] },
  { codigo: "5903", nome: "Circuitos Elétricos II", semestre_sugerido: 5, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["5902", "4748"] },
  { codigo: "5137", nome: "Fenômenos Eletromagnéticos Experimental", semestre_sugerido: 5, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 4, tipo: "ecomp_trajetoria_integrada", pre_requisitos: ["4748"] },
  { codigo: "2616", nome: "Linguagens Formais e Autômatos", semestre_sugerido: 5, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["2201", "9394"] },
  { codigo: "6090", nome: "Lab. de Sist. Computacionais: AOC", semestre_sugerido: 5, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["3519", "5928"] },

  // ===== Semestre 6 =====
  { codigo: "4770", nome: "Mecânica Geral", semestre_sugerido: 6, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["4369", "2650"] },
  { codigo: "5386", nome: "Controle de Sistemas Dinâmicos", semestre_sugerido: 6, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["5903"] },
  { codigo: "SC-FUND-ELETR-APLIC", nome: "Fundamentos de Eletrônica Aplicada", semestre_sugerido: 6, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["SC-INTRO-MAT-ELET"] },
  { codigo: "2614", nome: "Engenharia de Software", semestre_sugerido: 6, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 16, tipo: "ecomp_trajetoria_integrada", pre_requisitos: ["2471"] },
  { codigo: "2831", nome: "Banco de Dados", semestre_sugerido: 6, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 16, tipo: "ecomp_trajetoria_integrada", pre_requisitos: ["2832"] },
  { codigo: "2615", nome: "Compiladores", semestre_sugerido: 6, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["2616"] },
  { codigo: "6095", nome: "Lab. de Sist. Computacionais: Eng. de Sistemas", semestre_sugerido: 6, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["6090"] },

  // ===== Semestre 7 =====
  { codigo: "SC-LAB-CONTROLE-APLIC", nome: "Laboratório de Controle Aplicado", semestre_sugerido: 7, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["5386"] },
  { codigo: "6089", nome: "Laboratório de Circuitos Elétricos", semestre_sugerido: 7, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["4748", "5903"] },
  { codigo: "6033", nome: "Sistemas Embarcados", semestre_sugerido: 7, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 16, tipo: "ecomp_trajetoria_integrada", pre_requisitos: ["9394", "3518"] },
  { codigo: "SC-PROJ-ENG-COMP", nome: "Projetos em Engenharia de Computação", semestre_sugerido: 7, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 72, tipo: "ecomp_fixa", pre_requisitos: ["2831", "2614"] },
  { codigo: "2612", nome: "Sistemas Operacionais", semestre_sugerido: 7, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["2832"] },
  { codigo: "6098", nome: "Lab. de Sist. Computacionais: Compiladores", semestre_sugerido: 7, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["2615", "6095"] },

  // ===== Semestre 8 =====
  { codigo: "SC-INTRO-ECON", nome: "Introdução à Economia", semestre_sugerido: 8, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "2828", nome: "Cálculo Numérico", semestre_sugerido: 8, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["5702", "2650"] },
  { codigo: "3580", nome: "Programação Concorrente e Distribuída", semestre_sugerido: 8, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: ["2612"] },
  { codigo: "8288", nome: "Segurança da Informação", semestre_sugerido: 8, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 8, tipo: "ecomp_trajetoria_integrada", pre_requisitos: ["2612"] },
  { codigo: "2617", nome: "Redes de Computadores", semestre_sugerido: 8, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["2612"] },
  { codigo: "6102", nome: "Lab. de Sist. Computacionais: Sistemas Operacionais", semestre_sugerido: 8, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["2612", "6098"] },

  // ===== Semestre 9 =====
  { codigo: "7754", nome: "Estágio Supervisionado", semestre_sugerido: 9, creditos: 10, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 180, carga_horaria_extensao: 0, tipo: "estagio", pre_requisitos: ["SC-PROJ-ENG-COMP", "6102"] },
  { codigo: "SC-TCC1", nome: "Trabalho de Conclusão de Curso I", semestre_sugerido: 9, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "tcc", pre_requisitos: ["SC-PROJ-ENG-COMP"] },
  { codigo: "SC-FUND-ADM", nome: "Fundamentos de Administração", semestre_sugerido: 9, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_fixa", pre_requisitos: [] },
  { codigo: "8271", nome: "Lab. de Sist. Computacionais: Comunicação Digital", semestre_sugerido: 9, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "ecomp_fixa", pre_requisitos: ["6102"] },

  // ===== Semestre 10 =====
  { codigo: "SC-TCC2", nome: "Trabalho de Conclusão de Curso II", semestre_sugerido: 10, creditos: 8, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 144, carga_horaria_extensao: 0, tipo: "tcc", pre_requisitos: ["SC-TCC1"] },

  // ===== Atividades Complementares =====
  { codigo: "AC-108", nome: "Atividades Complementares", semestre_sugerido: null, creditos: 0, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 108, carga_horaria_extensao: 0, tipo: "atividade_complementar", pre_requisitos: [] },

  // ===== Eletivas interdisciplinares (livre escolha — mínimo 4 UCs, 144h) =====
  { codigo: "5414", nome: "Algoritmos em Bioinformática", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["9394"] },
  { codigo: "5095", nome: "Análise de Investimentos e Riscos", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5932", nome: "Bioestatística", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5702"] },
  { codigo: "5384", nome: "Bioética e Biossegurança", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 36, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5170", nome: "Biomateriais", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 4, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5704"] },
  { codigo: "6046", nome: "Códigos Corretores de Erros", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2475"] },
  { codigo: "6076", nome: "Cultura dos Jogos Digitais", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "8536", nome: "Desenvolvimento de Games", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 36, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2832"] },
  { codigo: "6084", nome: "Direitos Humanos, Multiculturalismo e C&T", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5408", nome: "Econometria", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "7671", nome: "Empreendedorismo", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5849", nome: "Empreendedorismo em Biotecnologia", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5868", nome: "Engenharia Tecidual e Medicina Regenerativa", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 20, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5741", "8215"] },
  { codigo: "SC-FENOM-OPTICOS", nome: "Fenômenos Ópticos", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["4369"] },
  { codigo: "8650", nome: "Gestão da Inovação", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5886", nome: "Gestão de Projetos", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "SC-PEPICT-I", nome: "Iniciação aos PEPICT I", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 36, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "SC-PEPICT-II", nome: "Iniciação aos PEPICT II", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 36, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "9881", nome: "Internet das Coisas", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 36, carga_horaria_pratica: 36, carga_horaria_total: 72, carga_horaria_extensao: 36, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["9394", "3518"] },
  { codigo: "5372", nome: "Introdução à Bioinformática", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["9394", "5741"] },
  { codigo: "5390", nome: "Introdução à Biologia de Sistemas", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5741"] },
  { codigo: "4760", nome: "Introdução à Biotecnologia", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 4, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5703"] },
  { codigo: "4714", nome: "Introdução à Ecologia", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 20, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "4373", nome: "Introdução à Engenharia de Materiais", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5169", nome: "Introdução à Nanotecnologia", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 6, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5704"] },
  { codigo: "4375", nome: "Laboratório de Biologia Molecular e Celular", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5741"] },
  { codigo: "5845", nome: "Laboratório de Bioquímica", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5842", "5843"] },
  { codigo: "5852", nome: "Laboratório de Engenharia Bioquímica", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5762"] },
  { codigo: "6055", nome: "Laboratório de Estatística Aplicada", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2609"] },
  { codigo: "5848", nome: "Laboratório de Microbiologia", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5120"] },
  { codigo: "8239", nome: "Marketing Estratégico", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "6104", nome: "Métodos Numéricos para Equações Diferenciais", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2475", "2828", "4328"] },
  { codigo: "4352", nome: "Modelagem Computacional", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["9394", "5702"] },
  { codigo: "4774", nome: "Mudança do Clima e Sociedade", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5102", nome: "Otimização Inteira", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["4148"] },
  { codigo: "4166", nome: "Planejamento de Experimentos", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 12, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2609"] },
  { codigo: "8240", nome: "Prática em Projetos Extensionistas I", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 72, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2672", "5703", "5704", "9394"] },
  { codigo: "8051", nome: "Prática em Projetos Extensionistas II", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 72, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2672", "5703", "5704", "9394"] },
  { codigo: "5885", nome: "Qualidade", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "5883", nome: "Química Analítica", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 16, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5704"] },
  { codigo: "4370", nome: "Química Geral Experimental", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 16, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5704"] },
  { codigo: "4272", nome: "Química Inorgânica", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5704", "4370"] },
  { codigo: "4536", nome: "Química Orgânica Experimental", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["5704", "4370"] },
  { codigo: "SC-RPM-MAT-I", nome: "Resolução de Problemas via Modelagem Matemática I", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 72, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2650", "4328", "5359", "9394"] },
  { codigo: "SC-RPM-MAT-II", nome: "Resolução de Problemas via Modelagem Matemática II", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 72, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2650", "4328", "5359", "9394"] },
  { codigo: "5396", nome: "Seleção de Materiais", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 8, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["4764"] },
  { codigo: "4537", nome: "Tecnologia e Meio Ambiente", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 12, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "6072", nome: "Tecnologia Social: Práxis e Contra-Hegemonia", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "4406", nome: "Teoria dos Números e Criptografia", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2201"] },
  { codigo: "6073", nome: "Tópicos em Ciência e Tecnologia I", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "6079", nome: "Tópicos em Ciência e Tecnologia II", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "6091", nome: "Tópicos em Ciência e Tecnologia III", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "6096", nome: "Tópicos em Ciência e Tecnologia IV", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "6943", nome: "Tópicos em Estatística", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 12, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2609"] },
  { codigo: "SC-TOP-MAT-SOC-I", nome: "Tópicos em Matemática e Sociedade I", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 36, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2650", "4328"] },
  { codigo: "SC-TOP-MAT-SOC-II", nome: "Tópicos em Matemática e Sociedade II", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 36, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["2650", "4328"] },
  { codigo: "SC-TOP-ECON-NEG", nome: "Tópicos Especiais em Economia e Negócios", semestre_sugerido: null, creditos: 2, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 36, carga_horaria_extensao: 18, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: [] },
  { codigo: "SC-TOP-FISICA", nome: "Tópicos Especiais em Física", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 0, carga_horaria_pratica: 0, carga_horaria_total: 72, carga_horaria_extensao: 0, tipo: "bct_eletiva_interdisciplinar", pre_requisitos: ["4748"] },

  // ===== Eletivas regulares com extensão (não interdisciplinares, Tabela 8 do PPC) =====
  { codigo: "9880", nome: "Interação Humano-Computador e Experiência do Usuário (UX)", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 54, carga_horaria_pratica: 18, carga_horaria_total: 72, carga_horaria_extensao: 16, tipo: "bct_eletiva_regular", pre_requisitos: ["2471"] },
  { codigo: "3490", nome: "Inteligência Artificial", semestre_sugerido: null, creditos: 4, carga_horaria_teorica: 48, carga_horaria_pratica: 24, carga_horaria_total: 72, carga_horaria_extensao: 8, tipo: "bct_eletiva_regular", pre_requisitos: ["2832"] },
];
