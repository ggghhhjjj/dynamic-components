import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiHeader } from './ui-header';
import { formatDefaultDate } from './header-status';

describe('UiHeader', () => {
  let component: UiHeader;
  let fixture: ComponentFixture<UiHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(UiHeader);
    component = fixture.componentInstance;
    component.tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'portfolio', label: 'Portfolio' },
    ];
    component.selectedTabId = 'overview';
    component.menuItems = [{ id: 'refresh', label: 'Refresh' }];
    component.languages = [
      { code: 'BG', label: 'BG' },
      { code: 'EN', label: 'EN' },
    ];
    component.activeLanguage = 'BG';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show default date when no status is locked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const text = fixture.nativeElement.querySelector('.header__status-text');
    expect(text.textContent.trim()).toBe(formatDefaultDate());
  });

  it('should emphasize the selected tab', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const selected = fixture.nativeElement.querySelector('.header__tab--selected');
    expect(selected.textContent.trim()).toBe('Overview');
  });

  it('should emit tabSelect when a tab is clicked', async () => {
    const spy = vi.fn();
    component.tabSelect.subscribe(spy);
    fixture.detectChanges();
    await fixture.whenStable();

    const tabs = fixture.nativeElement.querySelectorAll('.header__tab');
    tabs[1].click();
    expect(spy).toHaveBeenCalledWith('portfolio');
  });

  it('should emit languageSelect when language is changed from dropdown', async () => {
    const spy = vi.fn();
    component.languageSelect.subscribe(spy);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.header__lang-btn').click();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.header__lang-item');
    items[1].click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('EN');
    expect(fixture.nativeElement.querySelector('.header__lang-list')).toBeNull();
  });

  it('should show only active language code on the compact button', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.header__lang-btn').textContent.trim()).toBe('BG');
  });

  it('should emit menuSelect and close menu on item click', async () => {
    const spy = vi.fn();
    component.menuSelect.subscribe(spy);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.header__menu .header__icon-btn').click();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.header__menu-item').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith('refresh');
    expect(fixture.nativeElement.querySelector('.header__menu-list')).toBeNull();
  });

  it('should set data-theme for dark theme', () => {
    component.theme = 'dark';
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should set data-theme for light theme', () => {
    component.theme = 'light';
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-theme')).toBe('light');
  });

  it('should omit data-theme for system theme', () => {
    component.theme = 'system';
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-theme')).toBeNull();
  });

  it('should show locked status text', async () => {
    component.lockStatus({ id: 'tab:overview', text: 'Sopharma' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.header__status-text').textContent.trim()).toBe(
      'Sopharma',
    );
  });

  it('should show transient status over base lock', async () => {
    component.lockStatus({ id: 'tab:overview', text: 'Sopharma' });
    component.pushTransient({ id: 'net:1', text: 'Live', spinner: true });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.header__status-text').textContent.trim()).toBe(
      'Live',
    );
    expect(fixture.nativeElement.querySelector('.header__status-spinner')).toBeTruthy();
  });

  it('should append transient text with base prefix', async () => {
    component.lockStatus({ id: 'tab:overview', text: '09.07' });
    component.pushTransient({ id: 'net:1', text: 'Sync', spinner: true, mode: 'append' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.header__status-prefix').textContent.trim()).toBe(
      '09.07',
    );
    expect(fixture.nativeElement.querySelector('.header__status-text').textContent.trim()).toBe(
      'Sync',
    );
  });

  it('should not unlock base status from a different owner', async () => {
    component.lockStatus({ id: 'tab:a', text: 'Tab A' });
    component.unlockStatus('tab:b');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.header__status-text').textContent.trim()).toBe(
      'Tab A',
    );
  });

  it('should emit share event with payload when autoShare is false', async () => {
    const spy = vi.fn();
    component.autoShare = false;
    component.shareUrl = 'https://app.test/page';
    component.share.subscribe(spy);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.header__share').click();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          url: 'https://app.test/page',
          title: '',
          text: '',
        },
      }),
    );
  });

  it('should allow client to prevent default share behavior', async () => {
    component.autoShare = true;
    component.shareUrl = 'https://app.test/page';
    component.share.subscribe((event) => event.preventDefault());

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.header__share').click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.header__share')).toBeTruthy();
  });
});
