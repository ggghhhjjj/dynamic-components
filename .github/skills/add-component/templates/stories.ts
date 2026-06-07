import type { Meta, StoryObj } from '@storybook/angular';
import { UiFoo } from '../lib/ui-foo';

const meta: Meta<UiFoo> = {
  title: 'Components/Foo',
  component: UiFoo,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Display label',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is non-interactive',
    },
  },
};

export default meta;
type Story = StoryObj<UiFoo>;

export const Default: Story = {
  args: {
    label: 'Default label',
    disabled: false,
  },
};
