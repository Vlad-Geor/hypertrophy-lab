import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hl-playground',
  imports: [CommonModule, ],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
})
export class PlaygroundComponent {
  selectedOption = 'Soft Arch';

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
