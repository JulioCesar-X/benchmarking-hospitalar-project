import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  private getCacheKey(id: number): string {
    return `goal-${id}`;
  }

  updateGoal(id: number, goal: any): Observable<any> {
    return this.http.put(`/goals/${id}`, goal).pipe(
      tap(response => {
        const cacheKey = this.getCacheKey(id);
        if (response !== null && response !== undefined) {
          this.cacheService.set(cacheKey, response); // Atualiza o cache com a resposta
        }
      }),
      catchError(error => {
        console.error('Error updating goal:', error);
        return throwError(() => new Error('Failed to update goal'));
      })
    );
  }

  storeGoal(goal: any): Observable<any> {
    return this.http.post('/goals', goal).pipe(
      catchError(error => {
        console.error('Error storing goal:', error);
        return throwError(() => new Error('Failed to store goal'));
      })
    );
  }

  getGoal(id: number): Observable<any> {
    const cacheKey = this.getCacheKey(id);
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get(`/goals/${id}`).pipe(
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response); // Armazena a resposta no cache
          }
        }),
        catchError(error => {
          console.error('Error fetching goal:', error);
          return throwError(() => new Error('Failed to fetch goal'));
        })
      );
    }
  }
}