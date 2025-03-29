import type { Meta, StoryObj } from '@storybook/angular';
import { TagComponent } from './tag.component';

const meta: Meta<TagComponent> = {
  component: TagComponent,
  title: 'TagComponent',
};
export default meta;
type Story = StoryObj<TagComponent>;

export const Primary: Story = {
  args: {},
};
