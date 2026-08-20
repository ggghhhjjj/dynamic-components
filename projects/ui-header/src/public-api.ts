export { UiHeader } from './lib/ui-header';
export type {
  HeaderLanguage,
  HeaderMenuItem,
  HeaderStatusItem,
  HeaderTab,
  HeaderTheme,
  HeaderShareEvent,
  HeaderSharePayload,
} from './lib/ui-header';
export {
  HeaderStatusController,
  formatDefaultDate,
  getTopTransient,
  resolveStatusDisplay,
} from './lib/header-status';
export type { ResolvedStatusDisplay } from './lib/header-status';
export {
  buildHeaderSharePayload,
  isShareAbortError,
  resolveShareUrl,
  runDefaultShare,
} from './lib/header-share';
