import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataUrl = 'assets/TESTdata.json';

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }

  getAccumulatedIndicatorData(): Observable<any>{
    return this.http.get<any[]>('assets/indicatorsAccumulated.json');
  }
}
