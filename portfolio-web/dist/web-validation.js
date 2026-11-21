function showWebValidationError(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function parseBrazilianDate(value) {
  const months = { jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5, jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11 };
  const match = value.match(/(\d{2}) de (\w{3})\.?(?: de)? (\d{4})/i);
  return match ? new Date(Number(match[3]), months[match[2].toLowerCase()], Number(match[1])) : null;
}

document.addEventListener('submit', (event) => {
  if (event.target.id === 'register-form') {
    const password = event.target.elements.password;
    if (password.value.length < 6) {
      event.preventDefault();
      event.stopImmediatePropagation();
      password.setCustomValidity('A senha deve possuir ao menos seis caracteres.');
      password.reportValidity();
      document.querySelector('#auth-error').textContent = 'A senha deve possuir ao menos seis caracteres.';
    }
    return;
  }

  const modal = document.querySelector('#modal');
  if (event.target.id !== 'modal-form' || !modal?.open) return;

  if (modal.dataset.mode === 'equipment') {
    const dailyRate = modal.querySelector('[name="dailyRate"]');
    const value = Number(dailyRate.value);
    if (!dailyRate.value || Number.isNaN(value) || value <= 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
      dailyRate.setCustomValidity('Informe um valor diário maior que zero.');
      dailyRate.reportValidity();
      showWebValidationError('Valor da diária deve ser maior que zero.');
    }
  }

  if (modal.dataset.mode === 'return') {
    const returnDate = modal.querySelector('[name="returnDate"]');
    const rentalId = modal.dataset.rentalId;
    const rentalRow = [...document.querySelectorAll('#rentals-table tr')].find((row) => row.textContent.includes(`Contrato #${rentalId}`));
    const startDate = rentalRow ? parseBrazilianDate(rentalRow.querySelectorAll('td')[1]?.textContent.trim() ?? '') : null;
    if (startDate && new Date(`${returnDate.value}T12:00:00`) < startDate) {
      event.preventDefault();
      event.stopImmediatePropagation();
      returnDate.setCustomValidity('A devolução não pode ser anterior ao início da locação.');
      returnDate.reportValidity();
      showWebValidationError('A devolução não pode ser anterior ao início da locação.');
    }
  }
}, true);

document.addEventListener('input', (event) => event.target.setCustomValidity?.(''));
