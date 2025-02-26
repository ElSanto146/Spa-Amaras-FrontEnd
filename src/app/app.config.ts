import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { JwtInterceptorService } from './service/auth/jwt-interceptor.service';
import { ErrorInterceptorService } from './service/auth/error-interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {provide:HTTP_INTERCEPTORS, useClass:JwtInterceptorService, multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptorService, multi:true}, provideAnimationsAsync(),
    provideAnimations(),
    provideAnimations(), provideAnimationsAsync()
]};

