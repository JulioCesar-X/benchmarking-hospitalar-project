import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-desassociation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatCheckboxModule],
  templateUrl: './desassociation-list.component.html',
  styleUrls: ['./desassociation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesassociationListComponent implements OnChanges {
  @Input() items: any[] = [];
  @Input() displayProperties: string[] = [];
  @Input() columnTitles: { [key: string]: string } = {};
  @Input() preSelectedItems: any[] = [];
  @Input() desassociations: { sai_id: number }[] = [];
  @Output() selectionChange = new EventEmitter<{ selected: any[], deselected: any[] }>();

  displayedColumns: string[] = ['select'];
  dataSource = new MatTableDataSource<any>(this.items);
  selection = new SelectionModel<any>(true, []);

  selectedItems: any[] = [];
  deselectedItems: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.dataSource.data = this.items;
    }
    if (changes['displayProperties']) {
      this.displayedColumns = ['select', ...this.displayProperties];
    }
    if (changes['preSelectedItems'] || changes['items'] || changes['desassociations']) {
      this.updateSelectionState();
    }
  }

  updateSelectionState() {
    const desassociatedIds = new Set(this.desassociations.map(d => d.sai_id));
    this.selectedItems = this.items.filter(item => !desassociatedIds.has(item.sai_id) && this.preSelectedItems.includes(item.sai_id));
    this.deselectedItems = this.items.filter(item => desassociatedIds.has(item.sai_id));
    this.selection.clear();
    this.selectedItems.forEach(item => this.selection.select(item));
    console.log('updateSelectionState -> selectedItems:', this.selectedItems);
    console.log('updateSelectionState -> deselectedItems:', this.deselectedItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.sai_id === item.sai_id);
  }

  toggleSelection(item: any): void {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem.sai_id !== item.sai_id);
      this.desassociations.push({ sai_id: item.sai_id });
    } else {
      this.desassociations = this.desassociations.filter(deselectedItem => deselectedItem.sai_id !== item.sai_id);
      this.selectedItems.push(item);
    }
    this.selectionChange.emit({ selected: this.selectedItems, deselected: this.desassociations });
    console.log('toggleSelection -> selectedItems:', this.selectedItems);
    console.log('toggleSelection -> desassociations:', this.desassociations);
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedItems = [];
      this.desassociations = this.items.map(item => ({ sai_id: item.sai_id }));
    } else {
      this.selection.select(...this.dataSource.data);
      this.selectedItems = [...this.dataSource.data];
      this.desassociations = [];
    }
    this.selectionChange.emit({ selected: this.selectedItems, deselected: this.desassociations });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.isSelected(row) ? 'deselect' : 'select'} row ${row.sai_id}`;
  }

  trackByFn(index: number, item: any): any {
    return item.sai_id; // or any unique property from the item object
  }
}