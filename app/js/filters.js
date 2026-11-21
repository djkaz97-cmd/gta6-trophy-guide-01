// Filters: kind filter + spoiler setting.
export const KINDS = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

export class Filters {
  constructor() {
    this.kind = 'all';
    this.spoiler = false;
  }
  setKind(kind) { this.kind = kind; }
  setSpoiler(value) { this.spoiler = !!value; }
  matches(trophy) {
    if (this.kind !== 'all' && trophy.kind !== this.kind) return false;
    return true;
  }
}
