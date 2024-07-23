import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Indicator } from '../../models/indicator.model';
import { Filter } from '../../models/filter.model';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  private cache: Map<string, any> = new Map();

  constructor(private http: HttpClient) { }

  private getHttpParams(filter: Filter): HttpParams {
    return new HttpParams()
      .set('serviceId', filter.serviceId?.toString() || '0')
      .set('activityId', filter.activityId?.toString() || '')
      .set('indicatorId', filter.indicatorId?.toString() || '0')
      .set('year', filter.year?.toString() || '0')
      .set('month', filter.month?.toString() || '0');
  }

  private getCacheKey(filter: Filter): string {
    return `${filter.indicatorId}-${filter.activityId}-${filter.serviceId}-${filter.year}-${filter.month}`;
  }

  getAllData(filter: Filter): Observable<any> {
    const cacheKey = this.getCacheKey(filter);
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    } else {
      return forkJoin({
        recordsMensal: this.getRecordsMensal(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
        recordsAnual: this.getRecordsAnual(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
        recordsAnualLastYear: this.getRecordsLastYear(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
        goalsMensal: this.getGoalsMensal(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
        goalMes: this.getGoalMes(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
        goalAnual: this.getGoalAnual(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
        previousYearTotal: this.getPreviousYearTotal(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
        currentYearTotal: this.getCurrentYearTotal(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
        variations: this.getVariations(filter).pipe(map(data => ({ hasData: true, data })), catchError(() => of({ hasData: false, data: [] }))),
      }).pipe(
        map(data => {
          this.cache.set(cacheKey, data);

          const processedData = {
            recordsMensal: data.recordsMensal.hasData ? data.recordsMensal.data : null,
            recordsAnual: data.recordsAnual.hasData ? data.recordsAnual.data : null,
            recordsAnualLastYear: data.recordsAnualLastYear.hasData ? data.recordsAnualLastYear.data : null,
            goalsMensal: data.goalsMensal.hasData ? data.goalsMensal.data : null,
            goalMes: data.goalMes.hasData ? data.goalMes.data : null,
            goalAnual: data.goalAnual.hasData ? data.goalAnual.data : null,
            previousYearTotal: data.previousYearTotal.hasData ? data.previousYearTotal.data : null,
            currentYearTotal: data.currentYearTotal.hasData ? data.currentYearTotal.data : null,
            variations: data.variations.hasData ? data.variations.data : null,
          };

          return processedData;
        }),
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(() => new Error('Failed to fetch data'));
        })
      );
    }
  }

  getRecordsMensal(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/records-mensal', { params });
  }

  getRecordsAnual(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/records-anual', { params });
  }

  getRecordsLastYear(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/records-last-year', { params });
  }

  getGoalsMensal(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/goals-mensal', { params });
  }

  getGoalMes(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/goal-mes', { params });
  }

  getGoalAnual(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/goal-anual', { params });
  }

  getPreviousYearTotal(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/previous-year-total', { params });
  }

  getCurrentYearTotal(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/current-year-total', { params });
  }

  getVariations(filter: Filter): Observable<any> {
    const params = this.getHttpParams(filter);
    return this.http.get<any>('/indicators/sai/variations', { params });
  }

  indexIndicators(): Observable<Indicator[]> {
    return this.http.get<Indicator[]>('/indicators').pipe(
      catchError(error => throwError(() => new Error('Failed to fetch indicators')))
    );
  }

  getIndicatorsPaginated(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`/indicators/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch paginated indicators')))
    );
  }

  getSAIPaginated(pageIndex: number, pageSize: number): Observable<any[]> {
    return this.http.get<any>(`/indicators/sai/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => {
        console.error('Error fetching service activity indicators:', error);
        return throwError(() => new Error('Failed to fetch service activity indicators'));
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

    return this.http.get<any>('/indicators/sai/records', { params });
  }

  getIndicatorsGoals(serviceId: number, activityId: number | null, year: number, pageIndex: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('serviceId', serviceId)
      .set('activityId', activityId !== null ? activityId : '')
      .set('year', year)
      .set('page', (pageIndex + 1))
      .set('size', pageSize);
    console.log('params >>', params.toString());

    return this.http.get<any>('/indicators/sai/goals', { params }).pipe(
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Falha ao buscar indicadores c / metas'));
      })
    );
  }

  storeIndicator(indicator: any): Observable<any> {
    return this.http.post<any>('/indicators', indicator);
  }

  showIndicator(id: number): Observable<Indicator> {
    return this.http.get<Indicator>(`/indicators/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch indicator')))
    );
  }

  updateIndicator(id: number, indicator: any): Observable<any> {
    return this.http.put<any>(`/indicators/${id}`, indicator);
  }

  destroyIndicator(id: number): Observable<any> {
    return this.http.delete(`/indicators/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to delete indicator')))
    );
  }

}