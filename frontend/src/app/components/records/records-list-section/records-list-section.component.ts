import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Indicator } from '../../../models/indicator.model';
import { RecordService } from '../../../services/record.service'
import { IndicatorService } from '../../../services/indicator.service'
import { Filter } from '../../../models/Filter.model';

@Component({
  selector: 'app-records-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './records-list-section.component.html',
  styleUrls: ['./records-list-section.component.scss']
})
export class RecordsListSectionComponent implements OnInit, OnChanges {
  @Input() filter: Filter | undefined;

  @Input() indicators: Indicator[] = [];
  @Input() isLoading: boolean = false; // Adiciona a propriedade isLoading
/*   indicatorForms: { [key: number]: FormGroup } = {}; */

  isLoadingRecords: boolean = true;
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  records: any[] = [];

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder,
    private router: Router,
    private recordService: RecordService,
    private indicatorService: IndicatorService) { }

  ngOnInit(): void {
/*     this.buildForm(); */
    this.GetRecords();
    console.log(`filtro recebido:`, this.filter)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && changes['filter'].currentValue !== changes['filter'].previousValue) {
      console.log('Filter changed:', this.filter);
      this.GetRecords();
    }
  }

GetRecords(){

  if(this.filter && this.filter.year && this.filter.month && this.filter.serviceId && this.filter.activityId){
    this.isLoadingRecords = true;
    let date = new Date(this.filter.year, this.filter.month - 1);
    const dateStr = date.toISOString().split('T')[0];

    let serviceID = parseInt(this.filter.serviceId);
    let activityId = parseInt(this.filter.activityId);
    
    this.indicatorService.getAllSaiRecords(serviceID, activityId, date).subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
          console.log(data);
  
          //REVER ISTO E PARTE DE UPDATE
          this.records = data.map(record => {
            if (record.records && record.records[0] !== undefined) {
              return {
                id: record.records[0].record_id,
                indicatorName: record.indicator_name,
                saiId: record.sai_id,
                value: record.records[0].value,
                isInserted: record.records[0].value === '0' ? false : true,
                isUpdating: false
              };
            } else {
              return null; // or {} if you want to return an empty object instead
            }
          }).filter(record => record !== null); 
  
          console.log(this.records);
  
        } else {
          console.warn('Data is not an array:', data);
          this.isLoadingRecords = false;
        }
      },
      error: (error) => {      
        console.error('Erro ao obter Indicadores', error);
        this.isLoadingRecords = false;
      },
      complete:() => {
        this.isLoadingRecords = false;
      }
    });
  }
}


  //adaptar nomes indicators para goals abaixo?? confirmar!




  onValueChange(record: any): void {
    // Assuming you want to immediately update the record in the local list
    const index = this.records.findIndex(r => r.id === record.id);

    // Update the value in the local records array
    this.records[index].value = record.value;
    console.log(this.records[index].value);
  }
  

  UpdateRecord(recordUpdate: any): void {
    //colocar if statement para verificar se o botao esta no estado atualizar ou editar!!!
    //TESTAR PARA VER SE ATUALIZA NA DB

    if(recordUpdate.isInserted){
      recordUpdate.isInserted = false;
    } else {

      recordUpdate.isUpdating = true;
      recordUpdate.isInserted = true;
      //logica de dar update aqui
      this.recordService.editRecord(recordUpdate.id, recordUpdate).subscribe(
        (response: any) => {

          //usar mesmo notificacoes
          recordUpdate.isUpdating = false;
            this.setNotification('record atualizado com sucesso', 'success');
        },
        (error: any) => {
            recordUpdate.isUpdating = false;
            const errorMessage = this.getErrorMessage(error);
            this.setNotification(errorMessage, 'error');
        }
    ); 
    }
    console.log(recordUpdate)

      }

      setNotification(message: string, type: 'success' | 'error') {
        this.notificationMessage = message;
        this.notificationType = type;
    }
    
    getErrorMessage(error: any): string {
        if (error.status === 409) {
            return 'User already exists';
        }
        if (error.status === 400) {
            return 'Invalid email';
        }
        return 'An error occurred. Please try again later.';
    }


    trackByIndex(index: number, item: Indicator): number {
      return item.sai_id!;
    }



    //metodo original de quando estava no componente do filtro
 /*  getRecords(): void {
    if (this.month < 1 || this.month > 12) {
      console.error('Invalid month:', this.month);
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    if (!this.year) {
      console.error('Year is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    if (!this.service_id) {
      console.error('Service ID is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    if (!this.activity_id) {
      console.error('Activity ID is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    this.date = new Date(this.year, this.month - 1);
    const dateStr = this.date.toISOString().split('T')[0];
    this.indicatorService.getAllSaiIndicators(this.service_id, this.activity_id, this.date).subscribe({
      next: (data: Indicator[]) => {
        console.log('Indicators data:', data);
        this.indicatorsList = data;
        this.indicatorsUpdated.emit(this.indicatorsList);
        this.loadingStateChanged.emit(false); // Define isLoading como false quando os dados forem recebidos
      },
      error: (error) => {
        console.error('Error fetching indicators:', error);
        this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      }
    });
  } */
}
