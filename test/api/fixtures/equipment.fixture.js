export const equipamentoValido = {
  corpoRequisicao: {
    name: 'Escavadeira hidráulica',
    type: 'terraplenagem',
    description: 'Escavadeira para corte e carregamento de solo',
    dailyRate: 1200,
  },
  corpoResposta: {
    status: 'available',
  },
};

export function payloadEquipamento(sobrescritas = {}) {
  return {
    ...equipamentoValido.corpoRequisicao,
    ...sobrescritas,
  };
}

export const particoesCadastroEquipamento = [
  {
    descricao: 'partição válida: campos obrigatórios preenchidos e dailyRate maior que zero',
    corpoRequisicao: () => payloadEquipamento({ dailyRate: 0.01 }),
    statusEsperado: 201,
    corpoResposta: { sucesso: true, dailyRate: 0.01 },
  },
  {
    descricao: 'partição inválida: nome ausente',
    corpoRequisicao: () => {
      const { name: _name, ...payload } = payloadEquipamento();
      return payload;
    },
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Campos obrigatorios ausentes' },
  },
  {
    descricao: 'partição inválida: tipo ausente',
    corpoRequisicao: () => {
      const { type: _type, ...payload } = payloadEquipamento();
      return payload;
    },
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Campos obrigatorios ausentes' },
  },
  {
    descricao: 'partição inválida: dailyRate ausente',
    corpoRequisicao: () => {
      const { dailyRate: _dailyRate, ...payload } = payloadEquipamento();
      return payload;
    },
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Campos obrigatorios ausentes' },
  },
  {
    descricao: 'partição inválida: dailyRate igual a zero',
    corpoRequisicao: () => payloadEquipamento({ dailyRate: 0 }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Valor diario deve ser maior que zero' },
  },
  {
    descricao: 'partição inválida: dailyRate menor que zero',
    corpoRequisicao: () => payloadEquipamento({ dailyRate: -1 }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Valor diario deve ser maior que zero' },
  },
  {
    descricao: 'partição inválida: dailyRate não numérico',
    corpoRequisicao: () => payloadEquipamento({ dailyRate: 'abc' }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Valor diario deve ser maior que zero' },
  },
];

export const particoesIdEquipamento = [
  {
    descricao: 'partição válida: ID existente',
    id: ({ equipamento }) => equipamento.id,
    statusEsperado: 200,
  },
  {
    descricao: 'partição inválida: ID inexistente',
    id: () => 9999,
    statusEsperado: 404,
    corpoResposta: { mensagem: 'Equipamento nao encontrado' },
  },
  {
    descricao: 'partição inválida: ID não numérico',
    id: () => 'abc',
    statusEsperado: 404,
    corpoResposta: { mensagem: 'Equipamento nao encontrado' },
  },
];
