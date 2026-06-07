import type { Meta, StoryObj } from '@storybook/angular';
import { UiCard } from '../lib/ui-card';

const meta: Meta<UiCard> = {
  title: 'Components/Card',
  component: UiCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Card heading' },
    subtitle: { control: 'text', description: 'Secondary heading below the title' },
    image: { control: 'text', description: 'Optional image URL (16:9 aspect ratio)' },
  },
};

export default meta;
type Story = StoryObj<UiCard>;

export const Default: Story = {
  args: {
    title: 'Component Library',
    subtitle: 'Reusable Angular Web Components',
    image: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:380px">
        <ui-card [title]="title" [subtitle]="subtitle" [image]="image">
          <p>This card demonstrates the base layout with a title, subtitle, and body content.</p>
        </ui-card>
      </div>
    `,
  }),
};

export const WithImage: Story = {
  args: {
    title: 'Mountain Sunrise',
    subtitle: 'Photographed at 2 400 m altitude',
    image: 'https://picsum.photos/seed/storybook/800/450',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:380px">
        <ui-card [title]="title" [subtitle]="subtitle" [image]="image">
          <p>An image card with a 16:9 media area, title, subtitle and body text.</p>
        </ui-card>
      </div>
    `,
  }),
};

export const NoSubtitle: Story = {
  args: {
    title: 'Simple Card',
    subtitle: '',
    image: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:380px">
        <ui-card [title]="title" [image]="image">
          <p>A card without a subtitle — the subtitle slot is hidden automatically.</p>
        </ui-card>
      </div>
    `,
  }),
};

export const GridLayout: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;">
        <ui-card title="Card One" subtitle="Subtitle one" image="https://picsum.photos/seed/1/800/450">
          <p>First card in a responsive grid.</p>
        </ui-card>
        <ui-card title="Card Two" subtitle="Subtitle two" image="https://picsum.photos/seed/2/800/450">
          <p>Second card — grid wraps automatically.</p>
        </ui-card>
        <ui-card title="Card Three" subtitle="Subtitle three">
          <p>Third card without an image.</p>
        </ui-card>
      </div>
    `,
  }),
};

export const MobileViewport: Story = {
  args: {
    title: 'Mobile Card',
    subtitle: 'Fits narrow screens',
    image: 'https://picsum.photos/seed/mobile/800/450',
  },
  parameters: {
    viewport: { defaultViewport: 'iphoneSE' },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-card [title]="title" [subtitle]="subtitle" [image]="image">
        <p>Optimised layout for small viewports using CSS container queries.</p>
      </ui-card>
    `,
  }),
};
