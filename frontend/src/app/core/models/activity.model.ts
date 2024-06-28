export interface Activity {
  id: number;

  activity_name: string;


  services?: {id:number, name:string}[];
  indicators?: { id: number, name: string }[];


  service_ids?: number[];
  indicator_ids?: number[];

  service_activity_indicators?: {
    service: {
      id: number;
      service_name: string;
    },
    indicator: {
      id: number;
      indicator_name: string;
    }
  }[];
}

