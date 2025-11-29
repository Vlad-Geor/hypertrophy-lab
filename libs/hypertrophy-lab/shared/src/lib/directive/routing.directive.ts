import { Directive, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API } from '../constants/endpoints';
import { Feature } from '../constants/routes';

@Directive({
  selector: '[hlRoute]',
  hostDirectives: [RouterLink],
})
export class HlRoutingDirective {
  private readonly routerLink = inject(RouterLink);

  hlRoute = input.required<Feature>();

  constructor() {
    effect(() => (this.routerLink.routerLink = API[this.hlRoute()]));
  }
}
