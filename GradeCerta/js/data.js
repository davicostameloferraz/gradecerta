/**
 * GradeCerta — camada de dados simulada (protótipo, sem backend real).
 * Usa localStorage como "banco de dados" compartilhado entre as páginas.
 * Quando o sistema final tiver PHP + banco de verdade, essas funções
 * são o que deve virar chamadas de API — a estrutura dos dados já
 * fica pronta pra essa migração.
 */

const GC_KEYS = {
  AVISOS: 'gradecerta_avisos',
  HORARIOS: 'gradecerta_horarios',
  SESSION: 'gradecerta_session',
  DISPONIBILIDADE: 'gradecerta_disponibilidade',
  SOLICITACOES: 'gradecerta_solicitacoes',
};

const GC_DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
const GC_DIAS_UTEIS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
const GC_DIAS_LABEL = {
  domingo: 'Domingo', segunda: 'Segunda-feira', terca: 'Terça-feira',
  quarta: 'Quarta-feira', quinta: 'Quinta-feira', sexta: 'Sexta-feira', sabado: 'Sábado',
};
const GC_DIAS_LABEL_CURTO = {
  segunda: 'Segunda', terca: 'Terça', quarta: 'Quarta', quinta: 'Quinta', sexta: 'Sexta',
};

// ---- Matérias: categoria (pra cor) ----
// Técnicas (do curso) ficam todas com uma cor só; as demais, uma cor por matéria.
const GC_MATERIA_CATEGORIA = {
  'APS': 'tecnica', 'PWEB II': 'tecnica', 'SIS.EMB1': 'tecnica',
  'PAM1': 'tecnica', 'BD1': 'tecnica', 'DS': 'tecnica',
  'LPL': 'lpl', 'ING': 'ing', 'BIOL': 'biol', 'EDF': 'edf', 'GEO': 'geo',
  'HIST': 'hist', 'MAT': 'mat', 'QUIM': 'quim', 'FIS': 'fis',
};

const GC_CORES = {
  tecnica: { bg: '#E1EAFD', text: '#1E40AF', dot: '#3B82F6', label: 'Área Técnica' },
  lpl:     { bg: '#FCE1E6', text: '#9F1239', dot: '#F43F5E', label: 'LPL — Língua Port. e Literatura' },
  ing:     { bg: '#D9F5F1', text: '#0F766E', dot: '#14B8A6', label: 'ING — Inglês' },
  biol:    { bg: '#E1F8E7', text: '#15803D', dot: '#22C55E', label: 'BIOL — Biologia' },
  edf:     { bg: '#FDE8D4', text: '#C2410C', dot: '#F97316', label: 'EDF — Educação Física' },
  geo:     { bg: '#EBE1FD', text: '#6D28D9', dot: '#8B5CF6', label: 'GEO — Geografia' },
  hist:    { bg: '#F7E1FB', text: '#A21CAF', dot: '#D946EF', label: 'HIST — História' },
  mat:     { bg: '#FBF1CE', text: '#92620B', dot: '#EAB308', label: 'MAT — Matemática' },
  quim:    { bg: '#D6F3F8', text: '#0E7490', dot: '#06B6D4', label: 'QUIM — Química' },
  fis:     { bg: '#E3E3FD', text: '#4338CA', dot: '#6366F1', label: 'FIS — Física' },
};

const GC_TIPOS_AVISO = {
  reposicao: { label: 'Reposição', bg: '#DCE8FD', text: '#1E40AF', dot: '#3B82F6' },
  alteracao: { label: 'Alteração de Horário', bg: '#FDECC8', text: '#92400E', dot: '#F59E0B' },
  geral:     { label: 'Aviso Geral', bg: '#DCF5E3', text: '#15803D', dot: '#22C55E' },
};

// ---- Grade horária bruta (MTEC-2GT), com divisão por turma A/B onde existe ----
// "ambos" = mesma aula pra toda a turma (sem divisão A/B).
const GC_HORARIOS_BRUTOS = {
  'MTEC-2GT': {
    segunda: [
      { periodo: 1, inicio: '13:00', fim: '13:50', A: { materia: 'APS', professor: 'Alessandro', sala: 'LAB 06' }, B: { materia: 'PWEB II', professor: 'Nelson', sala: 'LAB 03' } },
      { periodo: 2, inicio: '13:50', fim: '14:40', A: { materia: 'APS', professor: 'Alessandro', sala: 'LAB 06' }, B: { materia: 'PWEB II', professor: 'Nelson', sala: 'LAB 03' } },
      { periodo: 3, inicio: '14:40', fim: '15:30', A: { materia: 'PWEB II', professor: 'Nelson', sala: 'SALA 72-4' }, B: { materia: 'BD1', professor: 'Maicon', sala: 'LAB 03' } },
      { intervalo: true, inicio: '15:30', fim: '15:50' },
      { periodo: 4, inicio: '15:50', fim: '16:40', A: { materia: 'PWEB II', professor: 'Nelson', sala: 'SALA 72-4' }, B: { materia: 'BD1', professor: 'Maicon', sala: 'LAB 03' } },
      { periodo: 5, inicio: '16:40', fim: '17:30', ambos: { materia: 'LPL', professor: 'Andrea', sala: '' } },
      { periodo: 6, inicio: '17:30', fim: '18:20', ambos: { materia: 'MAT', professor: 'Marly', sala: '' } },
    ],
    terca: [
      { periodo: 1, inicio: '13:00', fim: '13:50', A: { materia: 'PAM1', professor: 'Nelson', sala: 'LAB 02' }, B: { materia: 'SIS.EMB1', professor: 'Roberta', sala: 'SALA 72-4' } },
      { periodo: 2, inicio: '13:50', fim: '14:40', A: { materia: 'PAM1', professor: 'Nelson', sala: 'LAB 02' }, B: { materia: 'SIS.EMB1', professor: 'Roberta', sala: 'SALA 72-4' } },
      { periodo: 3, inicio: '14:40', fim: '15:30', A: { materia: 'SIS.EMB1', professor: 'Roberta', sala: 'LAB 70' }, B: { materia: 'PAM1', professor: 'Nelson', sala: 'LAB 03' } },
      { intervalo: true, inicio: '15:30', fim: '15:50' },
      { periodo: 4, inicio: '15:50', fim: '16:40', A: { materia: 'SIS.EMB1', professor: 'Roberta', sala: 'LAB 70' }, B: { materia: 'PAM1', professor: 'Nelson', sala: 'LAB 03' } },
      { periodo: 5, inicio: '16:40', fim: '17:30', ambos: { materia: 'MAT', professor: 'Marly', sala: '' } },
      { periodo: 6, inicio: '17:30', fim: '18:20', ambos: { materia: 'QUIM', professor: 'Karen', sala: '' } },
    ],
    quarta: [
      { periodo: 1, inicio: '13:00', fim: '13:50', ambos: { materia: 'LPL', professor: 'Andrea', sala: '' } },
      { periodo: 2, inicio: '13:50', fim: '14:40', ambos: { materia: 'EDF', professor: 'Paulo L.', sala: '' } },
      { periodo: 3, inicio: '14:40', fim: '15:30', ambos: { materia: 'GEO', professor: 'Luzia', sala: '' } },
      { intervalo: true, inicio: '15:30', fim: '15:50' },
      { periodo: 4, inicio: '15:50', fim: '16:40', A: { materia: 'DS', professor: 'Marcia', sala: 'LAB 01' }, B: { materia: 'DS', professor: 'Simone', sala: 'LAB 02' } },
      { periodo: 5, inicio: '16:40', fim: '17:30', A: { materia: 'DS', professor: 'Marcia', sala: 'LAB 01' }, B: { materia: 'DS', professor: 'Simone', sala: 'LAB 02' } },
      { periodo: 6, inicio: '17:30', fim: '18:20', A: { materia: 'DS', professor: 'Marcia', sala: 'LAB 01' }, B: { materia: 'DS', professor: 'Simone', sala: 'LAB 02' } },
    ],
    quinta: [
      { periodo: 1, inicio: '13:00', fim: '13:50', ambos: { materia: 'ING', professor: 'Canedo', sala: '' } },
      { periodo: 2, inicio: '13:50', fim: '14:40', ambos: { materia: 'BIOL', professor: 'Rosana', sala: '' } },
      { periodo: 3, inicio: '14:40', fim: '15:30', ambos: { materia: 'HIST', professor: 'David', sala: '' } },
      { intervalo: true, inicio: '15:30', fim: '15:50' },
      { periodo: 4, inicio: '15:50', fim: '16:40', ambos: { materia: 'EDF', professor: 'Paulo L.', sala: '' } },
      { periodo: 5, inicio: '16:40', fim: '17:30', ambos: { materia: 'QUIM', professor: 'Karen', sala: '' } },
      { periodo: 6, inicio: '17:30', fim: '18:20', ambos: { materia: 'FIS', professor: 'Damelio', sala: '' } },
    ],
    sexta: [
      { periodo: 1, inicio: '13:00', fim: '13:50', ambos: { materia: 'BIOL', professor: 'Rosana', sala: '' } },
      { periodo: 2, inicio: '13:50', fim: '14:40', ambos: { materia: 'GEO', professor: 'Luzia', sala: '' } },
      { periodo: 3, inicio: '14:40', fim: '15:30', A: { materia: 'BD1', professor: 'Maicon', sala: 'LAB 04' }, B: { materia: 'APS', professor: 'Alessandro', sala: 'LAB 70' } },
      { intervalo: true, inicio: '15:30', fim: '15:50' },
      { periodo: 4, inicio: '15:50', fim: '16:40', A: { materia: 'BD1', professor: 'Maicon', sala: 'LAB 04' }, B: { materia: 'APS', professor: 'Alessandro', sala: 'LAB 70' } },
      { periodo: 5, inicio: '16:40', fim: '17:30', ambos: { materia: 'ING', professor: 'Canedo', sala: '' } },
      { periodo: 6, inicio: '17:30', fim: '18:20', ambos: { materia: 'FIS', professor: 'Damelio', sala: '' } },
    ],
  },
};

function gcSeedIfNeeded() {
  if (!localStorage.getItem(GC_KEYS.AVISOS)) {
    const seedAvisos = [
      {
        id: 'seed-reposicao-1',
        tipo: 'reposicao',
        titulo: 'Reposição de APS Confirmada',
        materia: 'APS',
        professor: 'Alessandro',
        mensagem: 'A aula de APS que ocorreria na sexta-feira (10/11) foi reagendada para este sábado, 25/11, no LAB 04 às 13:00 com o Professor Alessandro.',
        original: { diaLabel: 'Sexta-feira', data: '10/11', hora: '13:00', sala: 'LAB 04' },
        novo: { diaLabel: 'Sábado', data: '25/11', hora: '13:00', sala: 'LAB 04' },
        turmaAlvo: 'MTEC-2GT',
        turmaGrupo: 'A',
        status: 'agendada',
        quandoLabel: 'Ontem às 15:30',
        criadoEm: new Date().toISOString(),
      },
      {
        id: 'seed-alteracao-1',
        tipo: 'alteracao',
        titulo: 'Mudança Temporária de Sala – BD1',
        mensagem: 'A aula de BD1 de amanhã será excepcionalmente realizada no LAB 03, e não no LAB 04 de costume. Prof. Maicon comunicará os detalhes.',
        turmaAlvo: 'MTEC-2GT',
        quandoLabel: 'Há 2 dias',
        criadoEm: new Date().toISOString(),
      },
      {
        id: 'seed-geral-1',
        tipo: 'geral',
        titulo: 'Conselho de Classe – Horário Reduzido',
        mensagem: 'Na próxima quarta-feira (22/11), as aulas terminarão às 16:00 devido ao conselho de classe bimestral. Prof. Nelson (PWEB II) e Profª. Roberta (SIS.EMB1) comunicarão os conteúdos abordados.',
        turmaAlvo: 'todos',
        quandoLabel: '14 Nov',
        criadoEm: new Date().toISOString(),
      },
    ];
    localStorage.setItem(GC_KEYS.AVISOS, JSON.stringify(seedAvisos));
  }

  if (!localStorage.getItem(GC_KEYS.HORARIOS)) {
    localStorage.setItem(GC_KEYS.HORARIOS, JSON.stringify(GC_HORARIOS_BRUTOS));
  }

  if (!localStorage.getItem(GC_KEYS.DISPONIBILIDADE)) {
    const seedDisponibilidade = {
      'alessandro@etec.sp.gov.br': {
        periodos: {
          'terca-2': true,
          'segunda-3': true, 'segunda-4': true, 'segunda-5': true, 'segunda-6': true,
          'segunda-7': true, 'segunda-8': true,
          'quinta-7': true, 'quinta-8': true,
          'sexta-7': true, 'sexta-8': true, 'sexta-9': true,
        },
        materias: [
          { nome: 'APS', ativa: true },
          { nome: 'GSO1', ativa: true },
          { nome: 'GSO2', ativa: true },
          { nome: 'BD1', ativa: true },
        ],
      },
    };
    localStorage.setItem(GC_KEYS.DISPONIBILIDADE, JSON.stringify(seedDisponibilidade));
  }
}

// ---- Avisos ----
function gcGetAvisos() {
  return JSON.parse(localStorage.getItem(GC_KEYS.AVISOS) || '[]');
}
function gcAddAviso(aviso) {
  const all = gcGetAvisos();
  aviso.id = 'a' + Date.now();
  aviso.criadoEm = new Date().toISOString();
  all.unshift(aviso);
  localStorage.setItem(GC_KEYS.AVISOS, JSON.stringify(all));
  return aviso;
}
function gcGetAvisosParaTurma(turma, grupo) {
  return gcGetAvisos().filter(a => {
    if (a.turmaAlvo === 'todos') return true;
    if (a.turmaAlvo !== turma) return false;
    if (a.turmaGrupo && grupo && a.turmaGrupo !== grupo) return false;
    return true;
  });
}
function gcAtualizarAviso(id, mudancas) {
  const all = gcGetAvisos();
  const idx = all.findIndex(a => a.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...mudancas };
  localStorage.setItem(GC_KEYS.AVISOS, JSON.stringify(all));
  return all[idx];
}
const GC_STATUS_REPOSICAO = {
  agendada: { label: 'Agendada', bg: '#E1EAFD', text: '#1E40AF' },
  realizada: { label: 'Realizada', bg: '#E1F8E7', text: '#15803D' },
};

// ---- Horários ----
// Resolve a grade bruta (com A/B) pra um grupo específico, dia por dia.
function gcGetHorarioResolvido(turma, grupo) {
  const bruto = JSON.parse(localStorage.getItem(GC_KEYS.HORARIOS) || '{}')[turma] || {};
  const resolvido = {};
  GC_DIAS_UTEIS.forEach(dia => {
    resolvido[dia] = (bruto[dia] || []).map(item => {
      if (item.intervalo) return { tipo: 'intervalo', inicio: item.inicio, fim: item.fim };
      const dados = item.ambos || item[grupo] || item.A;
      return {
        tipo: 'aula', periodo: item.periodo, inicio: item.inicio, fim: item.fim,
        materia: dados.materia, professor: dados.professor, sala: dados.sala,
        categoria: GC_MATERIA_CATEGORIA[dados.materia] || 'tecnica',
      };
    });
  });
  return resolvido;
}

// ---- Sessão (login simulado) ----
function gcGetSession() {
  return JSON.parse(localStorage.getItem(GC_KEYS.SESSION) || 'null');
}
function gcSetSession(session) {
  localStorage.setItem(GC_KEYS.SESSION, JSON.stringify(session));
}
function gcClearSession() {
  localStorage.removeItem(GC_KEYS.SESSION);
}

// ---- Utilidades de horário ----
function gcParseHora(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function gcHojeChaveDia() {
  return GC_DIAS_SEMANA[new Date().getDay()];
}
function gcMinutosAgora() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

// Formata a data de um aviso pra exibição. Avisos "seed" já trazem um
// quandoLabel fixo (pra bater com o mockup); avisos criados de verdade
// na demonstração calculam a partir de criadoEm.
const GC_MESES_CURTOS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
function gcFormatDataAviso(aviso) {
  if (aviso.quandoLabel) return aviso.quandoLabel;
  const criado = new Date(aviso.criadoEm);
  const agora = new Date();
  const diffDias = Math.floor((agora - criado) / 86400000);
  const hh = String(criado.getHours()).padStart(2, '0');
  const mm = String(criado.getMinutes()).padStart(2, '0');
  if (diffDias === 0) return 'Hoje às ' + hh + ':' + mm;
  if (diffDias === 1) return 'Ontem às ' + hh + ':' + mm;
  if (diffDias < 7) return 'Há ' + diffDias + ' dias';
  return criado.getDate() + ' ' + GC_MESES_CURTOS[criado.getMonth()].replace(/^./, c => c.toUpperCase());
}

// ---- Períodos do dia (usados na grade de disponibilidade do professor) ----
// Mesma duração de 50 min usada na grade dos alunos, estendida até a noite.
const GC_PERIODOS_DIA = [
  { periodo: 1, bloco: 'manha', inicio: '07:10', fim: '08:00' },
  { periodo: 2, bloco: 'manha', inicio: '08:00', fim: '08:50' },
  { periodo: 3, bloco: 'manha', inicio: '08:50', fim: '09:40' },
  { intervalo: true, inicio: '09:40', fim: '10:00' },
  { periodo: 4, bloco: 'manha', inicio: '10:00', fim: '10:50' },
  { periodo: 5, bloco: 'manha', inicio: '10:50', fim: '11:40' },
  { periodo: 6, bloco: 'manha', inicio: '11:40', fim: '12:30' },
  { periodo: 7, bloco: 'tarde', inicio: '13:00', fim: '13:50' },
  { periodo: 8, bloco: 'tarde', inicio: '13:50', fim: '14:40' },
  { periodo: 9, bloco: 'tarde', inicio: '14:40', fim: '15:30' },
  { intervalo: true, inicio: '15:30', fim: '15:50' },
  { periodo: 10, bloco: 'tarde', inicio: '15:50', fim: '16:40' },
  { periodo: 11, bloco: 'tarde', inicio: '16:40', fim: '17:30' },
  { periodo: 12, bloco: 'tarde', inicio: '17:30', fim: '18:20' },
  { periodo: 13, bloco: 'noite', inicio: '18:20', fim: '19:10' },
  { periodo: 14, bloco: 'noite', inicio: '19:10', fim: '20:00' },
  { periodo: 15, bloco: 'noite', inicio: '20:00', fim: '20:50' },
  { intervalo: true, inicio: '20:50', fim: '21:10' },
  { periodo: 16, bloco: 'noite', inicio: '21:10', fim: '22:00' },
];
const GC_BLOCOS_DIA = ['manha', 'tarde', 'noite'];
const GC_BLOCO_LABEL = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite' };

// ---- Disponibilidade do professor ----
function gcGetDisponibilidade(email) {
  const all = JSON.parse(localStorage.getItem(GC_KEYS.DISPONIBILIDADE) || '{}');
  return all[email] || { periodos: {}, materias: [] };
}
function gcSalvarDisponibilidade(email, dados) {
  const all = JSON.parse(localStorage.getItem(GC_KEYS.DISPONIBILIDADE) || '{}');
  all[email] = dados;
  localStorage.setItem(GC_KEYS.DISPONIBILIDADE, JSON.stringify(all));
}
// Resumo por bloco (manhã/tarde/noite) x dia — true se pelo menos 1 período do bloco está marcado.
function gcResumoDisponibilidade(email) {
  const dados = gcGetDisponibilidade(email);
  const resumo = {};
  GC_DIAS_UTEIS.forEach(dia => {
    resumo[dia] = { manha: false, tarde: false, noite: false };
    GC_PERIODOS_DIA.filter(p => !p.intervalo).forEach(p => {
      if (dados.periodos[dia + '-' + p.periodo]) resumo[dia][p.bloco] = true;
    });
  });
  return resumo;
}

// ---- Aulas de professores em turmas que ainda não têm grade própria completa ----
// (a gente só sabe o que o próprio professor informou, não a grade inteira dessas turmas)
const GC_AULAS_EXTRAS = [
  // Segunda
  { dia: 'segunda', periodo: 9, inicio: '14:40', fim: '15:30', professor: 'Alessandro', turma: '3HT-A', materia: 'SEG.DIG', sala: 'LAB 09' },
  { dia: 'segunda', periodo: 10, inicio: '15:50', fim: '16:40', professor: 'Alessandro', turma: '3HT-A', materia: 'SEG.DIG', sala: 'LAB 09' },
  { dia: 'segunda', periodo: 11, inicio: '16:40', fim: '17:30', professor: 'Alessandro', turma: '2HT-A', materia: 'GSO1', sala: 'LAB 06' },
  { dia: 'segunda', periodo: 12, inicio: '17:30', fim: '18:20', professor: 'Alessandro', turma: '2HT-A', materia: 'GSO1', sala: 'LAB 06' },
  // Quarta
  { dia: 'quarta', periodo: 7, inicio: '13:00', fim: '13:50', professor: 'Alessandro', turma: '1HT-B', materia: 'MDBD', sala: 'LAB 04' },
  { dia: 'quarta', periodo: 8, inicio: '13:50', fim: '14:40', professor: 'Alessandro', turma: '1HT-B', materia: 'MDBD', sala: 'LAB 04' },
  { dia: 'quarta', periodo: 9, inicio: '14:40', fim: '15:30', professor: 'Alessandro', turma: '1HT-B', materia: 'MDBD', sala: 'LAB 04' },
  { dia: 'quarta', periodo: 10, inicio: '15:50', fim: '16:40', professor: 'Alessandro', turma: '3GT-B', materia: 'PDTCC-INF', sala: 'LAB 05' },
  { dia: 'quarta', periodo: 11, inicio: '16:40', fim: '17:30', professor: 'Alessandro', turma: '3GT-B', materia: 'PDTCC-INF', sala: 'LAB 05' },
  { dia: 'quarta', periodo: 12, inicio: '17:30', fim: '18:20', professor: 'Alessandro', turma: '3GT-B', materia: 'PDTCC-INF', sala: 'LAB 05' },
  // Quinta
  { dia: 'quinta', periodo: 8, inicio: '13:50', fim: '14:40', professor: 'Alessandro', turma: '3HT-B', materia: 'SD', sala: 'SALA 72-2' },
  { dia: 'quinta', periodo: 9, inicio: '14:40', fim: '15:30', professor: 'Alessandro', turma: '3HT-B', materia: 'SD', sala: 'SALA 72-2' },
  { dia: 'quinta', periodo: 10, inicio: '15:50', fim: '16:40', professor: 'Alessandro', turma: '1HT-A', materia: 'MDBD', sala: 'LAB 04' },
  { dia: 'quinta', periodo: 11, inicio: '16:40', fim: '17:30', professor: 'Alessandro', turma: '1HT-A', materia: 'MDBD', sala: 'LAB 04' },
  { dia: 'quinta', periodo: 12, inicio: '17:30', fim: '18:20', professor: 'Alessandro', turma: '1HT-A', materia: 'MDBD', sala: 'LAB 04' },
  { dia: 'quinta', periodo: 16, inicio: '21:10', fim: '22:00', professor: 'Alessandro', turma: '1SN-A', materia: 'PTIC', sala: 'LAB 02' },
  // Sexta
  { dia: 'sexta', periodo: 7, inicio: '13:00', fim: '13:50', professor: 'Alessandro', turma: '2HT-B', materia: 'GSO1', sala: 'LAB 05' },
  { dia: 'sexta', periodo: 8, inicio: '13:50', fim: '14:40', professor: 'Alessandro', turma: '2HT-B', materia: 'GSO1', sala: 'LAB 05' },
  { dia: 'sexta', periodo: 11, inicio: '16:40', fim: '17:30', professor: 'Alessandro', turma: '3HT-A', materia: 'CNMS', sala: 'LAB 07' },
  { dia: 'sexta', periodo: 12, inicio: '17:30', fim: '18:20', professor: 'Alessandro', turma: '3HT-A', materia: 'CNMS', sala: 'LAB 07' },
];

// Lista "crua" (não mesclada), período a período — combina as turmas totalmente
// modeladas (GC_HORARIOS_BRUTOS) com as atribuições extras acima.
function gcGetAulasProfessorBruto(nomeProfessor) {
  const resultado = [];
  Object.keys(GC_HORARIOS_BRUTOS).forEach(turmaCodigo => {
    const grade = GC_HORARIOS_BRUTOS[turmaCodigo];
    GC_DIAS_UTEIS.forEach(dia => {
      (grade[dia] || []).forEach(item => {
        if (item.intervalo) return;
        ['ambos', 'A', 'B'].forEach(chave => {
          const dados = item[chave];
          if (!dados || dados.professor !== nomeProfessor) return;
          if (chave !== 'ambos' && item.ambos) return;
          resultado.push({
            turmaLabel: turmaCodigo.replace('MTEC-', '') + (chave === 'ambos' ? '' : '-' + chave),
            materia: dados.materia, sala: dados.sala, dia, periodo: item.periodo, inicio: item.inicio, fim: item.fim,
          });
        });
      });
    });
  });
  GC_AULAS_EXTRAS.filter(a => a.professor === nomeProfessor).forEach(a => {
    resultado.push({ turmaLabel: a.turma, materia: a.materia, sala: a.sala, dia: a.dia, periodo: a.periodo, inicio: a.inicio, fim: a.fim });
  });
  resultado.sort((a, b) => GC_DIAS_UTEIS.indexOf(a.dia) - GC_DIAS_UTEIS.indexOf(b.dia) || a.periodo - b.periodo);
  return resultado;
}

// Mapa dia-periodo -> aula, pra desenhar a grade completa (Minhas Aulas / Buscar Professor).
function gcGetOcupacaoProfessor(nomeProfessor) {
  const mapa = {};
  gcGetAulasProfessorBruto(nomeProfessor).forEach(r => { mapa[r.dia + '-' + r.periodo] = r; });
  return mapa;
}

// Lista de todos os professores que aparecem em algum lugar da grade.
function gcGetListaProfessores() {
  const nomes = new Set();
  Object.keys(GC_HORARIOS_BRUTOS).forEach(turmaCodigo => {
    const grade = GC_HORARIOS_BRUTOS[turmaCodigo];
    GC_DIAS_UTEIS.forEach(dia => {
      (grade[dia] || []).forEach(item => {
        if (item.intervalo) return;
        ['ambos', 'A', 'B'].forEach(chave => { if (item[chave]) nomes.add(item[chave].professor); });
      });
    });
  });
  GC_AULAS_EXTRAS.forEach(a => nomes.add(a.professor));
  return Array.from(nomes).sort();
}

// ---- Aulas atribuídas a um professor (procura em todas as turmas/grupos) ----
function gcGetAulasProfessor(nomeProfessor) {
  const brutos = gcGetAulasProfessorBruto(nomeProfessor);

  brutos.sort((a, b) => GC_DIAS_UTEIS.indexOf(a.dia) - GC_DIAS_UTEIS.indexOf(b.dia) || a.periodo - b.periodo);

  // Combina períodos consecutivos (mesma turma/matéria/dia, sem intervalo entre eles) num só card.
  const mesclados = [];
  brutos.forEach(r => {
    const anterior = mesclados[mesclados.length - 1];
    if (anterior && anterior.dia === r.dia && anterior.turmaLabel === r.turmaLabel &&
        anterior.materia === r.materia && anterior.fim === r.inicio) {
      anterior.fim = r.fim;
    } else {
      mesclados.push({ ...r });
    }
  });
  return mesclados;
}

// ---- Carga horária (calculada a partir da grade real do professor) ----
// Nº de horas contratadas por semana — dado de RH, não vem da grade.
const GC_HORAS_CONTRATADAS = { 'alessandro@etec.sp.gov.br': 20 };
function gcGetHorasContratadas(email) {
  return GC_HORAS_CONTRATADAS[email] || 20;
}

function gcFormatMinutos(min) {
  const h = Math.floor(min / 60), m = min % 60;
  if (h > 0 && m > 0) return h + 'h' + m;
  if (h > 0) return h + 'h';
  return m + 'min';
}

function gcGetCargaHoraria(nomeProfessor) {
  const aulas = gcGetAulasProfessor(nomeProfessor);
  const porDia = {};
  GC_DIAS_UTEIS.forEach(d => { porDia[d] = 0; });
  const porTurmaMateria = {};
  let totalMinutos = 0;

  aulas.forEach(a => {
    const minutos = gcParseHora(a.fim) - gcParseHora(a.inicio);
    porDia[a.dia] += minutos;
    totalMinutos += minutos;
    const chave = a.turmaLabel + '|' + a.materia;
    if (!porTurmaMateria[chave]) {
      porTurmaMateria[chave] = { turma: a.turmaLabel, materia: a.materia, minutos: 0, dias: [] };
    }
    porTurmaMateria[chave].minutos += minutos;
    if (!porTurmaMateria[chave].dias.includes(a.dia)) porTurmaMateria[chave].dias.push(a.dia);
  });

  return { porDia, totalMinutos, detalhes: Object.values(porTurmaMateria) };
}

// ---- Solicitações do professor para a coordenação ----
// (falta, troca de horário, etc.) — a coordenação ainda vai ganhar uma tela pra ler isso.
function gcGetSolicitacoes() {
  return JSON.parse(localStorage.getItem(GC_KEYS.SOLICITACOES) || '[]');
}
function gcGetSolicitacoesProfessor(email) {
  return gcGetSolicitacoes().filter(s => s.professorEmail === email);
}
function gcAddSolicitacao(solicitacao) {
  const all = gcGetSolicitacoes();
  solicitacao.id = 's' + Date.now();
  solicitacao.status = 'pendente';
  solicitacao.criadoEm = new Date().toISOString();
  all.unshift(solicitacao);
  localStorage.setItem(GC_KEYS.SOLICITACOES, JSON.stringify(all));
  return solicitacao;
}
const GC_TIPO_SOLICITACAO = {
  falta: 'Justificar Falta',
  troca_horario: 'Solicitar Troca de Horário',
  outro: 'Outro',
};
const GC_STATUS_SOLICITACAO = {
  pendente: { label: 'Pendente', bg: '#FDF0DA', text: '#9A5B0A' },
  aprovada: { label: 'Aprovada', bg: '#E1F8E7', text: '#15803D' },
  recusada: { label: 'Recusada', bg: '#FDECEA', text: '#C0392B' },
};
