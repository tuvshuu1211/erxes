// Move in list
export function moveInList(array, startIndex, endIndex) {
  const [removedItem] = array.splice(startIndex, 1);
  array.splice(endIndex, 0, removedItem);

  return array;
}

// Remove from list
export function removeFromList(array, index) {
  const [removedItem] = array.splice(index, 1);
  return { sourceArray: array, removedItem };
}

// Add to list
export function addToList(array, index, item) {
  array.splice(index, 0, item);
  return array;
}