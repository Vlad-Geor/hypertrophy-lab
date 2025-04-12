import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvatarComponent, InputComponent } from '@ikigaidev/elements';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hl-feature-shell',
  imports: [CommonModule, RouterOutlet, InputComponent, AvatarComponent],
  templateUrl: './feature-shell.component.html',
  styleUrl: './feature-shell.component.scss',
})
export class FeatureShellComponent {}
