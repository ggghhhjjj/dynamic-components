export interface HeaderTab {
  id: string;
  label: string;
}

export interface HeaderMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface HeaderLanguage {
  code: string;
  label?: string;
}

export interface HeaderStatusItem {
  id: string;
  text: string;
  spinner?: boolean;
  mode?: 'replace' | 'append';
  ttlMs?: number;
  priority?: number;
}

export interface ResolvedStatusDisplay {
  text: string;
  prefixText?: string;
  spinner: boolean;
  showSeparator: boolean;
}

/** Format current date as dd.MM (no year, not locale-dependent). */
export function formatDefaultDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

/** Pick the transient item to display (highest priority, then most recent). */
export function getTopTransient(transients: HeaderStatusItem[]): HeaderStatusItem | null {
  if (transients.length === 0) {
    return null;
  }

  let maxPriority = Number.NEGATIVE_INFINITY;
  for (const item of transients) {
    maxPriority = Math.max(maxPriority, item.priority ?? 0);
  }

  for (let index = transients.length - 1; index >= 0; index -= 1) {
    if ((transients[index].priority ?? 0) === maxPriority) {
      return transients[index];
    }
  }

  return transients[transients.length - 1];
}

export function resolveStatusDisplay(
  base: HeaderStatusItem | null,
  transients: HeaderStatusItem[],
  defaultDate: string,
): ResolvedStatusDisplay {
  const top = getTopTransient(transients);

  if (top) {
    if (top.mode === 'append') {
      return {
        prefixText: base?.text ?? defaultDate,
        text: top.text,
        spinner: top.spinner ?? false,
        showSeparator: true,
      };
    }

    return {
      text: top.text,
      spinner: top.spinner ?? false,
      showSeparator: false,
    };
  }

  if (base) {
    return {
      text: base.text,
      spinner: base.spinner ?? false,
      showSeparator: false,
    };
  }

  return {
    text: defaultDate,
    spinner: false,
    showSeparator: false,
  };
}

export class HeaderStatusController {
  private base: HeaderStatusItem | null = null;
  private readonly transients: HeaderStatusItem[] = [];
  private readonly ttlTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(private readonly onChange?: () => void) {}

  lockStatus(item: HeaderStatusItem): void {
    this.base = { ...item };
    this.notify();
  }

  unlockStatus(id: string): void {
    if (this.base?.id === id) {
      this.base = null;
      this.notify();
    }
  }

  getBase(): HeaderStatusItem | null {
    return this.base ? { ...this.base } : null;
  }

  pushTransient(item: HeaderStatusItem): void {
    const existingIndex = this.transients.findIndex((entry) => entry.id === item.id);
    if (existingIndex >= 0) {
      this.clearTtl(item.id);
      this.transients[existingIndex] = { ...item };
    } else {
      this.transients.push({ ...item });
    }

    if (item.ttlMs != null && item.ttlMs > 0) {
      this.scheduleTtl(item.id, item.ttlMs);
    }

    this.notify();
  }

  removeTransient(id: string): void {
    this.clearTtl(id);
    const index = this.transients.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      this.transients.splice(index, 1);
      this.notify();
    }
  }

  clearTransients(): void {
    for (const id of this.ttlTimers.keys()) {
      this.clearTtl(id);
    }
    if (this.transients.length > 0) {
      this.transients.length = 0;
      this.notify();
    }
  }

  getTransients(): HeaderStatusItem[] {
    return this.transients.map((entry) => ({ ...entry }));
  }

  private scheduleTtl(id: string, ttlMs: number): void {
    this.clearTtl(id);
    this.ttlTimers.set(
      id,
      setTimeout(() => {
        this.removeTransient(id);
      }, ttlMs),
    );
  }

  private clearTtl(id: string): void {
    const timer = this.ttlTimers.get(id);
    if (timer != null) {
      clearTimeout(timer);
      this.ttlTimers.delete(id);
    }
  }

  private notify(): void {
    this.onChange?.();
  }
}
