export const database = {
  users: [],
  equipment: [],
  rentals: [],
  returns: [],
};

const counters = {
  users: 1,
  equipment: 1,
  rentals: 1,
  returns: 1,
};

export function nextId(collectionName) {
  const id = counters[collectionName];
  counters[collectionName] += 1;
  return id;
}
