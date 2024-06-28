import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GoalService {
  constructor(private http: HttpClient) { }

  updateGoal(id: number, goal: any): Observable<any> {
    return this.http.put(`/admin/goals/${id}`, goal).pipe(
      catchError(error => {
        console.error('Error updating goal:', error);
        return throwError(() => new Error('Failed to update goal'));
      })
    );
  }

}


