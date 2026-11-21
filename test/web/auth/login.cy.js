describe('Autenticação web', () => {
  const newUser = () => ({
    name: 'Pessoa Teste',
    email: `login.${Date.now()}-${Cypress._.random(1000, 9999)}@locapro.test`,
    password: 'Senha123',
  });

  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.visit('/');
  });

  it('exibe a tela de login ao acessar a aplicação sem sessão', () => {
    cy.getByCy('auth-screen').should('be.visible');
    cy.getByCy('login-form').should('be.visible');
    cy.getByCy('register-form').should('not.be.visible');
  });

  it('exige o preenchimento de e-mail e senha antes de enviar o login', () => {
    cy.getByCy('login-submit').click();
    cy.getByCy('login-email').then(($email) => {
      expect($email[0].validity.valueMissing).to.eq(true);
    });

    cy.getByCy('login-email').type('pessoa@locapro.test');
    cy.getByCy('login-submit').click();
    cy.getByCy('login-password').then(($password) => {
      expect($password[0].validity.valueMissing).to.eq(true);
    });
  });

  it('impede o envio quando o e-mail possui formato inválido', () => {
    cy.getByCy('login-email').type('email-invalido');
    cy.getByCy('login-password').type('Senha123', { log: false });
    cy.getByCy('login-submit').click();

    cy.getByCy('login-email').then(($email) => {
      expect($email[0].validity.typeMismatch).to.eq(true);
    });
  });

  it('informa erro e mantém o usuário na tela de login para credenciais inválidas', () => {
    cy.loginWeb({ email: 'inexistente@locapro.test', password: 'SenhaInvalida123' });

    cy.getByCy('auth-error').should('have.text', 'Credenciais invalidas');
    cy.getByCy('auth-screen').should('be.visible');
  });

  it('impede o cadastro de conta com senha menor que seis caracteres', () => {
    const user = newUser();
    cy.getByCy('show-register').click();
    cy.getByCy('register-name').type('Pessoa Senha Curta');
    cy.getByCy('register-email').type(user.email);
    cy.getByCy('register-password').type('12345', { log: false });
    cy.getByCy('register-submit').click();

    cy.getByCy('register-password').then(($password) => {
      expect($password[0].validity.customError).to.eq(true);
    });
    cy.getByCy('auth-error').should('have.text', 'A senha deve possuir ao menos seis caracteres.');
    cy.getByCy('auth-screen').should('be.visible');
  });

  it('informa erro ao tentar cadastrar um e-mail já utilizado', () => {
    const user = newUser();

    cy.getByCy('show-register').click();
    cy.getByCy('register-name').type(user.name);
    cy.getByCy('register-email').type(user.email);
    cy.getByCy('register-password').type(user.password, { log: false });
    cy.getByCy('register-submit').click();
    cy.getByCy('logout').click();

    cy.getByCy('show-register').click();
    cy.getByCy('register-name').type(user.name);
    cy.getByCy('register-email').type(user.email);
    cy.getByCy('register-password').type(user.password, { log: false });
    cy.getByCy('register-submit').click();

    cy.getByCy('auth-error').should('have.text', 'Email ja cadastrado');
    cy.getByCy('auth-screen').should('be.visible');
  });

  it('permite criar uma conta e acessar o dashboard', () => {
    const user = newUser();

    cy.getByCy('show-register').click();
    cy.getByCy('register-name').type(user.name);
    cy.getByCy('register-email').type(user.email);
    cy.getByCy('register-password').type(user.password, { log: false });
    cy.getByCy('register-submit').click();

    cy.getByCy('auth-screen').should('not.be.visible');
    cy.getByCy('page-title').should('have.text', 'Visão geral');
    cy.getByCy('profile-email').should('have.text', user.email);
  });

  it('permite fazer logout e login com uma conta existente', () => {
    const user = newUser();

    cy.createUserViaApi(user);
    cy.loginWeb(user);
    cy.getByCy('auth-screen').should('not.be.visible');

    cy.getByCy('logout').click();
    cy.getByCy('auth-screen').should('be.visible');

    cy.loginWeb(user);
    cy.getByCy('auth-screen').should('not.be.visible');
    cy.getByCy('profile-email').should('have.text', user.email);
  });
});
