import type { Meta, StoryObj } from '@storybook/angular';
import { SlideToggleComponent } from './slide-toggle.component';

const meta: Meta<SlideToggleComponent> = {
  component: SlideToggleComponent,
  title: 'SlideToggleComponent',
};
export default meta;
type Story = StoryObj<SlideToggleComponent>;

export const Primary: Story = {
  args: {},
};
