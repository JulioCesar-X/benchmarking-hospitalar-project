import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-desassociation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desassociation-list.component.html',
  styleUrls: ['./desassociation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesassociationListComponent implements OnChanges {
  @Input() items: any[] = [];
  @Input() displayProperty: string | string[] = '';
  @Input() preSelectedItems: any[] = [];
  @Input() desassociations: { sai_id: number }[] = [];
  @Output() selectionChange = new EventEmitter<{ selected: any[], deselected: any[] }>();

  selectedItems: any[] = [];
  deselectedItems: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['preSelectedItems'] || changes['items'] || changes['desassociations']) {
      this.updateSelectionState();
    }
  }

  updateSelectionState() {
    const desassociatedIds = new Set(this.desassociations.map(d => d.sai_id));
    this.selectedItems = this.items.filter(item => !desassociatedIds.has(item.sai_id) && this.preSelectedItems.includes(item.sai_id));
    this.deselectedItems = this.items.filter(item => desassociatedIds.has(item.sai_id));
    console.log('updateSelectionState -> selectedItems:', this.selectedItems);
    console.log('updateSelectionState -> deselectedItems:', this.deselectedItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.sai_id === item.sai_id);
  }

  toggleSelection(item: any): void {
    const desassociatedIds = new Set(this.desassociations.map(d => d.sai_id));
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

  getDisplayText(item: any): string {
    if (Array.isArray(this.displayProperty)) {
      return this.displayProperty.map(prop => item[prop]).join(' - ');
    }
    return item[this.displayProperty];
  }

  trackByFn(index: number, item: any): any {
    return item.sai_id; // or any unique property from the item object
  }
}