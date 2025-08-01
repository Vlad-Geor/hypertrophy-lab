import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageCarouselComponent } from '@ikigaidev/carousel';
import { InputComponent } from '@ikigaidev/elements';
import { NavigationComponent } from '@ikigaidev/navigation';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hl-feature-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    InputComponent,
    NavigationComponent,
    ImageCarouselComponent,
  ],
  templateUrl: './feature-shell.component.html',
  styleUrl: './feature-shell.component.scss',
  host: {
    style: 'display:flex; justify-content: center;',
  },
})
export class FeatureShellComponent {}
