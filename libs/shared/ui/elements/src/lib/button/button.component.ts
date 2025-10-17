import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { BadgeConfig, IconType, Size, Theme } from '@ikigaidev/model';
import { timer } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AsyncButton } from './directive/async-button.directive';

@Component({
  selector: 'lib-button',
  imports: [CommonModule, IconComponent, SpinnerComponent],
  template: `
    <ng-content select="lib-icon[left]"></ng-content>

    <ng-content></ng-content>

    <ng-content select="lib-icon[right]"></ng-content>

    @if (asyncDirective.processing()) {
      <lib-spinner [size]="20"></lib-spinner>
    }

    @if (errorShown()) {
      <lib-icon
        [iconSize]="20"
        [icon]="'xmark-solid'"
        [fillContainer]="true"
        class="text-red-600"
      ></lib-icon>
    }
  `,
  host: {
    class: `outline-0 border inline-flex justify-center items-center gap-2
     rounded hover:cursor-pointer transition-all
      duration-100`,
    '[attr.data-tone]': 'disabled() ? "gray" : theme()',
    '[attr.type]': '"button"',
    '[class]': 'allClasses()',
    '[class.disabled]': 'disabled()',
    '[class.rounded-full]': 'rounded()',
    '[class.w-full]': 'fillContainer()',
    '[class.w-fit]': '!fillContainer()',
  },
  hostDirectives: [
    {
      directive: AsyncButton,
      inputs: ['asyncClick'],
      outputs: ['next', 'btnError', 'complete'],
    },
  ],
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly asyncDirective = inject(AsyncButton);

  errorShown = signal<boolean>(false);

  badge = input<BadgeConfig>();
  theme = input<Theme>('white');
  icon = input<IconType>();
  size = input<Extract<Size, 'sm' | 'md' | 'lg'>>('md');
  appearance = input<'outline' | 'fill'>('fill');
  fillContainer = input<boolean>(false);
  rounded = input<boolean>(false);
  disabled = input<boolean>();
  themeClasses = computed(() =>
    (this.appearance() === 'fill'
      ? this.theme().includes('gradient')
        ? ['bg-gradient', 'border-0', 'hover:brightness-125']
        : ['bg-token-soft', 'border-token-soft', 'hover:bg-token-active']
      : ['text-token', 'border-token-soft', 'hover:bg-token-ghost']
    )
      .concat('text-token')
      .join(' '),
  );
  allClasses = computed(() => {
    return [this.size(), this.appearance(), this.themeClasses()]
      .filter(Boolean)
      .join(' ');
  });

  constructor() {
    this.asyncDirective.btnError.subscribe(() => this.showErrorState());
  }

  showErrorState(): void {
    this.errorShown.set(true);
    timer(3000).subscribe(() => this.errorShown.set(false));
  }
}
