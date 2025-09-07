import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'lib-search',
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  template: `
    <lib-input
      type="text"
      [withSearch]="true"
      placeholder="Search..."
    ></lib-input>
  `,
})
export class SearchComponent {
}
