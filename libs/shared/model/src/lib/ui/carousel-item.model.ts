import { HealthTarget } from "../supplement/health-target";

export type CarouselItem = {
  imageSrc: string;
  data: Record<string, any>;
};

export type HealthTargetCarouselItem = {
  index: number;
  target: HealthTarget;
}