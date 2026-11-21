# API de Locação de Equipamentos

API REST para gerenciamento de usuários autenticados, equipamentos, locações e devoluções de equipamentos usados em obras de construção de rodovias.

O contrato da API está documentado em `resources/swagger.json` e é exposto pela aplicação em `/api-docs`.

## Tecnologias

* Node.js
* Express
* JWT para autenticação Bearer
* Swagger UI para documentação da API
* Mocha, Chai e Supertest para testes automatizados de API
* Cypress para testes end-to-end da aplicação web
* Mochawesome para relatório HTML dos testes
* k6 para testes de performance
* GitHub Actions para CI

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie a API:

```bash
npm start
```

Para desenvolvimento com reload automático:

```bash
npm run dev
```

A API roda por padrão em:

```text
http://localhost:3000
```

## Documentação Swagger

Com a API em execução, acesse:

```text
http://localhost:3000/api-docs
```

O contrato OpenAPI também pode ser consultado em:

```text
http://localhost:3000/swagger.json
```

Arquivo-fonte do contrato:

```text
resources/swagger.json
```

## Endpoints

| Fluxo | Método | Endpoint | Autenticação | Descrição |
|---|---:|---|---|---|
| Health | GET | `/api/health` | Não | Verifica disponibilidade da API |
| Auth | POST | `/api/auth/register` | Não | Registra usuário |
| Auth | POST | `/api/auth/login` | Não | Realiza login e retorna token JWT |
| Equipamentos | GET | `/api/equipment` | Sim | Lista equipamentos |
| Equipamentos | POST | `/api/equipment` | Sim | Cadastra equipamento |
| Equipamentos | GET | `/api/equipment/{id}` | Sim | Consulta equipamento por ID |
| Equipamentos | PUT | `/api/equipment/{id}` | Sim | Altera equipamento |
| Equipamentos | DELETE | `/api/equipment/{id}` | Sim | Exclui equipamento |
| Equipamentos | GET | `/api/equipment/{id}/status` | Sim | Consulta status do equipamento |
| Locações | GET | `/api/rentals` | Sim | Lista locações |
| Locações | POST | `/api/rentals` | Sim | Registra locação |
| Devoluções | GET | `/api/rentals/returns` | Sim | Lista devoluções |
| Devoluções | POST | `/api/rentals/returns` | Sim | Registra devolução |

## Regras de Negócio

* Usuários podem se cadastrar e autenticar para receber um token JWT.
* Endpoints de equipamentos, locações e devoluções exigem autenticação Bearer.
* Equipamentos possuem status `available` ou `rented`.
* Locações possuem status `active` ou `returned`.
* Um equipamento indisponível não pode receber nova locação.
* Um equipamento com locação ativa não pode ser excluído.
* Uma locação já devolvida não pode receber nova devolução.
* Ao criar uma locação válida, o equipamento passa para `rented`.
* Ao registrar uma devolução válida, a locação passa para `returned` e o equipamento volta para `available`.

## Estrutura do Projeto

```text
resources/
  swagger.json                  Contrato OpenAPI

src/
  app.js                        Configuração do Express, Swagger e rotas
  server.js                     Inicialização da API
  routes/                       Definição das rotas
  controllers/                  Entrada das requisições HTTP
  service/                      Regras de negócio
  model/                        Persistência em memória
  middleware/                   Autenticação e tratamento de erros
  utils/                        Utilitários de senha e erro HTTP

test/
  api/
    controllers/                Testes automatizados por controller
    fixtures/                   Massas e partições de teste
    helpers/                    Helpers de autenticação, requests e asserts
    utils/                      Dados dinâmicos
  performance/
    api.performance.test.js     Teste de performance com k6
    fixtures/                   Massa usada no fluxo k6
    helpers/                    Helper de autenticação para k6
  web/
    auth/login.cy.js            Testes web de autenticação
    equipment/equipment.cy.js   Testes web de equipamentos
    rentals/rentals.cy.js       Testes web de locações e devoluções
    support/                    Comandos reutilizáveis do Cypress

cypress.config.js               Configuração do Cypress

.github/
  workflows/
    automated-tests.yml         Pipeline de CI
```

## Testes Automatizados de API

A suíte de API usa Mocha, Chai e Supertest. Os testes estão organizados por controller e aplicam cenários funcionais, negativos e de regra de negócio.

Arquivos principais:

* `test/api/controllers/health.controller.test.js`
* `test/api/controllers/auth.controller.test.js`
* `test/api/controllers/equipment.controller.test.js`
* `test/api/controllers/rentals.controller.test.js`

Cobertura funcional dos testes:

| Arquivo | Escopo |
|---|---|
| `health.controller.test.js` | Saúde da API e comportamento com parâmetros extras |
| `auth.controller.test.js` | Cadastro, login, campos obrigatórios, duplicidade e credenciais inválidas |
| `equipment.controller.test.js` | Cadastro, listagem, consulta, alteração, exclusão, status e autorização |
| `rentals.controller.test.js` | Criação de locação, equipamento indisponível, listagem, devolução e devolução duplicada |

Os testes usam:

* padrão AAA: Arrange, Act, Assert;
* helpers para autenticação e chamadas HTTP;
* fixtures com partições de equivalência;
* reset da base em memória antes dos cenários;
* validações padronizadas de sucesso e erro.

Execute a suíte:

```bash
npm test
```

Execute com relatório Mochawesome:

```bash
npm run test:report
```

Relatório gerado em:

```text
mochawesome-report/
```

## Testes Automatizados Web

A aplicação web é validada com Cypress por meio de interações reais no navegador. Os testes usam seletores exclusivos `data-cy`, evitando dependência de texto, classes CSS ou posição dos elementos na tela.

Cobertura atual:

| Arquivo | Escopo |
|---|---|
| `test/web/auth/login.cy.js` | Login, cadastro, logout, campos obrigatórios, e-mail inválido, senha curta, duplicidade e credenciais inválidas |
| `test/web/equipment/equipment.cy.js` | Listagem, busca, obrigatoriedade, cadastro e valor diário inválido (zero, negativo ou não numérico) |
| `test/web/rentals/rentals.cy.js` | Listagem, datas obrigatórias, equipamento indisponível, locação, devolução, campos obrigatórios e data de devolução inválida |

Pré-requisito: a API deve estar em execução em `http://localhost:3000`.

```bash
npm start
```

Execute todos os testes web em modo headless:

```bash
npm run test:web
```

Para acompanhar os testes pelo aplicativo do Cypress:

```bash
npm run test:web:open
```

Para gerar o relatório HTML Mochawesome consolidado:

```bash
npm run test:web:report
```

O relatório web é separado do relatório de API e fica em:

```text
mochawesome-report/web/index.html
```

## Testes VADER

O planejamento exploratório de testes da API foi estruturado com a heurística VADER:

* Verbs: métodos HTTP permitidos e não permitidos por endpoint.
* Authorization: token ausente, inválido, expirado ou malformado.
* Data: campos obrigatórios, tipos inválidos, payloads fora do contrato e partições de equivalência.
* Errors: status codes, mensagens de erro e ausência de exposição de detalhes internos.
* Responsiveness: tempo de resposta, chamadas repetidas, concorrência e consistência sob carga.

Principais riscos considerados:

* conflitos de datas em locações e devoluções;
* tentativa de cadastrar equipamentos sem autenticação;
* envio de string em campo numérico e número em campo textual;
* payloads com campos extras ou faltantes em relação ao Swagger;
* tentativa de excluir equipamento com locação ativa;
* dupla locação do mesmo equipamento;
* devolução duplicada;
* entradas maliciosas em campos textuais e parâmetros de rota.

## Testes de Performance

Os testes de performance usam k6 e executam um fluxo principal da API:

1. Health check.
2. Cadastro e consulta de equipamento.
3. Criação de locação.
4. Consulta de status alugado.
5. Registro de devolução.
6. Consulta de status disponível.
7. Listagem de equipamentos, locações e devoluções.

Execute:

```bash
npm run test:performance
```

Execute exportando resumo JSON:

```bash
npm run test:performance:report
```

Execute com dashboard HTML:

```bash
npm run test:performance:dashboard
```

Thresholds configurados:

* `http_req_duration`: p95 menor que 500 ms.
* `http_req_failed`: taxa menor que 0.0001.
* `erros_funcionais`: taxa menor que 0.0001.

## CI - GitHub Actions

O workflow está em:

```text
.github/workflows/automated-tests.yml
```

O pipeline roda em `push` e `pull_request`.

Jobs configurados:

| Job | Objetivo |
|---|---|
| `api-tests` | Instala dependências, executa `npm run test:report` e publica o relatório Mochawesome |
| `web-tests` | Inicia a API, executa `npm run test:web:report` e publica o relatório Cypress/Mochawesome |
| `performance-tests` | Instala dependências, configura k6, inicia a API, executa performance e publica relatórios |

Artefatos publicados:

* `api-mochawesome-report`
* `cypress-web-mochawesome-report`
* `web-tests-api-log`
* `k6-performance-report`
* `api-log`

## Códigos de Resposta

| Status | Uso |
|---:|---|
| 200 | Consulta ou login realizado com sucesso |
| 201 | Criação de usuário, equipamento, locação ou devolução |
| 204 | Exclusão de equipamento sem corpo de resposta |
| 400 | Payload inválido ou campos obrigatórios ausentes |
| 401 | Token ausente, inválido, expirado ou credenciais inválidas |
| 404 | Equipamento ou locação não encontrada |
| 409 | Conflito de negócio, como e-mail duplicado, equipamento indisponível ou devolução duplicada |

## Observações Técnicas

* A persistência atual é em memória, implementada nos models do diretório `src/model`.
* O token JWT expira em 1 hora.
* O segredo JWT usa `JWT_SECRET` quando definido; caso contrário, usa um valor padrão local.
* O middleware global de erro retorna respostas no formato:

```json
{
  "error": {
    "message": "Mensagem do erro",
    "details": null
  }
}
```

## Scripts

| Script | Comando |
|---|---|
| Iniciar API | `npm start` |
| Desenvolvimento | `npm run dev` |
| Testes de API | `npm test` |
| Testes com relatório | `npm run test:report` |
| Testes Web com Cypress | `npm run test:web` |
| Testes Web interativos | `npm run test:web:open` |
| Testes Web com relatório | `npm run test:web:report` |
| Performance | `npm run test:performance` |
| Performance com resumo | `npm run test:performance:report` |
| Performance com dashboard | `npm run test:performance:dashboard` |
