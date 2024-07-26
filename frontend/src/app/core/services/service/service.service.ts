import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Service } from '../../models/service.model';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  private getCacheKey(id: number | string): string {
    return `service-${id}`;
  }

  indexServices(): Observable<Service[]> {
    const cacheKey = 'services-index';
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get<Service[]>('/services').pipe(
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response);
          }
        }),
        catchError(error => {
          console.error('Failed to fetch services:', error);
          return throwError(() => new Error('Failed to fetch services'));
        })
      );
    }
  }

  getFirstValidService(): Observable<Service | null> {
    const cacheKey = 'first-valid-service';
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get<Service[]>(`/services`).pipe(
        map(services => services.find(service => service.id) || null),
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response);
          }
        }),
        catchError(error => {
          console.error('Failed to fetch first valid service:', error);
          return of(null);
        })
      );
    }
  }

  getServicesPaginated(pageIndex: number, pageSize: number): Observable<any> {
    const cacheKey = `services-paginated-${pageIndex}-${pageSize}`;
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get<any>(`/services/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response);
          }
        }),
        catchError(error => {
          console.error('Failed to fetch paginated services:', error);
          return throwError(() => new Error('Failed to fetch paginated services'));
        })
      );
    }
  }

  updateServiceOrder(services: Service[]): Observable<any> {
    return this.http.post<any>('/services/update-order', { services }).pipe(
      tap(() => this.cacheService.clear()), // Limpa o cache ao atualizar a ordem dos serviços
      catchError(error => {
        console.error('Failed to update service order:', error);
        return throwError(() => new Error('Failed to update service order'));
      })
    );
  }

  showService(id: number): Observable<Service> {
    const cacheKey = this.getCacheKey(id);
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get<Service>(`/services/${id}`).pipe(
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response);
          }
        }),
        catchError(error => {
          console.error('Failed to fetch service:', error);
          return throwError(() => new Error('Failed to fetch service'));
        })
      );
    }
  }

  storeService(service: any): Observable<any> {
    return this.http.post<any>('/services', service).pipe(
      tap(response => {
        if (response !== null && response !== undefined) {
          this.cacheService.clear(); // Limpa o cache ao adicionar um novo serviço
        }
      }),
      catchError(error => {
        console.error('Failed to store service:', error);
        return throwError(() => new Error('Failed to store service'));
      })
    );
  }

  updateService(id: number, service: any): Observable<any> {
    return this.http.put<any>(`/services/${id}`, service).pipe(
      tap(response => {
        if (response !== null && response !== undefined) {
          this.cacheService.set(this.getCacheKey(id), response); // Atualiza o cache com a resposta
          this.cacheService.clear(); // Limpa todo o cache para garantir dados atualizados
        }
      }),
      catchError(error => {
        console.error('Failed to update service:', error);
        return throwError(() => new Error('Failed to update service'));
      })
    );
  }

  destroyService(id: number): Observable<any> {
    return this.http.delete(`/services/${id}`).pipe(
      tap(response => {
        if (response !== null && response !== undefined) {
          this.cacheService.clear(); // Limpa o cache ao deletar um serviço
        }
      }),
      catchError(error => {
        console.error('Failed to delete service:', error);
        return throwError(() => new Error('Failed to delete service'));
      })
    );
  }
}