const webTestSelectors = () => {
  document.querySelector('.nav-item[data-view="equipment"]')?.setAttribute('data-cy', 'nav-equipment');
  document.querySelector('.nav-item[data-view="rentals"]')?.setAttribute('data-cy', 'nav-rentals');
  document.querySelector('.nav-item[data-view="returns"]')?.setAttribute('data-cy', 'nav-returns');
  document.querySelector('#add-equipment')?.setAttribute('data-cy', 'add-equipment');
  document.querySelector('#equipment-search')?.setAttribute('data-cy', 'equipment-search');
  document.querySelector('#equipment-grid')?.setAttribute('data-cy', 'equipment-grid');
  document.querySelector('#new-rental')?.setAttribute('data-cy', 'new-rental');
  document.querySelector('#rentals-table')?.setAttribute('data-cy', 'rentals-table');
  document.querySelector('#returns-list')?.setAttribute('data-cy', 'returns-list');
  document.querySelector('#toast')?.setAttribute('data-cy', 'toast');
  document.querySelector('#modal')?.setAttribute('data-cy', 'equipment-modal');
  const modalCancel = document.querySelector('#modal button[value="cancel"]');
  modalCancel?.setAttribute('data-cy', 'modal-cancel');
  if (modalCancel) modalCancel.formNoValidate = true;

  document.querySelectorAll('#equipment-grid .equipment-card').forEach((card) => {
    card.setAttribute('data-cy', 'equipment-card');
    card.querySelector('h3')?.setAttribute('data-cy', 'equipment-name');
    card.querySelector('.badge')?.setAttribute('data-cy', 'equipment-status');
  });

  const modal = document.querySelector('#modal');
  if (modal?.dataset.mode === 'equipment') {
    modal.querySelector('#modal-submit')?.setAttribute('data-cy', 'equipment-submit');
    modal.querySelector('[name="name"]')?.setAttribute('data-cy', 'equipment-name-input');
    modal.querySelector('[name="type"]')?.setAttribute('data-cy', 'equipment-type-input');
    modal.querySelector('[name="dailyRate"]')?.setAttribute('data-cy', 'equipment-daily-rate-input');
  }
  if (modal?.dataset.mode === 'rental') {
    modal.querySelector('#modal-submit')?.setAttribute('data-cy', 'rental-submit');
    modal.querySelector('[name="equipmentId"]')?.setAttribute('data-cy', 'rental-equipment');
    modal.querySelector('[name="startDate"]')?.setAttribute('data-cy', 'rental-start-date');
    modal.querySelector('[name="expectedReturnDate"]')?.setAttribute('data-cy', 'rental-expected-return-date');
  }
  if (modal?.dataset.mode === 'return') {
    modal.querySelector('#modal-submit')?.setAttribute('data-cy', 'return-submit');
    modal.querySelector('[name="returnDate"]')?.setAttribute('data-cy', 'return-date');
    modal.querySelector('[name="condition"]')?.setAttribute('data-cy', 'return-condition');
    modal.querySelector('[name="notes"]')?.setAttribute('data-cy', 'return-notes');
  }

  document.querySelectorAll('#rentals-table tr').forEach((row) => {
    row.setAttribute('data-cy', 'rental-row');
    row.querySelector('strong')?.setAttribute('data-cy', 'rental-equipment-name');
    row.querySelector('.badge')?.setAttribute('data-cy', 'rental-status');
    row.querySelector('.return-button')?.setAttribute('data-cy', 'return-button');
  });

  document.querySelectorAll('#returns-list .return-card').forEach((card) => {
    card.setAttribute('data-cy', 'return-card');
    card.querySelector('strong')?.setAttribute('data-cy', 'return-equipment-name');
  });
};

webTestSelectors();
new MutationObserver(webTestSelectors).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'open', 'data-mode'] });
