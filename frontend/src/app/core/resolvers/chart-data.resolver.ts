import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { IndicatorService } from '../services/indicator/indicator.service';
import { ServiceService } from '../services/service/service.service';
import { Filter } from '../models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class ChartDataResolver implements Resolve<any> {

    constructor(
        private indicatorService: IndicatorService,
        private serviceService: ServiceService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const serviceId = +route.paramMap.get('serviceId')!;
        const filter: Filter = {
            indicatorId: 1,
            activityId: 1,
            serviceId: serviceId,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        };

        return this.serviceService.showService(serviceId).pipe(
            switchMap((service: any) => {
                if (service && service.id) {
                    if (service.sais && service.sais.length > 0) {
                        filter.activityId = service.sais[0].activity_id;
                        filter.indicatorId = service.sais[0].indicator_id;
                    } else if (service.indicators && service.indicators.length > 0) {
                        filter.indicatorId = service.indicators[0].id;
                        filter.activityId = null;
                    } else {
                        return of({ error: true, message: 'Service has no activities or indicators' });
                    }
                    return this.indicatorService.getAllData(filter).pipe(
                        map(data => ({ data, filter })),
                        catchError(error => {
                            console.error('Failed to fetch indicator data:', error);
                            return of({ error: true, message: 'Failed to fetch indicator data' });
                        })
                    );
                } else {
                    return of({ error: true, message: 'Service not found' });
                }
            }),
            catchError(error => {
                console.error('Failed to fetch service data:', error);
                return of({ error: true, message: 'Failed to fetch service data' });
            })
        );
    }
}