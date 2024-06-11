import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/env';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica se a URL já contém o URL base da API para evitar duplicação
    const apiReq = req.url.startsWith(environment.apiUrl) ? req : req.clone({
      url: `${environment.apiUrl}${req.url}`
    });
    return next.handle(apiReq);
  }
}
