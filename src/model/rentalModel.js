import { database, nextId } from './database.js';

export function createRental(rental) {
  const now = new Date().toISOString();
  const newRental = {
    id: nextId('rentals'),
    userId: rental.userId,
    equipmentId: Number(rental.equipmentId),
    startDate: rental.startDate,
    expectedReturnDate: rental.expectedReturnDate,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  database.rentals.push(newRental);
  return newRental;
}

export function listRentals() {
  return database.rentals;
}

export function findRentalById(id) {
  return database.rentals.find((rental) => rental.id === Number(id));
}

export function findActiveRentalByEquipmentId(equipmentId) {
  return database.rentals.find(
    (rental) => rental.equipmentId === Number(equipmentId) && rental.status === 'active',
  );
}

export function closeRental(id) {
  const rental = findRentalById(id);

  if (!rental) {
    return null;
  }

  rental.status = 'returned';
  rental.updatedAt = new Date().toISOString();
  return rental;
}
