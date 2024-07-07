import { Goal } from "./goal.model";
import { Record } from "./record.model";


export interface Sai {
  id?: number;
  type?: string;
  service?: {id: number, service_name: string};
  activity?: {id: number, activity_name: string};
  indicator?: {id: number, indicator_name: string};
  goals?: Goal[];
  records?: Record[];
}


