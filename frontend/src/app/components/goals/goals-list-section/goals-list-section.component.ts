import { Component, Input, OnChanges, SimpleChanges, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Filter } from '../../../core/models/filter.model';
import { GoalService } from '../../../core/services/goal/goal.service';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { catchError, finalize } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageEvent, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { CustomMatPaginatorIntl } from '../../shared/paginator/customMatPaginatorIntl';
import { ExcelImportComponent } from '../../shared/excel-import/excel-import.component';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
  originalValue?: string; // Adicionada a propriedade originalValue
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
    ExcelImportComponent,
    MatProgressBarModule
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
  isImporting: boolean = false;

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
      const { serviceId, activityId, year } = this.filter;

      this.indicatorService.getIndicatorsGoals(Number(serviceId), Number(activityId), year, pageIndex, pageSize)
        .pipe(
          catchError(error => {
            console.error('Error fetching goals', error);
            return of({ total: 0, data: [] });
          }),
          finalize(() => this.isLoadingGoals = false)
        )
        .subscribe(response => {
          this.allGoals = pageIndex === 0 ? this.mapGoals(response.data) : [
            ...this.allGoals,
            ...this.mapGoals(response.data).filter(newGoal =>
              !this.allGoals.some(existingGoal => existingGoal.sai_id === newGoal.sai_id && existingGoal.year === newGoal.year)
            )
          ];
          this.totalGoals = response.total;
          this.updateDataSource();
          this.loadedPages.add(pageIndex);
        });
    }
  }

  mapGoals(data: any[]): Goal[] {
    return data.map(item => ({
      id: item.goal?.id ?? null,
      indicator_name: item.indicator_name,
      target_value: item.goal?.target_value ?? '',
      year: item.goal?.year ?? this.filter.year,
      sai_id: item.sai_id,
      service_name: item.service_name ?? 'N/A',
      activity_name: item.activity_name ?? 'N/A',
      isInserted: !!item.goal?.target_value,
      isUpdating: false,
      isEditing: false,
      originalValue: item.goal?.target_value ?? '' // Adicionada a propriedade originalValue
    }));
  }

  onGoalsImported(goals: any[]): void {
    goals.forEach(goal => {
      const existingGoal = this.allGoals.find(g => g.sai_id === goal.sai_id && g.year === goal.year);

      if (existingGoal) {
        existingGoal.target_value = goal.target_value;
        existingGoal.originalValue = goal.target_value;
        existingGoal.isInserted = true;
      } else {
        this.allGoals.push({
          ...goal,
          id: goal.id ?? null,
          indicator_name: goal.indicator_name ?? 'Imported Goal',
          service_name: goal.service_name ?? 'N/A',
          activity_name: goal.activity_name ?? 'N/A',
          isInserted: true,
          isUpdating: false,
          isEditing: false,
          originalValue: goal.target_value // Adicionada a propriedade originalValue
        });
      }
    });

    this.updateDataSource();
    this.sendGoalsToBackend(goals);
  }

  sendGoalsToBackend(goals: Goal[]): void {
    const requests = goals.map(goal => {
      const existingGoal = this.allGoals.find(g => g.sai_id === goal.sai_id && g.year === goal.year);

      return existingGoal && existingGoal.id
        ? this.goalService.updateGoal(existingGoal.id, goal).pipe(finalize(() => this.finalizeUpdate(goal)))
        : this.goalService.storeGoal(goal).pipe(finalize(() => this.finalizeUpdate(goal)));
    });

    forkJoin(requests).subscribe(
      () => {
        this.setNotification('Metas criadas/atualizadas com sucesso', 'success');
        this.loadGoals(this.currentPage, this.pageSize);
      },
      error => {
        this.setNotification('Erro ao criar/atualizar metas', 'error');
      }
    );
  }

  finalizeUpdate(goal: Goal): void {
    goal.isUpdating = false;
    goal.isEditing = false;
  }

  onImportStarted(): void {
    this.isImporting = true;
  }

  onImportFinished(): void {
    this.isImporting = false;
  }

  exportGoals(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Goals');

    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = `Metas do Ano ${this.filter.year}`;
    worksheet.getCell('A1').font = { bold: true };

    const serviceName = this.allGoals.length ? this.allGoals[0].service_name : 'N/A';
    const activityName = this.allGoals.length ? this.allGoals[0].activity_name : 'N/A';

    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').value = `Serviço: ${serviceName}`;
    worksheet.getCell('A2').font = { bold: true };

    worksheet.mergeCells('A3:D3');
    worksheet.getCell('A3').value = `Atividade: ${activityName}`;
    worksheet.getCell('A3').font = { bold: true };

    const currentDate = new Date();
    worksheet.mergeCells('A4:D4');
    worksheet.getCell('A4').value = `Data: ${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
    worksheet.getCell('A4').font = { bold: true };

    worksheet.mergeCells('A5:D5');
    worksheet.getCell('A5').value = '(Valores acumulados)';
    worksheet.getCell('A5').font = { bold: true };

    worksheet.columns = [
      { header: 'ID', key: 'sai_id', width: 10 },
      { header: 'Nome do Indicador', key: 'indicator_name', width: 30 },
      { header: 'Ano', key: 'year', width: 15 },
      { header: 'Meta Anual', key: 'target_value', width: 15 }
    ];

    const headerRow = worksheet.addRow({
      sai_id: 'ID',
      indicator_name: 'Nome do indicador',
      year: 'Ano',
      target_value: 'Meta Anual',
    });

    this.allGoals.forEach(goal => {
      worksheet.addRow({
        sai_id: goal.sai_id,
        indicator_name: goal.indicator_name,
        year: goal.year,
        target_value: Number(goal.target_value)
      });
    });

    worksheet.autoFilter = {
      from: 'A6',
      to: 'D6',
    };

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB6DDE8' }
      };
    });

    // Bloquear células específicas (cabeçalhos e subtítulos)
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

    // Desbloquear as células "Ano" e "Meta Anual"
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
    if (!goal.isEditing) {
      goal.originalValue = goal.target_value; // Salve o valor original ao iniciar a edição
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
          this.loadGoals(0, this.pageSize * 3);
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
    if (goal.originalValue !== undefined) {
      goal.target_value = goal.originalValue; // Restaure o valor original
    }
    goal.isEditing = false;
  }
}