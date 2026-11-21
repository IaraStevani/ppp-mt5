describe('Gestão web de equipamentos', () => {
  const newUser = () => ({
    name: 'Pessoa Equipamento',
    email: `equipment.${Date.now()}-${Cypress._.random(1000, 9999)}@locapro.test`,
    password: 'Senha123',
  });

  const openEquipmentPage = () => {
    cy.getByCy('nav-equipment').click();
    cy.getByCy('equipment-grid').should('be.visible');
  };

  const openNewEquipmentForm = () => {
    cy.getByCy('add-equipment').click();
    cy.getByCy('equipment-modal').should('be.visible');
  };

  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.visit('/');
    cy.registerWeb(newUser());
    openEquipmentPage();
  });

  it('lista os equipamentos disponíveis para gestão', () => {
    cy.getByCy('equipment-card').should('have.length.at.least', 1);
    cy.getByCy('equipment-status').should('contain.text', 'DISPONÍVEL');
  });

  it('filtra equipamentos pelo campo de busca', () => {
    cy.getByCy('equipment-search').type('Gerador 150 kVA');

    cy.getByCy('equipment-card').should('have.length', 1);
    cy.getByCy('equipment-card').find('[data-cy="equipment-name"]').should('have.text', 'Gerador 150 kVA');
  });

  it('exige nome, tipo e valor da diária no cadastro', () => {
    openNewEquipmentForm();
    cy.getByCy('equipment-submit').click();

    ['equipment-name-input', 'equipment-type-input', 'equipment-daily-rate-input'].forEach((selector) => {
      cy.getByCy(selector).then(($input) => {
        expect($input[0].validity.valueMissing).to.eq(true);
      });
    });
  });

  ['0', '-10'].forEach((dailyRate) => {
    it(`impede o cadastro com valor diário inválido: ${dailyRate}`, () => {
      openNewEquipmentForm();
      cy.getByCy('equipment-name-input').type('Equipamento com diária inválida');
      cy.getByCy('equipment-type-input').type('Compactação');
      cy.getByCy('equipment-daily-rate-input').type(dailyRate);
      cy.getByCy('equipment-submit').click();

      cy.getByCy('toast').should('have.text', 'Valor da diária deve ser maior que zero.');
      cy.getByCy('equipment-modal').should('be.visible');
    });
  });

  it('não aceita valor diário não numérico', () => {
    openNewEquipmentForm();
    cy.getByCy('equipment-daily-rate-input').then(($input) => {
      $input.val('texto').trigger('input');
    });
    cy.getByCy('equipment-submit').click();

    cy.getByCy('equipment-daily-rate-input').then(($input) => {
      expect($input[0].validity.valid).to.eq(false);
    });
  });

  it('cadastra um equipamento e o apresenta como disponível na lista', () => {
    const equipmentName = `Compactador de teste ${Date.now()}`;
    openNewEquipmentForm();

    cy.getByCy('equipment-name-input').type(equipmentName);
    cy.getByCy('equipment-type-input').type('Compactação');
    cy.getByCy('equipment-daily-rate-input').type('750');
    cy.getByCy('equipment-submit').click();

    cy.getByCy('toast').should('have.text', 'Equipamento cadastrado com sucesso.');
    cy.getByCy('equipment-search').type(equipmentName);
    cy.getByCy('equipment-card').should('have.length', 1);
    cy.getByCy('equipment-name').should('have.text', equipmentName);
    cy.getByCy('equipment-status').should('have.text', 'DISPONÍVEL');
  });
});
