import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { SearchService } from '../../../core/services/search/search.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [ReactiveFormsModule, MatTooltipModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchFilterComponent {
  @Input() type!: 'activities' | 'indicators' | 'services' | 'users';
  @Output() search = new EventEmitter<any[]>();
  @Output() searchStarted = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private loggingService: LoggingService
  ) {
    this.filterForm = this.fb.group({
      searchTerm: ['']
    });
  }

  onSearch(): void {
    const term = this.filterForm.get('searchTerm')?.value;
    if (term) {
      this.searchStarted.emit();
      this.searchService.search(this.type, term).pipe(
        catchError(err => {
          this.loggingService.error('Error during search:', err);
          return throwError(() => new Error('Search failed'));
        })
      ).subscribe(results => {
        this.loggingService.info('Search results:', results);
        this.search.emit(results);
      });
    } else {
      this.reset.emit();
    }
  }
}