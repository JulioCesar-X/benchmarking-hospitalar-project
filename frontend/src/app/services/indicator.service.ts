import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  constructor(private http: HttpClient) { }

  getIndicators(): Observable<any>{
    return this.http.get<any[]>('assets/indicatorsAccumulated.json');
  }
}
