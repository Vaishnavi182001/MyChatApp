import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi, withRequestsMadeViaParent } from '@angular/common/http';

import { authInterceptor } from './services/token.interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    //provideHttpClient(withInterceptorsFromDi()),
    //{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
};
