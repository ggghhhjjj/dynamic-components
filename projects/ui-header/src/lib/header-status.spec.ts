import {
  HeaderStatusController,
  formatDefaultDate,
  getTopTransient,
  resolveStatusDisplay,
} from './header-status';

describe('formatDefaultDate', () => {
  it('formats as dd.MM without year', () => {
    expect(formatDefaultDate(new Date(2026, 6, 9))).toBe('09.07');
    expect(formatDefaultDate(new Date(2026, 7, 8))).toBe('08.08');
  });
});

describe('getTopTransient', () => {
  it('returns null for empty stack', () => {
    expect(getTopTransient([])).toBeNull();
  });

  it('returns most recent when priorities are equal', () => {
    const stack = [
      { id: 'a', text: 'First' },
      { id: 'b', text: 'Second' },
    ];
    expect(getTopTransient(stack)?.id).toBe('b');
  });

  it('returns highest priority over recency', () => {
    const stack = [
      { id: 'a', text: 'Old', priority: 10 },
      { id: 'b', text: 'Recent', priority: 1 },
    ];
    expect(getTopTransient(stack)?.id).toBe('a');
  });
});

describe('resolveStatusDisplay', () => {
  const defaultDate = '20.08';

  it('shows default date when nothing is locked', () => {
    expect(resolveStatusDisplay(null, [], defaultDate)).toEqual({
      text: defaultDate,
      spinner: false,
      showSeparator: false,
    });
  });

  it('shows base lock when no transients', () => {
    expect(resolveStatusDisplay({ id: 'tab', text: 'Sopharma' }, [], defaultDate)).toEqual({
      text: 'Sopharma',
      spinner: false,
      showSeparator: false,
    });
  });

  it('shows transient in replace mode', () => {
    expect(
      resolveStatusDisplay(
        { id: 'tab', text: 'Sopharma' },
        [{ id: 'net', text: 'Live', spinner: true }],
        defaultDate,
      ),
    ).toEqual({
      text: 'Live',
      spinner: true,
      showSeparator: false,
    });
  });

  it('shows transient in append mode with base prefix', () => {
    expect(
      resolveStatusDisplay(
        { id: 'tab', text: '09.07' },
        [{ id: 'net', text: 'Sync', spinner: true, mode: 'append' }],
        defaultDate,
      ),
    ).toEqual({
      prefixText: '09.07',
      text: 'Sync',
      spinner: true,
      showSeparator: true,
    });
  });

  it('uses default date as prefix in append mode when base is absent', () => {
    expect(
      resolveStatusDisplay(null, [{ id: 'net', text: 'Live', mode: 'append' }], defaultDate),
    ).toEqual({
      prefixText: defaultDate,
      text: 'Live',
      spinner: false,
      showSeparator: true,
    });
  });
});

describe('HeaderStatusController', () => {
  it('locks and unlocks base status by owner id', () => {
    const controller = new HeaderStatusController();
    controller.lockStatus({ id: 'tab:a', text: 'Tab A' });
    expect(controller.getBase()?.text).toBe('Tab A');

    controller.unlockStatus('tab:b');
    expect(controller.getBase()?.text).toBe('Tab A');

    controller.unlockStatus('tab:a');
    expect(controller.getBase()).toBeNull();
  });

  it('replaces transient by id', () => {
    const controller = new HeaderStatusController();
    controller.pushTransient({ id: 'net', text: 'Loading' });
    controller.pushTransient({ id: 'net', text: 'Live' });
    expect(controller.getTransients()).toHaveLength(1);
    expect(controller.getTransients()[0].text).toBe('Live');
  });

  it('removes transient by id', () => {
    const controller = new HeaderStatusController();
    controller.pushTransient({ id: 'a', text: 'A' });
    controller.pushTransient({ id: 'b', text: 'B' });
    controller.removeTransient('a');
    expect(controller.getTransients().map((item) => item.id)).toEqual(['b']);
  });

  it('auto-removes transient after ttl', async () => {
    vi.useFakeTimers();
    const changes: number[] = [];
    const controller = new HeaderStatusController(() => changes.push(changes.length));

    controller.pushTransient({ id: 'toast', text: 'Saved', ttlMs: 1000 });
    expect(controller.getTransients()).toHaveLength(1);

    vi.advanceTimersByTime(1000);
    expect(controller.getTransients()).toHaveLength(0);
    expect(changes.length).toBeGreaterThan(0);

    vi.useRealTimers();
  });
});
