// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-user-filter-section',
//   standalone: true,
//   imports: [],
//   templateUrl: './user-filter-section.component.html',
//   styleUrl: './user-filter-section.component.scss'
// })
// export class UserFilterSectionComponent {

// }

// user-filter-section.component.ts
// user-filter-section.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-filter-section',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFilterSectionComponent],
  templateUrl: './user-filter-section.component.html',
  styleUrls: ['./user-filter-section.component.scss']
})
export class UserFilterSectionComponent {
  @Output() searchEvent = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch(): void {
    this.searchEvent.emit(this.searchTerm);
  }
}
