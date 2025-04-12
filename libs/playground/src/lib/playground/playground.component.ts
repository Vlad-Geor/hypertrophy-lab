import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputComponent } from '@ikigaidev/elements';

@Component({
  selector: 'hl-playground',
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
  imports: [CommonModule, InputComponent],
})
export class PlaygroundComponent {
  selectedOption = 'Soft Arch';

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
