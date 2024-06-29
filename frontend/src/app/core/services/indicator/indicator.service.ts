import { Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Indicator } from '../../models/indicator.model';
import { Filter } from '../../models/filter.model';

@Injectable({
  providedIn: 'root'
})

export class IndicatorService {
  constructor(private http: HttpClient) { }

  indexIndicators(): Observable<Indicator[]> {
    return this.http.get<Indicator[]>('/admin/indicators').pipe(
      catchError(error => throwError(() => new Error('Failed to fetch indicators')))
    );
  }

  getIndicatorsPaginated(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`/admin/indicators/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch paginated indicators')))
    );
  }


  getSAIPaginated(pageIndex: number, pageSize: number): Observable<any[]>{
    return this.http.get<any>(`/indicators/sai/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
        catchError(error => {
          console.error('Error fetching service activity indicators:', error);
          return throwError(() => new Error('Failed to fetch service activity indicators'));
        })
      );
  }

  getAllInDataGraphs(filter: Filter): Observable<any> {
    return this.http.get<any>('/indicators/sai/charts').pipe(
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(() => new Error('Failed to fetch data'));
        })
      );
  }

  getIndicatorsRecords(serviceId: number, activityId: number | null, year: number, month: number, pageIndex: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('serviceId', serviceId)
      .set('activityId', activityId !== null ? activityId.toString() : '')
      .set('year', year.toString())
      .set('month', month.toString())
      .set('page', (pageIndex + 1).toString())
      .set('size', pageSize.toString());
    console.log('params >>', params.toString());

    return this.http.get<any>('/indicators/sai/records', { params }).pipe(
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Falha ao buscar indicadores com registros'));
      })
    );
  }

  getIndicatorsGoals(serviceId: number, activityId: number | null, year: number, pageIndex: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('serviceId', serviceId)
      .set('activityId', activityId !== null ? activityId : '')
      .set('year', year)
      .set('page', (pageIndex + 1))
      .set('size', pageSize);
    console.log('params >>', params);

    return this.http.get<any>('/indicators/sai/goals', { params }).pipe(
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Falha ao buscar indicadores c / metas'));
      })
    );
  }


  storeIndicator(indicator: Indicator): Observable<Indicator> {
    return this.http.post<Indicator>('/admin/indicators', indicator).pipe(
      catchError(error => throwError(() => new Error('Failed to create indicator')))
    );
  }

  showIndicator(id: number): Observable<Indicator> {
    return this.http.get<Indicator>(`/admin/indicators/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch indicator')))
    );
  }

  updateIndicator(id: number, indicator: Indicator): Observable<Indicator> {
    return this.http.put<Indicator>(`/admin/indicators/${id}`, indicator).pipe(
      catchError(error => throwError(() => new Error('Failed to update indicator')))
    );
  }

  destroyIndicator(id: number): Observable<any> {
    return this.http.delete(`/admin/indicators/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to delete indicator')))
    );
  }
}
