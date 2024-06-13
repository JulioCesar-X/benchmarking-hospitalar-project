import { Record } from './Record.model';
import { Goal } from './Goal.model';

export interface Indicator {
  sai_id?: number;
  service_id?: string;
  activity_id?: string;
  indicator_name: string;
  records?: Record[];
  goal?: Goal;
  isInserted?: boolean;
  type?: string;
}
