export interface HeaderSharePayload {
  title: string;
  text: string;
  url: string;
}

export interface HeaderShareEvent {
  payload: HeaderSharePayload;
  preventDefault: () => void;
}

export function resolveShareUrl(explicitUrl: string): string {
  if (explicitUrl.trim()) {
    return explicitUrl.trim();
  }

  if (typeof window !== 'undefined' && window.location?.href) {
    return window.location.href;
  }

  return '';
}

export function buildHeaderSharePayload(options: {
  url?: string;
  title?: string;
  text?: string;
}): HeaderSharePayload {
  const url = resolveShareUrl(options.url ?? '');
  return {
    url,
    title: options.title?.trim() ?? '',
    text: options.text?.trim() ?? '',
  };
}

export function isShareAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
  );
}

/** Browser default: Web Share API, then clipboard copy of the URL. */
export async function runDefaultShare(payload: HeaderSharePayload): Promise<'shared' | 'copied' | 'none'> {
  if (!payload.url) {
    return 'none';
  }

  const shareData: ShareData = { url: payload.url };
  if (payload.title) {
    shareData.title = payload.title;
  }
  if (payload.text) {
    shareData.text = payload.text;
  }

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share(shareData);
      return 'shared';
    }
  } catch (error) {
    if (isShareAbortError(error)) {
      return 'none';
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload.url);
      return 'copied';
    }
  } catch {
    return 'none';
  }

  return 'none';
}
