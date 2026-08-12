let sequencial = 1;

export function gerarEmailUnico(prefixo = 'teste') {
  const valor = sequencial;
  sequencial += 1;
  return `${prefixo}.${Date.now()}.${valor}@email.com`;
}
