export interface Activity {
  id: number;
  activity_name: string;
  services?: { id: number, name: string }[];
  indicators?: { id: number, name: string }[];
  service_ids?: number[];
  indicator_ids?: number[];
  sais?: {
    id: number;
    service: {
      id: number;
      service_name: string;
    },
    indicator: {
      id: number;
      indicator_name: string;
    }
  }[];
  associations?: { service_id: number, indicator_id: number }[];
  desassociations?: { sai_id: number }[];
}

export type CreateActivity = Omit<Activity, 'id'>;