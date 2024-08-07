import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

  search(type: string, term: string): Observable<any> {
    return this.http.get<any>(`/${type}/search`, { params: { q: term } });
  }
}
