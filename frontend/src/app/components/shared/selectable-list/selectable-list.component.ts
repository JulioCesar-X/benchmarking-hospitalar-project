import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selectable-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selectable-list.component.html',
  styleUrls: ['./selectable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectableListComponent implements OnChanges {
  @Input() items: any[] = [];
  @Input() displayProperty: string | string[] = 'name';
  @Input() preSelectedItems: number[] = [];
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedItems: any[] = [];

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preSelectedItems']) {
      this.updateSelectedItems();
    }
  }

  private updateSelectedItems(): void {
    const newSelectedItems = this.items.filter(item => this.preSelectedItems.includes(item.id));
    if (this.haveSelectedItemsChanged(newSelectedItems)) {
      this.selectedItems = newSelectedItems;
      this.selectionChange.emit(this.selectedItems);
      this.cdRef.detectChanges(); // Manually trigger change detection after the items have changed
    }
  }

  private haveSelectedItemsChanged(newSelectedItems: any[]): boolean {
    if (newSelectedItems.length !== this.selectedItems.length) {
      return true;
    }
    const currentSelectedIds = this.selectedItems.map(item => item.id).sort();
    const newSelectedIds = newSelectedItems.map(item => item.id).sort();
    return !currentSelectedIds.every((id, index) => id === newSelectedIds[index]);
  }

  toggleSelection(item: any): void {
    const index = this.selectedItems.findIndex(selected => selected.id === item.id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.selectionChange.emit(this.selectedItems);
    this.cdRef.detectChanges(); // Ensure the changes are reflected in the view
  }

  isSelected(item: any): boolean {
    return this.selectedItems.some(selected => selected.id === item.id);
  }

  getDisplayText(item: any): string {
    if (Array.isArray(this.displayProperty)) {
      return this.displayProperty.map(prop => item[prop]).join(' - ');
    }
    return item[this.displayProperty];
  }
}