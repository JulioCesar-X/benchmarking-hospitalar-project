import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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

        console.log('Resolving data for serviceId:', serviceId);

        return this.serviceService.showService(serviceId).pipe(
            switchMap((service: any) => {
                console.log('Service data received:', service);

                if (service && service.id) {
                    if (service.sais && service.sais.length > 0) {
                        filter.activityId = service.sais[0].activity_id;
                        filter.indicatorId = service.sais[0].indicator_id;
                        console.log('Service has activities and indicators, using activityId:', filter.activityId, 'and indicatorId:', filter.indicatorId);
                    } else if (service.indicators && service.indicators.length > 0) {
                        filter.indicatorId = service.indicators[0].id;
                        filter.activityId = undefined;  // No activity, only indicator
                        console.log('Service has no activities but has indicators, using indicatorId:', filter.indicatorId);
                    } else {
                        console.error('Service has no activities or indicators');
                        return of({ error: true, message: 'Service has no activities or indicators' });
                    }
                    return this.indicatorService.getAllData(filter);
                } else {
                    console.error('Service not found');
                    return of({ error: true, message: 'Service not found' });
                }
            }),
            catchError(error => {
                console.error('Error loading chart data', error);
                return of({ error: true, message: 'Error loading chart data' });
            })
        );
    }
}