import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@ikigaidev/config';
import { Supplement } from '@ikigaidev/hl/model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupplementService {
  private readonly http = inject(HttpClient);

  addSupplement(payload: Supplement): Observable<Supplement> {
    return this.http.post<Supplement>(`${environment.apiBase}/supplements`, payload);
  }

  getAllSupplements(): Supplement[] {
    return [];
  }
}
