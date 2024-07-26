import { Component, Input, OnChanges, SimpleChanges, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Filter } from '../../../core/models/filter.model';
import { RecordService } from '../../../core/services/record/record.service';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageEvent, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { CustomMatPaginatorIntl } from '../../shared/paginator/customMatPaginatorIntl';
import { ExcelImportComponent } from '../../shared/excel-import/excel-import.component';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';

interface Record {
  record_id: number | null;
  indicator_name: string;
  service_name?: string;
  activity_name?: string;
  sai_id: number;
  value: string;
  date: string;
  isInserted: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  originalValue?: string; // Adicionada a propriedade originalValue
}

@Component({
  selector: 'app-records-list-section',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorComponent,
    LoadingSpinnerComponent,
    FeedbackComponent,
    MatTooltipModule,
    ExcelImportComponent,
    MatProgressBarModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ],
  templateUrl: './records-list-section.component.html',
  styleUrls: ['./records-list-section.component.scss']
})
export class RecordsListSectionComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('excelImport') excelImportComponent!: ExcelImportComponent;

  @Input() filter: Filter = {
    indicatorId: 1,
    activityId: 1,
    serviceId: 1,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  @Input() indicators: any[] = [];
  @Input() isLoading: boolean = false;

  dropdownOpen = false;
  isLoadingRecords = true;
  isImporting: boolean = false;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 0;
  records: Record[] = [];
/*   allStaticRecords: Record[] = []; */
  allRecords: Record[] = [];
  loadedPages: Set<number> = new Set();
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  pageOptions = [5, 10, 20, 50, 100];
  isRecordForStoring:boolean = false;

  constructor(
    private recordService: RecordService,
    private indicatorService: IndicatorService
  ) { }

  ngOnInit(): void {
    this.loadRecords(0, 30);

  }

  ngOnChanges(changes: SimpleChanges): void {
        this.isRecordForStoring = false

    if (changes['filter'] && changes['filter'].currentValue !== changes['filter'].previousValue) {
      this.loadRecords(0, 30);
    }


  }

  ngAfterViewInit() {
    this.updateDataSource();
  }

  loadRecords(pageIndex = 0, pageSize = 30): void {
    if (this.filter?.year && this.filter?.month && this.filter?.serviceId) {
      this.isLoadingRecords = true;
      const year = this.filter.year;
      const month = this.filter.month;
      const serviceId = Number(this.filter.serviceId);
      const activityId = this.filter.activityId !== null && this.filter.activityId !== undefined ? Number(this.filter.activityId) : null;

      this.indicatorService.getIndicatorsRecords(serviceId, activityId as number, year, month, pageIndex, pageSize)
        .pipe(
          catchError(error => {
            console.error('Error fetching records', error);
            return of({ total: 0, data: [] });
          }),
          finalize(() => this.isLoadingRecords = false)
        )
        .subscribe(response => {
          const newRecords = response.data.map((item: any) => this.mapRecord(item, year, month)).flat();
          this.allRecords = pageIndex === 0 ? newRecords : [...this.allRecords, ...newRecords];
          this.totalRecords = response.total;
          this.updateDataSource();
          this.loadedPages.add(pageIndex);
        });
    }
  }

  mapRecord(item: any, year: number, month: number): Record[] {
    if (item.records.length === 0) {
      return [{
        record_id: item.record_id,
        indicator_name: item.indicator_name,
        service_name: item.service_name,
        activity_name: item.activity_name,
        sai_id: item.sai_id,
        value: '',
        date: `${year}-${String(month).padStart(2, '0')}-01`,
        isInserted: false,
        isUpdating: false,
        isEditing: false
      }];
    } else {
      return item.records.map((record: any) => ({
        record_id: record.record_id,
        indicator_name: item.indicator_name,
        service_name: item.service_name,
        activity_name: item.activity_name,
        sai_id: item.sai_id,
        value: record.value,
        date: record.date,
        isInserted: record.value !== '0',
        isUpdating: false,
        isEditing: false
      }));
    }
  }

  onRecordsImported(records: any[]): void {
    const newRecords: Record[] = records.map(record => {
      // Verifique se já existe um registro com a mesma data e sai_id
      const existingRecord = this.allRecords.find(r => r.sai_id === record.sai_id && r.date === record.date);

      if (existingRecord) {
        // Atualize o valor do registro existente
        existingRecord.value = record.value;
        return existingRecord;
      } else {
        // Adicione um novo registro
        return {
          record_id: record.record_id || null, // Certifique-se de que o record_id seja nulo se não existir
          indicator_name: record.indicator_name,
          service_name: record.service_name || 'N/A',
          activity_name: record.activity_name || 'N/A',
          sai_id: record.sai_id,
          value: record.value,
          date: record.date, // Data já formatada
          isInserted: true,
          isUpdating: false,
          isEditing: false
        };
      }
    });

    this.allRecords.push(...newRecords.filter(record => !record.record_id)); // Apenas novos registros sem record_id

    // Aqui vamos enviar os dados para o backend
    this.sendRecordsToBackend(newRecords);

    this.updateDataSource();
  }

  sendRecordsToBackend(records: Record[]): void {
    const requests = records.map(record => {
      if (record.record_id) {
        return this.recordService.updateRecord(record.record_id, record).pipe(
          finalize(() => {
            record.isUpdating = false;
            record.isEditing = false;
          })
        );
      } else {
        const newRecord = {
          ...record,
          isInserted: false,
          isEditing: false,
          isUpdating: false,
          originalValue: record.value, // Salva o valor original
          indicator_name: record.indicator_name || 'Novo Indicador', // Adicione valores padrão
          service_name: record.service_name || 'N/A', // Adicione valores padrão
          activity_name: record.activity_name || 'N/A', // Adicione valores padrão
          record_id: record.record_id || null // Certifique-se de que o record_id seja nulo se não existir
        };
        return this.recordService.storeRecord(newRecord).pipe(
          finalize(() => newRecord.isUpdating = false)
        );
      }
    });

    forkJoin(requests).subscribe(
      () => {
        this.setNotification('Registros criados/atualizados com sucesso', 'success');
        // Recarregar registros após as operações de backend para garantir que o cache foi atualizado
        this.loadRecords(this.currentPage, this.pageSize);
      },
      error => {
        this.setNotification('Erro ao criar/atualizar registros', 'error');
      }
    );
  }

  onImportStarted() {
    this.isImporting = true;
  }

  onImportFinished() {
    this.isImporting = false;
  }

  exportRecords(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Records');

    // Adicionar cabeçalhos e subtítulos
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = `Dados publicados em ${this.filter.year}-${this.filter.month}`;
    worksheet.getCell('A1').font = { bold: true };

    const serviceName = this.allRecords.length > 0 ? this.allRecords[0].service_name : 'N/A';
    const activityName = this.allRecords.length > 0 ? this.allRecords[0].activity_name : 'N/A';

    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').value = `Serviço: ${serviceName}`;
    worksheet.getCell('A2').font = { bold: true };

    worksheet.mergeCells('A3:D3');
    worksheet.getCell('A3').value = `Atividade: ${activityName}`;
    worksheet.getCell('A3').font = { bold: true };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    worksheet.mergeCells('A4:D4');
    worksheet.getCell('A4').value = `Data: ${formattedDate} ${formattedTime}`;
    worksheet.getCell('A4').font = { bold: true };

    worksheet.mergeCells('A5:D5');
    worksheet.getCell('A5').value = '(Valores acumulados)';
    worksheet.getCell('A5').font = { bold: true };

    // Configurar colunas
    worksheet.columns = [
      { header: 'ID', key: 'sai_id', width: 20 },
      { header: 'Nome do Indicador', key: 'indicator_name', width: 30 },
      { header: 'Data', key: 'date', width: 15 },
      { header: 'Valor', key: 'value', width: 15 }
    ];

    // Adicionar a linha dos cabeçalhos das colunas
    const headerRow = worksheet.addRow({
      sai_id: 'ID',
      indicator_name: 'Nome do indicador',
      date: 'Data',
      value: 'Valor',
    });

    // Adicionar os dados
    this.allRecords.forEach(record => {
      worksheet.addRow({
        sai_id: record.sai_id,
        indicator_name: record.indicator_name,
        date: record.date,
        value: Number(record.value)
      });
    });

    // Adicionar filtro aos cabeçalhos
    worksheet.autoFilter = {
      from: 'A6',
      to: 'D6',
    };

    // Formatação de cabeçalhos
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB6DDE8' }
      };
    });

    // Bloquear células específicas
    const lockedCells = ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5', 'D1', 'D2', 'D3', 'D4', 'D5'];

    lockedCells.forEach((cellAddress) => {
      const cell = worksheet.getCell(cellAddress);
      cell.protection = { locked: true };
    });

    // Bloquear células das colunas ID e Nome do Indicador
    worksheet.getColumn('A').eachCell((cell, rowNumber) => {
      if (rowNumber > 5) { // Ignorar cabeçalho e subtítulos
        cell.protection = { locked: true };
      }
    });

    worksheet.getColumn('B').eachCell((cell, rowNumber) => {
      if (rowNumber > 5) { // Ignorar cabeçalho e subtítulos
        cell.protection = { locked: true };
      }
    });

    // Desbloquear as células "Data" e "Valor"
    worksheet.getColumn('C').eachCell((cell, rowNumber) => {
      if (rowNumber > 5) { // Ignorar cabeçalho e subtítulos
        cell.protection = { locked: false };
      }
    });

    worksheet.getColumn('D').eachCell((cell, rowNumber) => {
      if (rowNumber > 5) { // Ignorar cabeçalho e subtítulos
        cell.protection = { locked: false };
      }
    });

    // Proteger a planilha
    worksheet.protect('atec2024', {
      selectLockedCells: true,
      selectUnlockedCells: true,
      autoFilter: true
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'RecordsDataExport.xlsx');
    }).catch((error) => {
      console.error('Erro ao gerar o arquivo Excel:', error);
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  triggerFileInput(): void {
    this.excelImportComponent.triggerFileInput();
  }

  editRecord(record: Record): void {
    if (!record.isEditing || !record.value) {
      record.originalValue = record.value; // Salve o valor original ao iniciar a edição
      record.isEditing = true;
      return;
    }

    if (String(record.value).trim() === '') {
      this.setNotification('O valor não pode estar vazio', 'error');
      return;
    }

    const valueAsNumber = Number(record.value);
    if (isNaN(valueAsNumber) || !Number.isInteger(valueAsNumber) || valueAsNumber <= 0) {
      this.setNotification('O valor deve ser um número inteiro maior que 0', 'error');
      return;
    }

    if ((record.record_id !== null && record.record_id > 0) || record.record_id === 0) {
      record.isUpdating = true;
      this.recordService.updateRecord(record.record_id, record)
        .pipe(finalize(() => {
          record.isUpdating = false;
          record.isEditing = false;
        }))
        .subscribe(
          () => this.setNotification('Registro atualizado com sucesso', 'success'),
          error => this.setNotification(this.getErrorMessage(error), 'error')
        );
    } else {
      const newRecord: Record = {
        record_id: null,
        indicator_name: record.indicator_name,
        service_name: record.service_name || 'N/A',
        activity_name: record.activity_name || 'N/A',
        sai_id: record.sai_id,
        value: record.value,
        date: record.date,
        isInserted: true,
        isUpdating: false,
        isEditing: false,
        originalValue: record.value // Salve o valor original ao criar um novo registro
      };
      record.isUpdating = true;
      this.storeRecord(newRecord, record);
    }
  }

  storeRecord(newRecord: Record, localRecord:Record): void {
    this.recordService.storeRecord(newRecord)
      .pipe(finalize(() => newRecord.isUpdating = false))
      .subscribe(
        () => {
          this.setNotification('Registro criado com sucesso', 'success');

          console.log('Before:', this.records);

          const recordToEdit = this.records.find(record => record.record_id === localRecord.record_id);
          if (recordToEdit) {
            recordToEdit.isUpdating = false;
            recordToEdit.isEditing = false;
          }
          
         //this.loadRecords(0, this.pageSize * 3);
      },
        error => this.setNotification(this.getErrorMessage(error), 'error')
      );
  }

  onValueChange(record: Record): void {
    this.isRecordForStoring = false

    //if we select filter parameters that dont have any records, it will return a list of objects with some or all ids undefined
    //we need ids for reference to which input is being edited in the input and that will be updated or stored
    //so we check and add negative values to the records with undefined Ids to use as reference
    this.checkRecordsForUndefinedIds();

    console.log("records", this.records)


    const index = this.records.findIndex(r => r.record_id === record.record_id);
    if (index !== -1) {
      this.records[index].value = record.value;
/*       console.log("records:", this.records) */
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  getErrorMessage(error: any): string {
    switch (error.status) {
      case 409:
        return 'Record already exists';
      case 400:
        return 'Invalid data';
      default:
        return 'An error occurred. Please try again later.';
    }
  }

  onPageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    if (!this.loadedPages.has(this.currentPage)) {
      this.loadRecords(this.currentPage, this.pageSize * 3);
    } else {
      this.updateDataSource();
    }
  }

  updateDataSource(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.records = this.allRecords.slice(startIndex, endIndex);
  }
  checkRecordsForUndefinedIds(){
    let negativeId = -1;

    this.records.forEach(record => {
      if (record.record_id === undefined) {
        record.record_id = negativeId;
        negativeId--;
      }
    });
  }

  trackByIndex(index: number, item: any): number {
    return item.record_id;
  }

  numberToMonth(monthNumber: number | undefined): string {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    if (monthNumber === undefined || monthNumber < 1 || monthNumber > 12) {
      throw new Error("Número do mês deve estar entre 1 e 12.");
    }

    return months[monthNumber - 1];
  }

  cancelEditing(record: Record): void {
    if (record.originalValue !== undefined) {
      record.value = record.originalValue; // Restaure o valor original
    }
    record.isEditing = false;
  }
}