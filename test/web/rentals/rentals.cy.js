describe('Fluxo web de locações', () => {
  const newUser = () => ({
    name: 'Pessoa Locação',
    email: `rental.${Date.now()}-${Cypress._.random(1000, 9999)}@locapro.test`,
    password: 'Senha123',
  });

  const createEquipmentInTheWeb = (name) => {
    cy.getByCy('nav-equipment').click();
    cy.getByCy('add-equipment').click();
    cy.getByCy('equipment-name-input').type(name);
    cy.getByCy('equipment-type-input').type('Compactação');
    cy.getByCy('equipment-daily-rate-input').type('650');
    cy.getByCy('equipment-submit').click();
    cy.getByCy('toast').should('have.text', 'Equipamento cadastrado com sucesso.');
  };

  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.visit('/');
    cy.registerWeb(newUser());
    cy.getByCy('nav-rentals').click();
    cy.getByCy('rentals-table').should('be.visible');
  });

  it('exibe as locações existentes na tabela', () => {
    cy.getByCy('rental-row').should('have.length.at.least', 1);
    cy.getByCy('rental-status').should('contain.text', 'ATIVA');
  });

  it('exige as datas ao criar uma locação', () => {
    cy.getByCy('new-rental').click();
    cy.getByCy('rental-submit').click();

    ['rental-start-date', 'rental-expected-return-date'].forEach((selector) => {
      cy.getByCy(selector).then(($input) => {
        expect($input[0].validity.valueMissing).to.eq(true);
      });
    });
  });

  it('exige data e condição ao registrar uma devolução', () => {
    cy.getByCy('return-button').first().click();
    cy.getByCy('return-submit').click();
    cy.getByCy('return-date').then(($date) => {
      expect($date[0].validity.valueMissing).to.eq(true);
    });

    cy.getByCy('return-date').type('2026-11-24');
    cy.getByCy('return-submit').click();
    cy.getByCy('return-condition').then(($condition) => {
      expect($condition[0].validity.valueMissing).to.eq(true);
    });
  });

  it('cria uma locação e conclui a devolução pela interface', () => {
    const equipmentName = `Equipamento locação ${Date.now()}`;
    createEquipmentInTheWeb(equipmentName);

    cy.getByCy('nav-rentals').click();
    cy.getByCy('new-rental').click();
    cy.getByCy('rental-equipment').select(equipmentName);
    cy.getByCy('rental-start-date').type('2026-11-21');
    cy.getByCy('rental-expected-return-date').type('2026-11-28');
    cy.getByCy('rental-submit').click();

    cy.getByCy('toast').should('have.text', 'Locação registrada com sucesso.');
    cy.getByCy('rental-row').first().within(() => {
      cy.getByCy('rental-equipment-name').should('have.text', equipmentName);
      cy.getByCy('rental-status').should('have.text', 'ATIVA');
    });

    cy.getByCy('new-rental').click();
    cy.getByCy('rental-equipment').find('option').should('not.contain.text', equipmentName);
    cy.getByCy('modal-cancel').click();

    cy.getByCy('rental-row').first().within(() => {
      cy.getByCy('return-button').click();
    });

    cy.getByCy('return-date').type('2026-11-20');
    cy.getByCy('return-condition').type('Ótimo estado');
    cy.getByCy('return-submit').click();
    cy.getByCy('toast').should('have.text', 'A devolução não pode ser anterior ao início da locação.');
    cy.getByCy('equipment-modal').should('be.visible');

    cy.getByCy('return-date').clear().type('2026-11-24');
    cy.getByCy('return-notes').type('Devolução validada pelo Cypress.');
    cy.getByCy('return-submit').click();

    cy.getByCy('toast').should('have.text', 'Devolução registrada com sucesso.');
    cy.getByCy('rental-row').first().within(() => {
      cy.getByCy('rental-status').should('have.text', 'DEVOLVIDA');
      cy.getByCy('return-button').should('not.exist');
    });

    cy.getByCy('nav-returns').click();
    cy.getByCy('return-card').first().within(() => {
      cy.getByCy('return-equipment-name').should('have.text', equipmentName);
      cy.contains('Ótimo estado').should('be.visible');
    });
  });
});
