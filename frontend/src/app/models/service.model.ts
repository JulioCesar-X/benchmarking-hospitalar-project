import { ServiceActivityIndicator } from './sai.model';

export interface Service {
  id: number;
  imageUrl: string | null;
  service_name: string;
  description: string | null;
  activities?: number[];
  indicators?: number[];
  service_activity_indicators?: ServiceActivityIndicator[] | null;
}


