import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Indicator } from '../../../models/indicator.model';
import { RecordService } from '../../../services/record.service'

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
    private recordService: RecordService) { }

  ngOnInit(): void {
/*     this.buildForm(); */
    this.GetRecords();
  }

GetRecords(){
  this.isLoadingRecords = true;

  this.recordService.getRecords().subscribe({
    next: (data) => {
      if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
        console.log(data);

        this.records = data.map(record => ({
          id: record.id,
          saiId: record.service_activity_indicator_id,
          value: record.value,
          date: record.date,
          isInserted: record.value == 0 ? false : true,
        }));

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


  //adaptar nomes indicators para goals abaixo?? confirmar!
//o que ngOnChanges esta a fazer

//ACHO QUE NAO VAMOS PRECISAR DO ngOnChanges
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Records']) {



/*       if (changes['indicators'].currentValue !== changes['indicators'].previousValue) {
        this.buildForm();
      } */
    }
  }



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
      alert("updating")
      recordUpdate.isInserted = true;
      //logica de dar update aqui
      this.recordService.editRecord(recordUpdate.id, recordUpdate).subscribe(
        (response: any) => {
          alert("success")
          //usar mesmo notificacoes
            this.setNotification('record atualizado com sucesso', 'success');
        },
        (error: any) => {
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
}
