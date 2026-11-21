Cypress.Commands.add('getByCy', (selector) => cy.get(`[data-cy="${selector}"]`));

Cypress.Commands.add('createUserViaApi', (user) =>
  cy.request('POST', '/api/auth/register', user).its('body').then(({ user: createdUser }) => createdUser),
);

Cypress.Commands.add('loginWeb', ({ email, password }) => {
  cy.getByCy('login-email').type(email);
  cy.getByCy('login-password').type(password, { log: false });
  cy.getByCy('login-submit').click();
});

Cypress.Commands.add('registerWeb', ({ name, email, password }) => {
  cy.getByCy('show-register').click();
  cy.getByCy('register-name').type(name);
  cy.getByCy('register-email').type(email);
  cy.getByCy('register-password').type(password, { log: false });
  cy.getByCy('register-submit').click();
  cy.getByCy('auth-screen').should('not.be.visible');
});
