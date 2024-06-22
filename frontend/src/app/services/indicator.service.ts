import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Indicator } from '../models/indicator.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }


  
    //para testar para passar o user a ser editado JMS...............
    private indicatorDataSource = new BehaviorSubject<any>(null); // Use BehaviorSubject for initial value
    indicatorData$ = this.indicatorDataSource.asObservable();
  
    setindicatorData(data: any) {
      this.indicatorDataSource.next(data);
    }
    //.................................JMS

  getIndicators(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`, // Uso do token de autenticação
      'Content-Type': 'application/json' // Se necessário, definindo o tipo de conteúdo
    });

    return this.http.get<any[]>('/admin/indicators', {
      headers: headers,
      withCredentials: true // Certifique-se de enviar credenciais para sessões seguras
    }).pipe(
      catchError(error => {
        console.error('Erro ao buscar indicadores:', error);
        return throwError(() => new Error('Falha ao buscar indicadores'));
      })
    );
  }

  getAllSaiRecords(service_id: number, activity_id: number, date: Date): Observable<Indicator[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    const params = new HttpParams()
      .set('serviceId', service_id.toString())
      .set('activityId', activity_id.toString())
      .set('date', date.toISOString().split('T')[0]);

    return this.http.get<Indicator[]>(`/sai/indicators/records`, { params: params, headers: headers, withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar records:', error);
          return throwError(() => new Error('Falha ao buscar indicadores c/ records'));
        })
      );
  }

  getAllSaiGoals(service_id: number, activity_id: number, year: number): Observable<Indicator[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    const params = new HttpParams()
      .set('service_id', service_id)
      .set('activity_id', activity_id)
      .set('year', year);

    return this.http.get<Indicator[]>(`/sai/indicators/goals`, { params: params, headers: headers, withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar metas:', error);
          return throwError(() => new Error('Falha ao buscar indicadores c/ metas'));
        })
      );
  }

  postIndicator(indicatorData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`, // Uso do token de autenticação
      'Content-Type': 'application/json' // Configurando o tipo de conteúdo
    });

    return this.http.post('/admin/indicators', indicatorData, {
      headers: headers,
      withCredentials: true // Incluir para manter a sessão com cookies, se necessário
    });
  }

  editIndicator(id: number, data: Indicator): Observable<any> {
    return this.http.put(`/admin/indicators/${id}`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`,
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable < never > {
    let errorMessage = 'Unknown error occurred. Please try again.';
    if(error.error instanceof ErrorEvent) {
    console.error('Client-side error:', error.error.message);
    errorMessage = `An error occurred: ${error.error.message}`;
  } else {
    console.error(`Server returned code ${error.status}, body was: ${error.error}`);
    errorMessage = `Error returned from server: ${error.error.message}`;
  }
  return throwError(() => new Error(errorMessage));
    }

}

