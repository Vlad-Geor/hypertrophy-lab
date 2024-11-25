import type { Meta, StoryObj } from '@storybook/angular';
import { CarouselComponent } from './carousel.component';

const meta: Meta<CarouselComponent> = {
  component: CarouselComponent,
  title: 'CarouselComponent',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<CarouselComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
};

Primary.parameters = {
  layout: 'centered',
  docs: {
    description: {
      story:
        'This component displays a muscle group and its associated exercises.',
    },
  },
};
