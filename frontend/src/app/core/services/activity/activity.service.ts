import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Activity } from '../../models/activity.model';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  private getCacheKey(id: number): string {
    return `activity-${id}`;
  }

  indexActivities(): Observable<Activity[]> {
    const cacheKey = 'activities-index';
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get<Activity[]>('/activities').pipe(
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response);
          }
        }),
        catchError(error => {
          console.error('Failed to fetch activities:', error);
          return throwError(() => new Error('Failed to fetch activities'));
        })
      );
    }
  }

  getActivitiesPaginated(pageIndex: number, pageSize: number): Observable<any> {
    const cacheKey = `activities-paginated-${pageIndex}-${pageSize}`;
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get<any>(`/activities/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response);
          }
        }),
        catchError(error => {
          console.error('Failed to fetch paginated activities:', error);
          return throwError(() => new Error('Failed to fetch paginated activities'));
        })
      );
    }
  }

  showActivity(id: number): Observable<Activity> {
    const cacheKey = this.getCacheKey(id);
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get<Activity>(`/activities/${id}`).pipe(
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response);
          }
        }),
        catchError(error => {
          console.error('Failed to fetch activity:', error);
          return throwError(() => new Error('Failed to fetch activity'));
        })
      );
    }
  }

  storeActivity(activity: any): Observable<any> {
    return this.http.post<any>('/activities', activity).pipe(
      tap(response => {
        if (response !== null && response !== undefined) {
          this.cacheService.clear(); // Limpa o cache ao adicionar uma nova atividade
        }
      }),
      catchError(error => {
        console.error('Failed to store activity:', error);
        return throwError(() => new Error('Failed to store activity'));
      })
    );
  }

  updateActivity(id: number, activity: any): Observable<any> {
    return this.http.put<any>(`/activities/${id}`, activity).pipe(
      tap(response => {
        if (response !== null && response !== undefined) {
          this.cacheService.set(this.getCacheKey(id), response); // Atualiza o cache com a resposta
          this.cacheService.clear(); // Limpa todo o cache para garantir dados atualizados
        }
      }),
      catchError(error => {
        console.error('Failed to update activity:', error);
        return throwError(() => new Error('Failed to update activity'));
      })
    );
  }

  destroyActivity(id: number): Observable<any> {
    return this.http.delete(`/activities/${id}`).pipe(
      tap(response => {
        if (response !== null && response !== undefined) {
          this.cacheService.clear(); // Limpa o cache ao deletar uma atividade
        }
      }),
      catchError(error => {
        console.error('Failed to delete activity:', error);
        return throwError(() => new Error('Failed to delete activity'));
      })
    );
  }
}