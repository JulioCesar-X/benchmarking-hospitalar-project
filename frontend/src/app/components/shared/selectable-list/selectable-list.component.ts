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
  @Input() displayProperty: string = 'name';
  @Input() preSelectedItems: number[] = [];
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedItems: any[] = [];

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preSelectedItems'] && this.items.length) {
      this.selectedItems = this.items.filter(item => this.preSelectedItems.includes(item.id));
      this.selectionChange.emit(this.selectedItems);
      this.cdRef.detectChanges(); // Manually trigger change detection after the items have changed
    }
  }

  toggleSelection(item: any): void {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.selectionChange.emit(this.selectedItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }
}
