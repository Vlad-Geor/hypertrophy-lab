import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  createLogRequest,
  CreateLogRequest,
  CreateLogResponse,
  createPlanRequest,
  CreatePlanRequest,
  CreatePlanResponse,
  DayScheduleResponse,
  PatchLogRequest,
  updateLogRequest,
} from '@ikigaidev/hl/contracts';
import { API, API_BASE_URL } from '@ikigaidev/hl/shared';
import { Observable } from 'rxjs';
import { z } from 'zod';

@Injectable()
export class ScheduleService {
  private readonly API_BASE = inject(API_BASE_URL);
  private http = inject(HttpClient);

  addUserSupplementPlan(reqBody: CreatePlanRequest): Observable<CreatePlanResponse> {
    const parsed = createPlanRequest.safeParse(reqBody);
    if (parsed.error) {
      throw new Error(`Zod validation error: ${z.treeifyError(parsed.error)}`);
    }
    return this.http.post<CreatePlanResponse>(
      `${this.API_BASE}${API.schedule}/plans`,
      reqBody,
    );
  }

  getDayOverview = (date: string) =>
    httpResource<DayScheduleResponse>(() => `${this.API_BASE}/schedule?date=${date}`);

  logIntake(reqBody: CreateLogRequest): Observable<CreateLogResponse> {
    const parsed = createLogRequest.safeParse(reqBody);
    if (parsed.error) {
      throw parsed.error;
    }
    return this.http.post<CreateLogResponse>(`${this.API_BASE}${API.logs}`, reqBody);
  }

  updateIntakeLog(logId: string, patch: PatchLogRequest): Observable<CreateLogResponse> {
    const parsed = updateLogRequest.safeParse(patch);
    console.log(patch);
    console.log(`${this.API_BASE}${API.logs}/${logId}`);
    if (parsed.error) throw parsed.error;
    return this.http.patch<CreateLogResponse>(
      `${this.API_BASE}${API.logs}/${logId}`,
      patch,
    );
  }
}
