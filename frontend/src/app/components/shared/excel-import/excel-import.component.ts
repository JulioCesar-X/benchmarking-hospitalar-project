import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.scss']
})
export class ExcelImportComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @Output() recordsImported = new EventEmitter<any[]>();
  @Input() importType: 'record' | 'goal' = 'record';

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
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      console.error('No worksheet found');
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
  }

  parseRecord(row: ExcelJS.Row): any {
    return {
      sai_id: row.getCell(1).value,
      indicator_name: row.getCell(2).value,
      date: row.getCell(3).value,
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
}