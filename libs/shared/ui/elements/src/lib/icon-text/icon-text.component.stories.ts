import type { Meta, StoryObj } from '@storybook/angular';
import { IconTextComponent } from './icon-text.component';

const meta: Meta<IconTextComponent> = {
  component: IconTextComponent,
  title: 'IconTextComponent',
};
export default meta;
type Story = StoryObj<IconTextComponent>;

export const Primary: Story = {
  args: {},
};
