import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Service } from '../models/service.model';  // Certifique-se de que a interface Service esteja corretamente definida

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  //private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/services';

  //para testar localmente
  private apiUrl = 'http://localhost:8001/services';

  constructor(private http: HttpClient) { }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  getServiceById(serviceId: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${serviceId}`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Um erro de cliente ou de rede ocorreu. Trate-o de acordo.
      console.error('An error occurred:', error.error.message);
    } else {
      // O backend retornou um código de resposta de falha.
      // O corpo da resposta pode conter pistas sobre o que deu errado,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Retorna um Observable com uma mensagem de erro voltada para o usuário
    return throwError(
      'Something bad happened; please try again later.');
  }

}
