import type { Meta, StoryObj } from '@storybook/angular';
import { UiHeader } from '../lib/ui-header';
import type { HeaderMenuItem, HeaderTab } from '../lib/ui-header';

const TABS: HeaderTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'markets', label: 'Markets' },
  { id: 'news', label: 'News' },
  { id: 'settings', label: 'Settings' },
];

const MENU_ITEMS: HeaderMenuItem[] = [
  { id: 'refresh', label: 'Refresh' },
  { id: 'about', label: 'About' },
];

const headerFrame = `
  <div style="position:relative;min-height:4rem;background:#e2e8f0;">
    <ui-header
      [tabs]="tabs"
      [selectedTabId]="selectedTabId"
      [menuItems]="menuItems"
      [languages]="languages"
      [activeLanguage]="activeLanguage"
      [theme]="theme"
      [menuLabel]="menuLabel"
      [languageLabel]="languageLabel"
      [shareLabel]="shareLabel"
      [shareCopiedLabel]="shareCopiedLabel"
      [shareUrl]="shareUrl"
      [shareTitle]="shareTitle"
      [shareText]="shareText"
      [autoShare]="autoShare"
      [statusLabel]="statusLabel"
      [statusOverride]="statusOverride"
      (tabSelect)="onTabSelect($event)"
      (menuSelect)="onMenuSelect($event)"
      (languageSelect)="onLanguageSelect($event)"
      (share)="onShare($event)"
    />
  </div>
`;

const meta: Meta<UiHeader> = {
  title: 'Components/Header',
  component: UiHeader,
  tags: ['autodocs'],
  render: (args) => ({
    props: {
      ...args,
      onTabSelect: (id: string) => {
        args.selectedTabId = id;
      },
      onMenuSelect: (id: string) => console.log('menuSelect', id),
      onLanguageSelect: (code: string) => {
        args.activeLanguage = code;
      },
      onShare: (event: { payload: { url: string; title: string; text: string } }) => {
        console.log('share', event.payload);
      },
    },
    template: headerFrame,
  }),
  argTypes: {
    tabs: { control: 'object', description: 'Tab definitions — { id, label }[]' },
    selectedTabId: { control: 'text', description: 'Currently selected tab id' },
    menuItems: { control: 'object', description: 'Overflow menu items — { id, label, disabled? }[]' },
    languages: { control: 'object', description: 'Language options — { code, label? }[]' },
    activeLanguage: { control: 'text', description: 'Active language code' },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'Color theme',
    },
    menuLabel: { control: 'text', description: 'Accessible label for the menu button' },
    languageLabel: { control: 'text', description: 'Accessible label for the language button' },
    shareLabel: { control: 'text', description: 'Accessible label for the share button' },
    shareCopiedLabel: { control: 'text', description: 'Screen reader text after clipboard copy' },
    shareUrl: {
      control: 'text',
      description: 'URL to share. Empty uses window.location.href in browser contexts.',
    },
    shareTitle: { control: 'text', description: 'Optional Web Share API title' },
    shareText: { control: 'text', description: 'Optional Web Share API text' },
    autoShare: {
      control: 'boolean',
      description: 'Run built-in share (Web Share / clipboard). Set false for Cordova/Electron handlers.',
    },
    statusLabel: { control: 'text', description: 'Accessible label for the status region' },
    statusOverride: {
      control: 'text',
      description: 'Optional status text override (bypasses status controller)',
    },
  },
};

export default meta;
type Story = StoryObj<UiHeader>;

export const Default: Story = {
  args: {
    tabs: TABS.slice(0, 3),
    selectedTabId: 'overview',
    menuItems: MENU_ITEMS,
    languages: [
      { code: 'BG', label: 'BG' },
      { code: 'EN', label: 'EN' },
    ],
    activeLanguage: 'BG',
    theme: 'system',
    menuLabel: 'Menu',
    languageLabel: 'Language',
    shareLabel: 'Share',
    shareCopiedLabel: 'Copied',
    shareUrl: '',
    shareTitle: '',
    shareText: '',
    autoShare: true,
    statusLabel: 'Status',
    statusOverride: '',
  },
};

export const Dark: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Light: Story = {
  args: {
    ...Default.args,
    theme: 'light',
  },
};

export const ManyTabs: Story = {
  args: {
    ...Default.args,
    tabs: TABS,
    selectedTabId: 'markets',
  },
  parameters: {
    viewport: { defaultViewport: 'iphoneSE' },
  },
};

export const ManyLanguages: Story = {
  args: {
    ...Default.args,
    languages: [
      { code: 'BG', label: 'Bulgarian' },
      { code: 'EN', label: 'English' },
      { code: 'DE', label: 'German' },
      { code: 'FR', label: 'French' },
      { code: 'ES', label: 'Spanish' },
      { code: 'IT', label: 'Italian' },
      { code: 'NL', label: 'Dutch' },
      { code: 'PT', label: 'Portuguese' },
      { code: 'PL', label: 'Polish' },
      { code: 'RO', label: 'Romanian' },
      { code: 'EL', label: 'Greek' },
      { code: 'CS', label: 'Czech' },
      { code: 'HU', label: 'Hungarian' },
      { code: 'SV', label: 'Swedish' },
      { code: 'DA', label: 'Danish' },
      { code: 'FI', label: 'Finnish' },
      { code: 'NO', label: 'Norwegian' },
      { code: 'TR', label: 'Turkish' },
      { code: 'RU', label: 'Russian' },
      { code: 'UK', label: 'Ukrainian' },
    ],
    activeLanguage: 'EN',
  },
  parameters: {
    viewport: { defaultViewport: 'iphoneSE' },
  },
};

export const CustomShareHandler: Story = {
  args: {
    ...Default.args,
    autoShare: false,
    shareUrl: 'myapp://portfolio/overview',
    shareTitle: 'Portfolio overview',
    shareText: 'Open in the app',
  },
  render: (args) => ({
    props: {
      ...args,
      onTabSelect: (id: string) => {
        args.selectedTabId = id;
      },
      onMenuSelect: (id: string) => console.log('menuSelect', id),
      onLanguageSelect: (code: string) => {
        args.activeLanguage = code;
      },
      onShare: (event: { payload: { url: string; title: string; text: string }; preventDefault: () => void }) => {
        event.preventDefault();
        console.log('Custom share handler', event.payload);
        window.alert(`Share via native bridge:\n${event.payload.url}`);
      },
    },
    template: headerFrame,
  }),
};

export const StatusLocked: Story = {
  args: {
    ...Default.args,
    statusOverride: 'Sopharma',
  },
};

export const StatusTransientSpinner: Story = {
  args: {
    ...Default.args,
    statusOverride: 'Live',
  },
  render: (args) => ({
    props: {
      ...args,
      onTabSelect: (id: string) => {
        args.selectedTabId = id;
      },
      onMenuSelect: (id: string) => console.log('menuSelect', id),
      onLanguageSelect: (code: string) => {
        args.activeLanguage = code;
      },
    },
    template: `
      <div style="position:relative;min-height:4rem;background:#e2e8f0;">
        <ui-header
          #header
          [tabs]="tabs"
          [selectedTabId]="selectedTabId"
          [menuItems]="menuItems"
          [languages]="languages"
          [activeLanguage]="activeLanguage"
          [theme]="theme"
          (tabSelect)="onTabSelect($event)"
          (menuSelect)="onMenuSelect($event)"
          (languageSelect)="onLanguageSelect($event)"
        />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('ui-header') as unknown as {
      pushTransient: (item: { id: string; text: string; spinner?: boolean }) => void;
    };
    header?.pushTransient?.({ id: 'net:demo', text: 'Live', spinner: true });
  },
};

export const StatusAppend: Story = {
  render: (args) => ({
    props: {
      ...args,
      tabs: TABS.slice(0, 3),
      selectedTabId: 'overview',
      menuItems: MENU_ITEMS,
      languages: [
        { code: 'BG', label: 'BG' },
        { code: 'EN', label: 'EN' },
      ],
      activeLanguage: 'BG',
      theme: 'system',
      onTabSelect: (id: string) => {
        args.selectedTabId = id;
      },
      onMenuSelect: (id: string) => console.log('menuSelect', id),
      onLanguageSelect: (code: string) => {
        args.activeLanguage = code;
      },
    },
    template: `
      <div style="position:relative;min-height:4rem;background:#e2e8f0;">
        <ui-header
          #header
          [tabs]="tabs"
          [selectedTabId]="selectedTabId"
          [menuItems]="menuItems"
          [languages]="languages"
          [activeLanguage]="activeLanguage"
          [theme]="theme"
          (tabSelect)="onTabSelect($event)"
          (menuSelect)="onMenuSelect($event)"
          (languageSelect)="onLanguageSelect($event)"
        />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('ui-header') as unknown as {
      lockStatus: (item: { id: string; text: string }) => void;
      pushTransient: (item: {
        id: string;
        text: string;
        spinner?: boolean;
        mode?: 'append';
      }) => void;
    };
    header?.lockStatus?.({ id: 'tab:overview', text: '09.07' });
    header?.pushTransient?.({ id: 'net:sync', text: 'Sync', spinner: true, mode: 'append' });
  },
};

export const StatusRace: Story = {
  render: StatusAppend.render,
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('ui-header') as unknown as {
      lockStatus: (item: { id: string; text: string }) => void;
      pushTransient: (item: {
        id: string;
        text: string;
        spinner?: boolean;
        ttlMs?: number;
        priority?: number;
      }) => void;
    };
    header?.lockStatus?.({ id: 'tab:overview', text: '09.07' });
    header?.pushTransient?.({ id: 'net:1', text: 'Loading', spinner: true });
    header?.pushTransient?.({ id: 'net:2', text: 'Offline', priority: 10 });
    header?.pushTransient?.({ id: 'toast', text: 'Saved', ttlMs: 2500 });
  },
};
