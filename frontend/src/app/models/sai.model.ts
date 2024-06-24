import { Activity } from "./activity.model";
import { Indicator } from "./indicator.model";
import { Service } from "./service.model";

export interface ServiceActivityIndicator {
  id?: number;
  activity?: Activity;
  activity_id: number;
  indicator?: Indicator
  indicator_id: number;
  service_id?: number;
  service?: Service;
  type?: string;
}
