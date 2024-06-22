export interface Goal {
  goal_id: number; // Identificador do indicador de atividade do serviço associado
  target_value: number | string;    // Valor alvo da meta
  year: number;                     // Ano da meta
}
