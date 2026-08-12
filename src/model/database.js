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

export function resetDatabase() {
  Object.keys(database).forEach((collectionName) => {
    database[collectionName] = [];
  });

  Object.keys(counters).forEach((collectionName) => {
    counters[collectionName] = 1;
  });
}
