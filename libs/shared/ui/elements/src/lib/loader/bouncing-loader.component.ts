import { Component } from '@angular/core';
import { SurfaceCard } from '../surface-card/surface-card.component';

@Component({
  selector: 'lib-bouncing-loader',
  template: `
    <lib-surface-card>
      <div class="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span class="loading text-center">Loading...</span>
    </lib-surface-card>
  `,
  styleUrl: './bouncing-loader.component.scss',
  imports: [SurfaceCard],
})
export class BouncingLoaderComponent {}
