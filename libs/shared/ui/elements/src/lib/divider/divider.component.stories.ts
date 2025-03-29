import type { Meta, StoryObj } from '@storybook/angular';
import { DividerComponent } from './divider.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<DividerComponent> = {
  component: DividerComponent,
  title: 'DividerComponent',
};
export default meta;
type Story = StoryObj<DividerComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/divider works!/gi)).toBeTruthy();
  },
};
