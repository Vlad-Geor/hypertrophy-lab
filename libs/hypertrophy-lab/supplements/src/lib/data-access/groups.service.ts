import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API, API_BASE_URL, Group, GroupSupplementListItem } from '@ikigaidev/hl/shared';
import { Observable } from 'rxjs';

@Injectable()
export class GroupsService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE = inject(API_BASE_URL);

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.API_BASE}${API.groups}`);
  }

  getGroupSupplements(
    groupId: string,
    includeBatches?: boolean,
  ): Observable<GroupSupplementListItem[]> {
    return this.http.get<GroupSupplementListItem[]>(
      `${this.API_BASE}${API.groups}/${groupId}/supplements${includeBatches ? '?includeBatches=1' : ''}`,
    );
  }
}
