import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
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

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      console.error('No worksheet found');
      this.importFinished.emit();
      this.isImporting = false;
      return;
    }

    const records: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 6) { // Ajuste para a linha correta dos dados
        const record = this.importType === 'record' ? this.parseRecord(row) : this.parseGoal(row);
        records.push(record);
      }
    });

    this.recordsImported.emit(records);
    this.importFinished.emit();
    this.isImporting = false;
  }

  parseRecord(row: ExcelJS.Row): any {
    return {
      sai_id: row.getCell(1).value,
      indicator_name: row.getCell(2).value,
      date: this.formatDate(row.getCell(3).value?.toString() || ''),
      value: row.getCell(4).value
    };
  }

  parseGoal(row: ExcelJS.Row): any {
    return {
      sai_id: row.getCell(1).value,
      indicator_name: row.getCell(2).value,
      year: row.getCell(3).value,
      target_value: row.getCell(4).value
    };
  }

  formatDate(excelDate: string): string {
    const date = new Date(excelDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}