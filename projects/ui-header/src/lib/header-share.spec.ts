import {
  buildHeaderSharePayload,
  isShareAbortError,
  resolveShareUrl,
  runDefaultShare,
} from './header-share';

describe('resolveShareUrl', () => {
  it('returns explicit url when provided', () => {
    expect(resolveShareUrl('https://example.com/page')).toBe('https://example.com/page');
  });

  it('trims explicit url', () => {
    expect(resolveShareUrl('  https://example.com  ')).toBe('https://example.com');
  });

  it('falls back to window.location.href in browser', () => {
    expect(resolveShareUrl('')).toBe(window.location.href);
  });
});

describe('buildHeaderSharePayload', () => {
  it('builds payload from inputs', () => {
    expect(
      buildHeaderSharePayload({
        url: 'https://app.test/view',
        title: 'My App',
        text: 'Check this out',
      }),
    ).toEqual({
      url: 'https://app.test/view',
      title: 'My App',
      text: 'Check this out',
    });
  });
});

describe('isShareAbortError', () => {
  it('detects AbortError', () => {
    expect(isShareAbortError({ name: 'AbortError' })).toBe(true);
    expect(isShareAbortError(new Error('fail'))).toBe(false);
  });
});

describe('runDefaultShare', () => {
  it('returns none when url is empty', async () => {
    expect(await runDefaultShare({ url: '', title: '', text: '' })).toBe('none');
  });
});
