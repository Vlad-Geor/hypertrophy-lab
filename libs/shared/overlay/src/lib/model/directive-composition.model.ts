import { Type } from '@angular/core';

export type DirectiveCompositionConfig = {
  directive: Type<unknown>;
  inputs?: string[];
  outputs?: string[];
};