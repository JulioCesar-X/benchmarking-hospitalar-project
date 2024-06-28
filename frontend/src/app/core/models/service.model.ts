export interface Service {
  id: number;
  imageUrl: string;
  service_name: string;
  description?: string | null;
  activities?: { id: number, name: string }[];
  indicators?: { id: number, name: string }[];
  indicator_ids?: number[];
  activity_ids?: number[];
  service_activity_indicators?: {
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
