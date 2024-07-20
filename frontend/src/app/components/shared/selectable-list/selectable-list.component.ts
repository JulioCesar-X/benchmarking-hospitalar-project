import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
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
  @Input() displayProperty: string | string[] = '';
  @Input() preSelectedItems: any[] = [];
  @Output() selectionChange = new EventEmitter<{ selected: any[], deselected: any[] }>();

  selectedItems: any[] = [];
  deselectedItems: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['preSelectedItems'] || changes['items']) {
      this.updateSelectionState();
    }
  }

  updateSelectionState() {
    this.selectedItems = this.items.filter(item => this.preSelectedItems.includes(item.sai_id));
    this.deselectedItems = this.items.filter(item => !this.preSelectedItems.includes(item.sai_id));
    this.selectionChange.emit({ selected: this.selectedItems, deselected: this.deselectedItems });
    console.log('items:', this.items);
    console.log('preSelectedItems:', this.preSelectedItems);
    console.log('selectedItems:', this.selectedItems);
    console.log('deselectedItems:', this.deselectedItems);
  }

  isSelected(item: any): boolean {
    return this.preSelectedItems.includes(item.sai_id);
  }

  toggleSelection(item: any): void {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem.sai_id !== item.sai_id);
      this.deselectedItems.push(item);
    } else {
      this.deselectedItems = this.deselectedItems.filter(deselectedItem => deselectedItem.sai_id !== item.sai_id);
      this.selectedItems.push(item);
    }
    this.selectionChange.emit({ selected: this.selectedItems, deselected: this.deselectedItems });
    console.log('Selected items:', this.selectedItems);
    console.log('Deselected items:', this.deselectedItems);
  }

  getDisplayText(item: any): string {
    if (Array.isArray(this.displayProperty)) {
      return this.displayProperty.map(prop => item[prop]).join(' - ');
    }
    return item[this.displayProperty];
  }
}