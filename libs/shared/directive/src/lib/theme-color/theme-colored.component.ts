import { Component } from '@angular/core';
import { ThemeColorDirective } from './theme-color.directive';

@Component({
  template: '',
  hostDirectives: [
    { directive: ThemeColorDirective, inputs: ['colorToken', 'cssProperty'] },
  ],
})
export abstract class ThemeColoredComponent {}
