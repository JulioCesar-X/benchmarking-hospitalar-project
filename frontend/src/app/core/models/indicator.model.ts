import { Sai } from './sai.model';

export interface Indicator {
  id?: number;
  indicator_name: string;
  services?: { id: number, name: string }[];
  activities?: { id: number, name: string }[];
  isInserted?: boolean;
  activity_ids?: number[];
  service_ids?: number[];
  sais?: Sai[];
}
