import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  log(message: any, ...optionalParams: any[]) {
    if (environment.enableLogging) {
      console.log(message, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (environment.enableLogging) {
      console.error(message, ...optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (environment.enableLogging) {
      console.warn(message, ...optionalParams);
    }
  }

  info(message: any, ...optionalParams: any[]) {
    if (environment.enableLogging) {
      console.info(message, ...optionalParams);
    }
  }
}