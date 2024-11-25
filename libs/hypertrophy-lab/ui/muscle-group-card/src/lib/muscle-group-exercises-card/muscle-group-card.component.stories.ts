import type { Meta, StoryObj } from '@storybook/angular';
import { MuscleGroupCardComponent } from './muscle-group-card.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<MuscleGroupCardComponent> = {
  component: MuscleGroupCardComponent,
  title: 'MuscleGroupCardComponent',
};
export default meta;
type Story = StoryObj<MuscleGroupCardComponent>;

export const Primary: Story = {
  args: {
    muscleGroupExercises: [
      {
        targetMuscle: 'biceps',
        sets: 3,
        equipment: 'dumbell',
        targetSubMuscle: 'long head',
        movement: 'curl',
        reps: 8,
        weight: 15,
        weightUnits: 'kg',
      },
    ],
  },
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/muscle-group-card works!/gi)).toBeTruthy();
  },
};
