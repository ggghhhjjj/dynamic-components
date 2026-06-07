import type { Meta, StoryObj } from '@storybook/angular';
import { UiTable } from '../lib/ui-table';
import type { TableColumn } from '../lib/ui-table';

const COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'location', label: 'Location' },
];

const DATA: Record<string, unknown>[] = [
  { name: 'Alice Johnson', role: 'Engineer', location: 'Berlin' },
  { name: 'Bob Martinez', role: 'Designer', location: 'Madrid' },
  { name: 'Carol White', role: 'Manager', location: 'London' },
];

const meta: Meta<UiTable> = {
  title: 'Components/Table',
  component: UiTable,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object', description: 'Column definitions — array of { key: string; label: string }' },
    data: { control: 'object', description: 'Row data — array of Record<string, unknown>' },
  },
};

export default meta;
type Story = StoryObj<UiTable>;

export const Default: Story = {
  args: {
    columns: COLUMNS,
    data: DATA,
  },
};

export const Empty: Story = {
  args: {
    columns: COLUMNS,
    data: [],
  },
};

export const ManyColumns: Story = {
  args: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'first', label: 'First Name' },
      { key: 'last', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'dept', label: 'Department' },
    ],
    data: [
      { id: 1, first: 'Alice', last: 'Johnson', email: 'alice@example.com', dept: 'Engineering' },
      { id: 2, first: 'Bob', last: 'Martinez', email: 'bob@example.com', dept: 'Design' },
      { id: 3, first: 'Carol', last: 'White', email: 'carol@example.com', dept: 'Management' },
    ],
  },
};
