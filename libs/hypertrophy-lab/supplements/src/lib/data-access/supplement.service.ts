import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Supplement } from '@ikigaidev/hl/model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupplementService {
  private readonly http = inject(HttpClient);

  addSupplement(payload: Supplement): Observable<Supplement> {
    return this.http.post<Supplement>(
      'http://localhost:3333/api/v1/supplements',
      payload,
    );
  }

  getAllSupplements(): Supplement[] {
    return [];
  }
}
