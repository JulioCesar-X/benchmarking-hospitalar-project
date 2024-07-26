import { Sai } from './sai.model';

export interface Service {
  id: number;
  service_name: string;
  image_url: string;
  more_info?: string;
  description?: string | null;
  activities?: { id: number, name: string }[];
  indicators?: { id: number, name: string }[];
  activity_ids?: number[];
  indicator_ids?: number[];
  sais?: Sai[];
  associations?: { activity_id: number, indicator_id: number }[];
  desassociations?: { sai_id: number }[];
}

export type CreateService = Omit<Service, 'id'>;