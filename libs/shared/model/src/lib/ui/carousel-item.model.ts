import { HealthTarget } from '../../../../../hypertrophy-lab/shared/src/lib/model/supplement/health-target';

export type CarouselItem = {
  imageSrc: string;
  data: Record<string, any>;
};

export type HealthTargetCarouselItem = {
  index: number;
  target: HealthTarget;
};
