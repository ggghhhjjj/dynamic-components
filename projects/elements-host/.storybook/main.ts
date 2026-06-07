import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../../../projects/*/src/stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
