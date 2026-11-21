// Tracker: earned-trophy state persisted in browser localStorage, with export/import.
export const STORAGE_KEY = 'gta6-trophy-tracker-v1';

export class Tracker {
  constructor() {
    this.earned = new Set();
  }
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.earned = new Set(JSON.parse(raw));
    } catch (_) { /* ignore corrupt storage */ }
  }
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.earned]));
  }
  has(name) {
    return this.earned.has(name);
  }
  toggle(name) {
    if (this.earned.has(name)) this.earned.delete(name);
    else this.earned.add(name);
    this.save();
  }
  count() {
    return this.earned.size;
  }
  exportJson() {
    return JSON.stringify([...this.earned]);
  }
  importJson(json) {
    this.earned = new Set(JSON.parse(json));
    this.save();
  }
}
