import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import {
  HeaderLanguage,
  HeaderMenuItem,
  HeaderStatusController,
  HeaderStatusItem,
  HeaderTab,
  ResolvedStatusDisplay,
  formatDefaultDate,
  resolveStatusDisplay,
} from './header-status';
import {
  HeaderShareEvent,
  buildHeaderSharePayload,
  runDefaultShare,
} from './header-share';

export type { HeaderLanguage, HeaderMenuItem, HeaderStatusItem, HeaderTab };
export type { HeaderShareEvent, HeaderSharePayload } from './header-share';

export type HeaderTheme = 'light' | 'dark' | 'system';

@Component({
  selector: 'ui-header',
  standalone: true,
  imports: [],
  templateUrl: './ui-header.html',
  styleUrl: './ui-header.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class UiHeader implements AfterViewInit, OnDestroy {
  @Input() tabs: HeaderTab[] = [];
  @Input() selectedTabId = '';
  @Input() menuItems: HeaderMenuItem[] = [];
  @Input() languages: HeaderLanguage[] = [];
  @Input() activeLanguage = '';
  @Input() theme: HeaderTheme = 'system';
  @Input() menuLabel = 'Menu';
  @Input() languageLabel = 'Language';
  @Input() shareLabel = 'Share';
  @Input() shareCopiedLabel = 'Copied';
  /** Share URL. Empty uses window.location.href when available (browser/PWA). */
  @Input() shareUrl = '';
  @Input() shareTitle = '';
  @Input() shareText = '';
  /** When false, only emits share — client handles Cordova/Electron/custom flows. */
  @Input() autoShare = true;
  @Input() statusLabel = 'Status';
  /** Optional one-way override for Storybook / trivial hosts. */
  @Input() statusOverride = '';

  @Output() tabSelect = new EventEmitter<string>();
  @Output() menuSelect = new EventEmitter<string>();
  @Output() languageSelect = new EventEmitter<string>();
  @Output() share = new EventEmitter<HeaderShareEvent>();

  @HostBinding('attr.data-theme')
  get dataTheme(): string | null {
    return this.theme === 'system' ? null : this.theme;
  }

  @ViewChild('tabStrip') private tabStripRef?: ElementRef<HTMLElement>;
  @ViewChildren('tabButton') private tabButtons?: QueryList<ElementRef<HTMLButtonElement>>;

  protected readonly menuOpen = signal(false);
  protected readonly langOpen = signal(false);
  protected readonly shareCopied = signal(false);
  protected readonly overflowStart = signal(false);
  protected readonly overflowEnd = signal(false);

  private readonly statusController = new HeaderStatusController(() => this.bumpStatus());
  private readonly defaultDate = signal(formatDefaultDate());
  private readonly statusRevision = signal(0);
  private readonly resolvedStatus = computed(() => {
    this.statusRevision();
    const defaultDate = this.defaultDate();
    return resolveStatusDisplay(
      this.statusController.getBase(),
      this.statusController.getTransients(),
      defaultDate,
    );
  });

  private midnightTimer?: ReturnType<typeof setTimeout>;
  private shareCopiedTimer?: ReturnType<typeof setTimeout>;
  private resizeObserver?: ResizeObserver;
  private stripScrollListener?: () => void;

  protected readonly statusDisplay = computed((): ResolvedStatusDisplay => {
    if (this.statusOverride) {
      return {
        text: this.statusOverride,
        spinner: false,
        showSeparator: false,
      };
    }
    return this.resolvedStatus();
  });

  ngAfterViewInit(): void {
    this.scheduleMidnightTick();
    this.setupTabStripObserver();
  }

  ngOnDestroy(): void {
    if (this.midnightTimer != null) {
      clearTimeout(this.midnightTimer);
    }
    if (this.shareCopiedTimer != null) {
      clearTimeout(this.shareCopiedTimer);
    }
    this.resizeObserver?.disconnect();
    const strip = this.tabStripRef?.nativeElement;
    if (strip && this.stripScrollListener) {
      strip.removeEventListener('scroll', this.stripScrollListener);
    }
  }

  lockStatus(item: HeaderStatusItem): void {
    this.statusController.lockStatus(item);
  }

  unlockStatus(id: string): void {
    this.statusController.unlockStatus(id);
  }

  pushTransient(item: HeaderStatusItem): void {
    this.statusController.pushTransient(item);
  }

  removeTransient(id: string): void {
    this.statusController.removeTransient(id);
  }

  clearTransients(): void {
    this.statusController.clearTransients();
  }

  protected toggleMenu(event: Event): void {
    event.stopPropagation();
    this.closeLang();
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toggleLang(event: Event): void {
    event.stopPropagation();
    this.closeMenu();
    this.langOpen.update((open) => !open);
  }

  protected closeLang(): void {
    this.langOpen.set(false);
  }

  protected activeLanguageDisplay(): string {
    const active = this.languages.find((lang) => lang.code === this.activeLanguage);
    return active?.code ?? this.activeLanguage ?? this.languages[0]?.code ?? '';
  }

  protected onMenuItemClick(id: string): void {
    this.closeMenu();
    this.menuSelect.emit(id);
  }

  protected onLanguageItemClick(code: string): void {
    this.closeLang();
    if (code !== this.activeLanguage) {
      this.languageSelect.emit(code);
    }
  }

  protected async onShareClick(): Promise<void> {
    this.closeMenu();
    this.closeLang();

    const payload = buildHeaderSharePayload({
      url: this.shareUrl,
      title: this.shareTitle,
      text: this.shareText,
    });

    let defaultPrevented = false;
    const event: HeaderShareEvent = {
      payload,
      preventDefault: () => {
        defaultPrevented = true;
      },
    };

    this.share.emit(event);

    if (!this.autoShare || defaultPrevented) {
      return;
    }

    const result = await runDefaultShare(payload);
    if (result === 'copied') {
      this.showShareCopiedFeedback();
    }
  }

  protected onTabClick(id: string): void {
    if (id !== this.selectedTabId) {
      this.tabSelect.emit(id);
    }
  }

  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const tabs = this.tabs;
    if (tabs.length === 0) {
      return;
    }

    let nextIndex = index;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
      event.preventDefault();
    } else if (event.key === 'Home') {
      nextIndex = 0;
      event.preventDefault();
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
      event.preventDefault();
    } else {
      return;
    }

    const buttons = this.tabButtons?.toArray();
    const nextButton = buttons?.[nextIndex]?.nativeElement;
    nextButton?.focus();
    nextButton?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }

  protected onTabWheel(event: WheelEvent): void {
    const strip = this.tabStripRef?.nativeElement;
    if (!strip) {
      return;
    }

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (delta === 0) {
      return;
    }

    const canScrollLeft = strip.scrollLeft > 0;
    const canScrollRight = strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1;
    const scrollingLeft = delta < 0;
    const scrollingRight = delta > 0;

    if ((scrollingLeft && canScrollLeft) || (scrollingRight && canScrollRight)) {
      event.preventDefault();
      strip.scrollLeft += delta;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
    this.closeLang();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
    this.closeLang();
  }

  private bumpStatus(): void {
    this.statusRevision.update((value) => value + 1);
  }

  private showShareCopiedFeedback(): void {
    this.shareCopied.set(true);
    if (this.shareCopiedTimer != null) {
      clearTimeout(this.shareCopiedTimer);
    }
    this.shareCopiedTimer = setTimeout(() => {
      this.shareCopied.set(false);
    }, 2000);
  }

  private scheduleMidnightTick(): void {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    this.midnightTimer = setTimeout(() => {
      this.defaultDate.set(formatDefaultDate());
      this.bumpStatus();
      this.scheduleMidnightTick();
    }, msUntilMidnight);
  }

  private setupTabStripObserver(): void {
    const strip = this.tabStripRef?.nativeElement;
    if (!strip) {
      return;
    }

    this.updateOverflowState();
    this.stripScrollListener = () => this.updateOverflowState();
    strip.addEventListener('scroll', this.stripScrollListener, { passive: true });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateOverflowState());
      this.resizeObserver.observe(strip);
    }
  }

  private updateOverflowState(): void {
    const strip = this.tabStripRef?.nativeElement;
    if (!strip) {
      return;
    }

    const hasOverflow = strip.scrollWidth > strip.clientWidth + 1;
    this.overflowStart.set(hasOverflow && strip.scrollLeft > 1);
    this.overflowEnd.set(
      hasOverflow && strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1,
    );
  }
}
