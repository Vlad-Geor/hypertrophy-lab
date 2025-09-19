import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { filter, switchMap } from 'rxjs';
import {environment} from '@ikigaidev/config';

@Component({ template: `` })
export class LoginSuccessCallbackComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    this.auth.isAuthenticated$
      .pipe(
        filter(Boolean),
        switchMap(() =>
          this.auth.user$.pipe(
            filter(Boolean),
            switchMap(() => this.http.get(`${environment.apiBase}/auth/me`)),
          ),
        ),
      )
      .subscribe(console.log);
  }
}
