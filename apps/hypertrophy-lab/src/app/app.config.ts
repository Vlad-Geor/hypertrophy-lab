import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService, authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { API_BASE_URL } from '@ikigaidev/hl/shared';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { environment } from '@ikigaidev/config';
import { appRoutes } from './app.routes';

export const handleAuthError = () => {
  const auth = inject(AuthService);

  auth.error$.subscribe((err) => {
    console.log(err);

    // if (err.name === 'invalid_grant' || err.message === '')
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    importProvidersFrom(AngularSvgIconModule.forRoot()),
    provideAuth0({
      clientId: environment.auth.clientId,
      domain: environment.auth.domain,
      authorizationParams: {
        redirect_uri: environment.auth.redirectUri,
        audience: environment.auth.audience,
        scope: 'openid profile email offline_access',
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.apiBase}/*`,
            tokenOptions: {
              authorizationParams: { audience: environment.auth.audience },
            },
          },
        ],
      },
    }),
    { provide: API_BASE_URL, useValue: environment.apiBase },
    provideAppInitializer(handleAuthError),
  ],
};
