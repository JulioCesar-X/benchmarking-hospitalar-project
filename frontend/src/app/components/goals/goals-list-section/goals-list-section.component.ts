import { Component, Input, OnChanges, SimpleChanges, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Filter } from '../../../core/models/filter.model';
import { GoalService } from '../../../core/services/goal/goal.service';
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

interface Goal {
  id: number | null;
  indicator_name: string;
  service_name?: string;
  activity_name?: string;
  target_value: string;
  year: number;
  sai_id: number | null;
  isInserted: boolean;
  isUpdating: boolean;
  isEditing: boolean;
}

@Component({
  selector: 'app-goals-list-section',
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
    ExcelImportComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ],
  templateUrl: './goals-list-section.component.html',
  styleUrls: ['./goals-list-section.component.scss']
})
export class GoalsListSectionComponent implements OnInit, OnChanges, AfterViewInit {
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
  isLoadingGoals = true;
  totalGoals = 0;
  pageSize = 10;
  currentPage = 0;
  goals: Goal[] = [];
  allGoals: Goal[] = [];
  loadedPages: Set<number> = new Set();
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  pageOptions = [5, 10, 20, 50, 100];

  constructor(
    private goalService: GoalService,
    private indicatorService: IndicatorService
  ) { }

  ngOnInit(): void {
    this.loadGoals(0, 30);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && changes['filter'].currentValue !== changes['filter'].previousValue) {
      this.loadGoals(0, 30);
    }
  }

  ngAfterViewInit() {
    this.updateDataSource();
  }

  loadGoals(pageIndex = 0, pageSize = 30): void {
    if (this.filter?.year && this.filter?.serviceId) {
      this.isLoadingGoals = true;
      const serviceId = Number(this.filter.serviceId);
      const activityId = this.filter.activityId !== null && this.filter.activityId !== undefined ? Number(this.filter.activityId) : null;
      const year = this.filter.year;

      this.indicatorService.getIndicatorsGoals(serviceId, activityId, year, pageIndex, pageSize)
        .pipe(
          catchError(error => {
            console.error('Error fetching goals', error);
            return of({ total: 0, data: [] });
          }),
          finalize(() => this.isLoadingGoals = false)
        )
        .subscribe(response => {
          if (pageIndex === 0) {
            this.allGoals = this.mapGoals(response.data);
          } else {
            this.allGoals = [...this.allGoals, ...this.mapGoals(response.data)];
          }
          this.totalGoals = response.total;
          this.updateDataSource();
          this.loadedPages.add(pageIndex);
        });
    }
  }

  mapGoals(data: any[]): Goal[] {
    return data.map(item => {
      const goal = item.goal || {
        goal_id: null,
        target_value: '',
        year: this.filter.year
      };

      return {
        id: goal.goal_id,
        indicator_name: item.indicator_name,
        target_value: goal.target_value,
        year: goal.year,
        sai_id: item.sai_id,
        service_name: item.service_name, // Garantir que está preenchendo corretamente
        activity_name: item.activity_name, // Garantir que está preenchendo corretamente
        isInserted: goal.target_value !== '',
        isUpdating: false,
        isEditing: false
      };
    });
  }

  onGoalsImported(goals: any[]): void {
    goals.forEach(goal => {
      const newGoal: Goal = {
        id: null,
        indicator_name: 'Imported Goal', // Placeholder, replace with actual indicator name if available
        target_value: goal.target_value,
        year: goal.year,
        sai_id: goal.sai_id,
        isInserted: true,
        isUpdating: false,
        isEditing: false
      };
      this.allGoals.push(newGoal);
    });
    this.updateDataSource();
  }

  exportGoals(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Goals');

    // Adicionar cabeçalhos e subtítulos
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = `Metas do Ano ${this.filter.year}`;
    worksheet.getCell('A1').font = { bold: true };

    const serviceName = this.allGoals.length > 0 && this.allGoals[0].service_name ? this.allGoals[0].service_name : 'N/A';
    const activityName = this.allGoals.length > 0 && this.allGoals[0].activity_name ? this.allGoals[0].activity_name : 'N/A';

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
      { header: 'ID', key: 'sai_id', width: 10 },
      { header: 'Nome do Indicador', key: 'indicator_name', width: 30 },
      { header: 'Ano', key: 'year', width: 15 },
      { header: 'Meta Anual', key: 'target_value', width: 15 }
    ];

    // Adicionar a linha dos cabeçalhos das colunas
    const headerRow = worksheet.addRow({
      sai_id: 'ID',
      indicator_name: 'Nome do indicador',
      year: 'Ano',
      target_value: 'Meta Anual',
    });

    // Adicionar os dados
    this.allGoals.forEach(goal => {
      worksheet.addRow({
        sai_id: goal.sai_id,
        indicator_name: goal.indicator_name,
        year: goal.year,
        target_value: Number(goal.target_value) // Garantir que o valor seja numérico
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

    // Formatação de dados
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 6) { // Ajuste para a linha correta dos dados
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'GoalsDataExport.xlsx');
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

  editGoal(goal: Goal): void {
    if (goal.isInserted && !goal.isEditing) {
      goal.isEditing = true;
      return;
    }

    if (String(goal.target_value).trim() === '') {
      this.setNotification('O valor não pode estar vazio', 'error');
      return;
    }

    const valueAsNumber = Number(goal.target_value);
    if (isNaN(valueAsNumber) || !Number.isInteger(valueAsNumber) || valueAsNumber <= 0) {
      this.setNotification('O valor deve ser um número inteiro maior que 0', 'error');
      return;
    }

    if (goal.id) {
      goal.isUpdating = true;
      this.goalService.updateGoal(goal.id, goal)
        .pipe(finalize(() => {
          goal.isUpdating = false;
          goal.isEditing = false;
        }))
        .subscribe(
          () => this.setNotification('Meta atualizada com sucesso', 'success'),
          error => this.setNotification(this.getErrorMessage(error), 'error')
        );
    } else {
      const newGoal = {
        sai_id: goal.sai_id,
        target_value: goal.target_value,
        year: goal.year
      };
      goal.isUpdating = true;
      this.storeGoal(newGoal);
    }
  }

  storeGoal(newGoal: any): void {
    this.goalService.storeGoal(newGoal)
      .pipe(finalize(() => newGoal.isUpdating = false))
      .subscribe(
        () => {
          this.setNotification('Meta criada com sucesso', 'success');
          this.loadGoals(0, this.pageSize * 3); // Recarrega os dados
        },
        error => this.setNotification(this.getErrorMessage(error), 'error')
      );
  }

  onValueChange(goal: Goal): void {
    const index = this.goals.findIndex(g => g.id === goal.id);
    if (index !== -1) {
      this.goals[index].target_value = goal.target_value;
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  getErrorMessage(error: any): string {
    switch (error.status) {
      case 409:
        return 'Goal already exists';
      case 400:
        return 'Invalid data';
      default:
        return 'An error occurred. Please try again later.';
    }
  }

  onPageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    if (!this.loadedPages.has(this.currentPage)) {
      this.loadGoals(this.currentPage, this.pageSize * 3);
    } else {
      this.updateDataSource();
    }
  }

  updateDataSource(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.goals = this.allGoals.slice(startIndex, endIndex);
  }

  trackByIndex(index: number, item: any): number {
    return item.id;
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

  cancelEditing(goal: Goal): void {
    goal.isEditing = false;
  }
}