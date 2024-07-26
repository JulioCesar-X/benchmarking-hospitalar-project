import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/env';


if (environment.production) {
  enableProdMode();
  
  window.console.log = () => { };
  window.console.warn = () => { };
  window.console.error = () => { };
  window.console.info = () => { };
}
console.log('Environment:', environment);
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimations(),
    importProvidersFrom(HttpClientModule), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync() // Corrige a importação do HttpClientModule
  ]
}).catch(err => console.error(err));
