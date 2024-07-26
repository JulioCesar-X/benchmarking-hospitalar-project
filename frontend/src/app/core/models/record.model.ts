export interface Record {
  id: number;                // Identificador do registro
  sai_id: number;  // Identificador do indicador
  value: string;                    // Valor do registro
  date: string;                     // Data no formato 'YYYY-MM-DD'

  //EXTRA
/*   indicator_name:string;
  isInserted: boolean;
  isUpdating: boolean; */
}
