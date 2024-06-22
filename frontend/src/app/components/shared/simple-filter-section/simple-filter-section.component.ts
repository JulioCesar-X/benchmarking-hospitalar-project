import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-filter-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simple-filter-section.component.html',
  styleUrls: ['./simple-filter-section.component.scss']
})
export class SimpleFilterSectionComponent {
  @Output() searchEvent = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch(): void {
    console.log(`emited simple filter:`, this.searchTerm);
    
    this.searchEvent.emit(this.searchTerm);
  }
}
