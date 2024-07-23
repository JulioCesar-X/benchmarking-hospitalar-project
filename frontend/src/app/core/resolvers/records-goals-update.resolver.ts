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

                    // Map activities and indicators based on the service data
                    const activities = service.sais?.map((sai: any) => ({
                        id: sai.activity_id,
                        name: sai.activity?.activity_name || ''
                    })).filter((activity: any) => activity.id) || [];

                    const indicators = service.sais?.map((sai: any) => ({
                        id: sai.indicator_id,
                        name: sai.indicator?.indicator_name || ''
                    })).filter((indicator: any) => indicator.id) || [];

                    // Update filter with first activity and indicator if they exist
                    if (activities.length > 0) {
                        filter.activityId = activities[0].id;
                    } else {
                        filter.activityId = null;
                    }

                    if (indicators.length > 0) {
                        filter.indicatorId = indicators[0].id;
                    }

                    return of({ data: service, filter, activities, indicators });
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