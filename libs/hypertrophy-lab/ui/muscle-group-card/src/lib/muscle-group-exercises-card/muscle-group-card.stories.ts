import { Meta, StoryObj } from '@storybook/angular';
import { MuscleGroupCardComponent } from './muscle-group-card.component';

type Story = StoryObj<MuscleGroupCardComponent>;

const meta: Meta<MuscleGroupCardComponent> = {
  title: 'MuscleGroupCard',
  component: MuscleGroupCardComponent,
  tags: ['autodocs'],
  argTypes: {
    muscleGroupExercises: {
      control: 'object',
    },
  },
  decorators: [],
};

export default meta;

export const Default: Story = {
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

export const MultipleExercises: Story = {
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
      {
        targetMuscle: 'abs',
        sets: 3,
        equipment: 'machine',
        targetSubMuscle: 'lower chest',
        movement: 'crunch',
        reps: 8,
        weight: 15,
        weightUnits: 'kg',
      },
      {
        targetMuscle: 'abs',
        sets: 3,
        equipment: 'bodyweight',
        targetSubMuscle: 'lower abs',
        movement: 'crunch',
        reps: 8,
        weight: 15,
        weightUnits: 'kg',
      },
    ],
  },
};

Default.parameters = {
  layout: 'centered',
  docs: {
    description: {
      story:
        'This component displays a muscle group and its associated exercises.',
    },
  },
};
