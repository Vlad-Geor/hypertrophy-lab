import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputComponent } from '@ikigaidev/elements';
import { HeaderComponent } from '@ikigaidev/header';
import { HealthTarget, HealthTargetCarouselItem, healthTargets } from '@ikigaidev/model';
import { SidenavComponent } from '@ikigaidev/navigation';
import { ViewportService } from '@ikigaidev/service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hl-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    InputComponent,
    HeaderComponent,
    SidenavComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  host: {
    style: 'display:flex; justify-content: center;',
  },
})
export class ShellComponent {
  private readonly vpService = inject(ViewportService);
  healthTargets: HealthTarget[] = [...healthTargets];

  constructor() {
    effect(() => console.log(this.vpService.platform()));
  }

  carouselData = this.healthTargets.map(
    (t, i) => ({ index: i, target: t }) as HealthTargetCarouselItem,
  );
}
