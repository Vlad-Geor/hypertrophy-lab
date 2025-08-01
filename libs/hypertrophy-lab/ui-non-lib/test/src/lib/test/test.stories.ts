import type { Meta, StoryObj } from '@storybook/angular';

import { fn } from '@storybook/test';

import TestComponent from './test.component';

export const ActionsData = {
  archiveTask: fn(),
  pinTask: fn(),
};

const meta: Meta<TestComponent> = {
  title: 'Task',
  component: TestComponent,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  args: {
    ...ActionsData,
  },
};

export default meta;
type Story = StoryObj<TestComponent>;

export const defaultTask = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
};

export const Default: Story = {
  args: {
    task: { ...defaultTask },
  },
};

export const Pinned: Story = {
  args: {
    task: {
      ...defaultTask,
      state: 'TASK_PINNED',
    },
  },
};

export const Archived: Story = {
  args: {
    task: {
      ...defaultTask,
      state: 'TASK_ARCHIVED',
    },
  },
};
