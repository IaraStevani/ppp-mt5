export const locacaoValida = {
  corpoRequisicao: {
    startDate: '2026-08-05',
    expectedReturnDate: '2026-08-12',
  },
  corpoResposta: {
    status: 'active',
  },
};

export const devolucaoValida = {
  corpoRequisicao: {
    returnDate: '2026-08-10',
    condition: 'bom',
    notes: 'Sem avarias',
  },
};

export function payloadLocacao(equipmentId, sobrescritas = {}) {
  return {
    equipmentId,
    ...locacaoValida.corpoRequisicao,
    ...sobrescritas,
  };
}

export function payloadDevolucao(rentalId, sobrescritas = {}) {
  return {
    rentalId,
    ...devolucaoValida.corpoRequisicao,
    ...sobrescritas,
  };
}

export const particoesLocacao = [
  {
    descricao: 'partição válida: equipamento existente e disponível com datas válidas',
    corpoRequisicao: ({ equipamento }) => payloadLocacao(equipamento.id),
    statusEsperado: 201,
    corpoResposta: { sucesso: true, status: 'active' },
  },
  {
    descricao: 'partição inválida: equipmentId ausente',
    corpoRequisicao: () => ({
      startDate: locacaoValida.corpoRequisicao.startDate,
      expectedReturnDate: locacaoValida.corpoRequisicao.expectedReturnDate,
    }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'equipmentId, startDate e expectedReturnDate sao obrigatorios' },
  },
  {
    descricao: 'partição inválida: equipmentId inexistente',
    corpoRequisicao: () => payloadLocacao(9999),
    statusEsperado: 404,
    corpoResposta: { mensagem: 'Equipamento nao encontrado' },
  },
  {
    descricao: 'partição inválida: startDate não parseável',
    corpoRequisicao: ({ equipamento }) => payloadLocacao(equipamento.id, { startDate: 'data-invalida' }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'startDate deve ser uma data valida' },
  },
  {
    descricao: 'partição inválida: expectedReturnDate não parseável',
    corpoRequisicao: ({ equipamento }) => payloadLocacao(equipamento.id, { expectedReturnDate: 'data-invalida' }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'expectedReturnDate deve ser uma data valida' },
  },
];

export const particoesDevolucao = [
  {
    descricao: 'partição válida: locação ativa com data e condição válidas',
    corpoRequisicao: ({ locacao }) => payloadDevolucao(locacao.id),
    statusEsperado: 201,
    corpoResposta: { sucesso: true },
  },
  {
    descricao: 'partição inválida: rentalId ausente',
    corpoRequisicao: () => ({
      returnDate: devolucaoValida.corpoRequisicao.returnDate,
      condition: devolucaoValida.corpoRequisicao.condition,
    }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'rentalId, returnDate e condition sao obrigatorios' },
  },
  {
    descricao: 'partição inválida: rentalId inexistente',
    corpoRequisicao: () => payloadDevolucao(9999),
    statusEsperado: 404,
    corpoResposta: { mensagem: 'Locacao nao encontrada' },
  },
  {
    descricao: 'partição inválida: returnDate não parseável',
    corpoRequisicao: ({ locacao }) => payloadDevolucao(locacao.id, { returnDate: 'data-invalida' }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'returnDate deve ser uma data valida' },
  },
  {
    descricao: 'partição inválida: condition ausente',
    corpoRequisicao: ({ locacao }) => {
      const { condition: _condition, ...payload } = payloadDevolucao(locacao.id);
      return payload;
    },
    statusEsperado: 400,
    corpoResposta: { mensagem: 'rentalId, returnDate e condition sao obrigatorios' },
  },
];
