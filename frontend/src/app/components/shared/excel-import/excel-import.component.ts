import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, FeedbackComponent],
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.scss']
})
export class ExcelImportComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @Output() recordsImported = new EventEmitter<any[]>();
  @Output() importStarted = new EventEmitter<void>();
  @Output() importFinished = new EventEmitter<void>();
  @Input() importType: 'record' | 'goal' = 'record';
  isImporting = false;
  errors: string[] = [];
  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' = 'success';

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.importExcel(file);
    }
  }

  async importExcel(file: File) {
    this.importStarted.emit();
    this.isImporting = true;
    this.errors = [];

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      this.addError('Nenhuma planilha encontrada');
      this.finishImport();
      return;
    }

    // Verificação do cabeçalho
    const headerRow = worksheet.getRow(6);
    const expectedHeaders = this.importType === 'record'
      ? ['ID', 'Nome do Indicador', 'Data', 'Valor']
      : ['ID', 'Nome do Indicador', 'Ano', 'Meta Anual'];

    if (!this.validateHeaders(headerRow, expectedHeaders)) {
      this.addError('O cabeçalho da planilha não está no formato esperado. Exporte uma planilha de exemplo e tente novamente.');
      this.finishImport();
      return;
    }

    const records: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 6) { // Ajuste para a linha correta dos dados
        const record = this.importType === 'record' ? this.parseRecord(row, rowNumber) : this.parseGoal(row, rowNumber);
        if (record) { // Só adicionar se a validação passar
          records.push(record);
        }
      }
    });

    if (this.errors.length === 0) {
      this.recordsImported.emit(records);
      this.setFeedback('Importação bem-sucedida', 'success');
    } else {
      this.setFeedback('Erros encontrados durante a importação', 'error');
    }
    this.finishImport();
  }

  validateHeaders(headerRow: ExcelJS.Row, expectedHeaders: string[]): boolean {
    for (let i = 1; i <= expectedHeaders.length; i++) {
      const actualHeader = headerRow.getCell(i).value;
      if (typeof actualHeader !== 'string' || actualHeader.toLowerCase() !== expectedHeaders[i - 1].toLowerCase()) {
        console.error(`Erro no cabeçalho: esperado ${expectedHeaders[i - 1]}, mas encontrado ${actualHeader}`);
        return false;
      }
    }
    return true;
  }

  parseRecord(row: ExcelJS.Row, rowNumber: number): any {
    const sai_id = row.getCell(1).value;
    const indicator_name = row.getCell(2).value;
    const date = row.getCell(3).value?.toString() || '';
    const value = row.getCell(4).value;

    if (!this.isValidDate(date)) {
      this.addError(`Linha ${rowNumber}: Data inválida, ano não pode ser superior ao ano atual`);
      return null;
    }

    if (!this.isValidValue(value)) {
      this.addError(`Linha ${rowNumber}: Valor inválido (deve ser um número inteiro maior que zero)`);
      return null;
    }

    return {
      sai_id,
      indicator_name,
      date: this.formatDate(date),
      value
    };
  }

  parseGoal(row: ExcelJS.Row, rowNumber: number): any {
    const sai_id = row.getCell(1).value;
    const indicator_name = row.getCell(2).value;
    const year = row.getCell(3).value;
    const target_value = row.getCell(4).value;

    if (!this.isValidYear(year)) {
      this.addError(`Linha ${rowNumber}: Ano inválido (não pode ser superior ao ano atual)`);
      return null;
    }

    if (!this.isValidValue(target_value)) {
      this.addError(`Linha ${rowNumber}: Meta Anual inválida (deve ser um número inteiro maior que zero)`);
      return null;
    }

    return {
      sai_id,
      indicator_name,
      year,
      target_value
    };
  }

  formatDate(excelDate: string): string {
    const date = new Date(excelDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isValidDate(date: string): boolean {
    let parsedDate;
    if (date.includes('-')) {
      parsedDate = Date.parse(date); // Formato YYYY-MM-DD
    } else if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      parsedDate = Date.parse(`${year}-${month}-${day}`); // Formato DD/MM/YYYY convertido para YYYY-MM-DD
    } else {
      return false;
    }

    if (isNaN(parsedDate)) {
      return false;
    }

    const year = new Date(parsedDate).getFullYear();
    const currentYear = new Date().getFullYear();

    return year <= currentYear;
  }

  isValidValue(value: any): boolean {
    return typeof value === 'number' && Number.isInteger(value) && value > 0;
  }

  isValidYear(year: any): boolean {
    const currentYear = new Date().getFullYear();
    return typeof year === 'number' && year > 1900 && year <= currentYear;
  }

  addError(message: string): void {
    this.errors.push(message);
  }

  setFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
  }

  finishImport(): void {
    this.importFinished.emit();
    this.isImporting = false;
  }
}