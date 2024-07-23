import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  constructor(private http: HttpClient) { }

  updateGoal(id: number, goal: any): Observable<any> {
    return this.http.put(`/goals/${id}`, goal);
  }

  storeGoal(goal: any): Observable<any> {
    return this.http.post('/goals', goal);
  }
}


