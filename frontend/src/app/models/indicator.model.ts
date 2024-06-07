export interface Indicator {
  id: number | null;
  indicator_name: string;
  service_id?: number| null;
  activity_id?: number | null;
  type?: string;
  target_value?: number | null;
  year?: number;
}
