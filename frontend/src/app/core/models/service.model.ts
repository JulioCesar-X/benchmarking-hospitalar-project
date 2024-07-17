export interface Service {
  id: number;
  image_url: string;
  service_name: string;
  more_info?: string;
  description?: string | null;
  activities?: { id: number, name: string }[];
  indicators?: { id: number, name: string }[];
  indicator_ids?: number[];
  activity_ids?: number[];
  sais?: {
    activity: {
      id: number;
      activity_name: string;
    },
    indicator: {
      id: number;
      indicator_name: string;
    }
  }[];
}
