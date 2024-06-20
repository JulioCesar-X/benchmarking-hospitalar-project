import { Record } from './Record.model';
import { Goal } from './Goal.model';

export interface Indicator {
  sai_id?: number;                   // Identificador do indicador de atividade do serviço
  service_id?: number|string;               // Identificador do serviço
  activity_id?: number|string;              // Identificador da atividade
  indicator_name: string;           // Nome do indicador
  records?: Record[];                // Lista de registros associados
  goal?: Goal;                      // Meta associada (opcional)
  isInserted?: boolean;             // Indica se o valor foi inserido ou não (opcional)
  type?: string;                    // Tipo de indicador (opcional)
}
