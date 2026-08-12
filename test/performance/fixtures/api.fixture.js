export const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';

export const usuario = {
  name: 'Usuário Performance',
  email: __ENV.PERF_EMAIL || 'teste@email.com',
  password: __ENV.PERF_PASSWORD || '123456',
};

export function equipamento(indice) {
  return {
    name: `Escavadeira performance ${indice}`,
    type: 'terraplenagem',
    description: 'Equipamento criado pelo teste de performance',
    dailyRate: 1200,
  };
}

export function locacao(equipmentId) {
  return {
    equipmentId,
    startDate: '2026-08-05',
    expectedReturnDate: '2026-08-12',
  };
}

export function devolucao(rentalId) {
  return {
    rentalId,
    returnDate: '2026-08-10',
    condition: 'bom',
    notes: 'Sem avarias',
  };
}
