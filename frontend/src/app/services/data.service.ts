import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/indicators';
  private apiUrl = 'http://localhost:8001/indicators'; //para testar localmente


  constructor(private http: HttpClient) { }

  getAccumulatedIndicatorData(): Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/accumulated`);
  }
}
