export function saveSettings(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadSettings(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
