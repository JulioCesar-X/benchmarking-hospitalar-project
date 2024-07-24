import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-association-list',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatCheckbox],
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssociationListComponent implements OnChanges {
  @Input({ required: true}) componentTitle = 'Title';
  @Input() items: any[] = [];
  @Input() displayProperties: string[] = [];
  @Input() preSelectedItems: any[] = [];
  @Input() columnTitle: string = '';
  @Output() selectionChange = new EventEmitter<{ selected: any[], deselected: any[] }>();

  selectedItems: any[] = [];
  deselectedItems: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['preSelectedItems'] || changes['items']) {
      this.updateSelectionState();
    }
  }

  updateSelectionState() {
    this.selectedItems = this.items.filter(item => this.preSelectedItems.includes(item.id));
    this.deselectedItems = this.items.filter(item => !this.preSelectedItems.includes(item.id));
    console.log('updateSelectionState -> selectedItems:', this.selectedItems);
    console.log('updateSelectionState -> deselectedItems:', this.deselectedItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.id === item.id);
  }

  toggleSelection(item: any): void {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem.id !== item.id);
      this.deselectedItems.push(item);
    } else {
      this.deselectedItems = this.deselectedItems.filter(deselectedItem => deselectedItem.id !== item.id);
      this.selectedItems.push(item);
    }
    this.selectionChange.emit({ selected: this.selectedItems, deselected: this.deselectedItems });
    console.log('toggleSelection -> selectedItems:', this.selectedItems);
    console.log('toggleSelection -> deselectedItems:', this.deselectedItems);
  }

  getDisplayText(item: any): string {
    return this.displayProperties.map(prop => item[prop]).join(' - ');
  }
}