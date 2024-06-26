import { ServiceActivityIndicator } from './sai.model';

export interface Activity {
    id: number;
    activity_name: string;
    activities?: number[];
    indicators?: number[];
    service_activity_indicators?: ServiceActivityIndicator[] | null;
  
    activity_id?: number;
  }

