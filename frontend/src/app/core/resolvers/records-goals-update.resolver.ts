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
export class RecordsGoalsUpdateResolver implements Resolve<any> {

    constructor(
        private indicatorService: IndicatorService,
        private serviceService: ServiceService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const serviceId = +route.paramMap.get('serviceId')!;
        console.log(`Resolving data for serviceId: ${serviceId}`);

        if (isNaN(serviceId) || serviceId <= 0) {
            console.error('Invalid serviceId:', serviceId);
            return of({ error: true, message: 'Invalid serviceId' });
        }

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
                    console.log('Service data retrieved:', service);
                    if (service.sais && service.sais.length > 0) {
                        filter.activityId = filter.activityId !== 1 ? filter.activityId : service.sais[0].activity.id;
                        filter.indicatorId = filter.indicatorId !== 1 ? filter.indicatorId : service.sais[0].indicator.id;
                    } else if (service.indicators && service.indicators.length > 0) {
                        filter.indicatorId = filter.indicatorId !== 1 ? filter.indicatorId : service.indicators[0].id;
                        filter.activityId = filter.activityId !== 1 ? filter.activityId : null;
                    } else {
                        console.error('Service has no activities or indicators:', service);
                        return of({ error: true, message: 'Service has no activities or indicators' });
                    }

                    const activities = service.sais?.map((sai: any) => ({
                        id: sai.activity.id,
                        name: sai.activity.activity_name
                    })).filter((value: any, index: any, self: any) => self.findIndex((v: any) => v.id === value.id) === index) ?? [];

                    const indicators = service.sais?.map((sai: any) => ({
                        id: sai.indicator.id,
                        name: sai.indicator.indicator_name
                    })).filter((value: any, index: any, self: any) => self.findIndex((v: any) => v.id === value.id) === index) ?? [];

                    return this.serviceService.indexServices().pipe(
                        map((allServices: any) => ({ data: service, filter, activities, indicators, allServices: allServices ?? [] })),
                        catchError(error => {
                            console.error('Failed to fetch all services:', error);
                            return of({ error: true, message: 'Failed to fetch all services' });
                        })
                    );
                } else {
                    console.error('Service not found for serviceId:', serviceId);
                    return of({ error: true, message: 'Service not found' });
                }
            }),
            catchError(error => {
                console.error('Service fetch failed:', error);
                return of({ error: true, message: 'Service fetch failed' });
            })
        );
    }
}