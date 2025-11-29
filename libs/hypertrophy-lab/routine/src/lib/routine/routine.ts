import { Component } from '@angular/core';
import { SurfaceCard, ButtonComponent, SingleSelectComponent, InputComponent, IconComponent } from "@ikigaidev/elements";

@Component({
  selector: 'lib-routine',
  imports: [SurfaceCard, ButtonComponent, SingleSelectComponent, InputComponent, IconComponent],
  templateUrl: './routine.html',
  styleUrl: './routine.scss',
})
export class Routine {}
