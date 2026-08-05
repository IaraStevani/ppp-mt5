import { database, nextId } from './database.js';

export function createEquipment(equipment) {
  const now = new Date().toISOString();
  const newEquipment = {
    id: nextId('equipment'),
    name: equipment.name,
    type: equipment.type,
    description: equipment.description || null,
    dailyRate: Number(equipment.dailyRate),
    status: 'available',
    createdAt: now,
    updatedAt: now,
  };

  database.equipment.push(newEquipment);
  return newEquipment;
}

export function listEquipment() {
  return database.equipment;
}

export function findEquipmentById(id) {
  return database.equipment.find((equipment) => equipment.id === Number(id));
}

export function updateEquipment(id, changes) {
  const equipment = findEquipmentById(id);

  if (!equipment) {
    return null;
  }

  Object.assign(equipment, {
    ...changes,
    dailyRate: changes.dailyRate === undefined ? equipment.dailyRate : Number(changes.dailyRate),
    updatedAt: new Date().toISOString(),
  });

  return equipment;
}

export function deleteEquipment(id) {
  const index = database.equipment.findIndex((equipment) => equipment.id === Number(id));

  if (index === -1) {
    return false;
  }

  database.equipment.splice(index, 1);
  return true;
}
