export function createMarker(position, name, type) {
  return {
    id: Date.now(),
    type: type,
    name: name,
    notes: '',
    position: position,
  }
}