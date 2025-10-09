import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@ikigaidev/config';
import {
  addInventoryBulkExistingRequest,
  AddInventoryBulkExistingRequest,
  AddInventoryBulkExistingResponse,
  ListCatalogResponse,
  ListInventoryResponse,
} from '@ikigaidev/hl/contracts';
import { Supplement } from '@ikigaidev/hl/model';
import { API, API_BASE_URL } from '@ikigaidev/hl/shared';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupplementService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE = inject(API_BASE_URL);

  getAllSupplements(includeUser: boolean): Observable<ListCatalogResponse> {
    return this.http.get<ListCatalogResponse>(
      `${this.API_BASE}/supplements${includeUser ? '?includeUser=true' : ''}`,
    );
  }

  getUserSupplements(): Observable<ListInventoryResponse> {
    return this.http.get<ListInventoryResponse>(`${this.API_BASE}${API.inventory}`);
  }

  addCatalogSupplement(payload: Supplement): Observable<Supplement> {
    return this.http.post<Supplement>(`${environment.apiBase}/supplements`, payload);
  }

  addExistingSupplementsToUserBulk(
    req: AddInventoryBulkExistingRequest,
  ): Observable<AddInventoryBulkExistingResponse> {
    const parsed = addInventoryBulkExistingRequest.safeParse(req);
    console.log(parsed);

    return of({} as AddInventoryBulkExistingResponse);
  }

  getCatalogSupplements(): Supplement[] {
    return [];
  }

  allSupplements = (includeUser?: boolean) =>
    httpResource<ListCatalogResponse>(
      () => `${this.API_BASE}/supplements${includeUser ? '?includeUser=true' : ''}`,
    );
}
