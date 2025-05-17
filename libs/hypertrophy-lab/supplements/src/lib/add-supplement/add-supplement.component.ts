import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, InputComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';

@Component({
  selector: 'hl-add-supplement',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './add-supplement.component.html',
  styleUrl: './add-supplement.component.scss',
})
export class AddSupplementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly form = this.fb.group<Supplement>({
    name: '',
    description: '',
    dosageForm: 'pill',
    healthTarget: 'energy production',
  });

  onSubmit(): void {
    this.http
      .post<
        Supplement[]
      >('/api/v1/supplement', { name: this.form.get('name')?.value, description: this.form.get('description')?.value } as Supplement)
      .subscribe();
  }
}
