import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { SearchService } from '../../../core/services/search/search.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @Input() type!: 'activities' | 'indicators' | 'services' | 'users';
  @Output() search = new EventEmitter<any[]>();
  @Output() searchStarted = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();  // Novo evento para resetar a busca

  filterForm: FormGroup;

  constructor(private fb: FormBuilder, private searchService: SearchService) {
    this.filterForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    // Optional initialization logic
  }

  onSearch(): void {
    const term = this.filterForm.get('searchTerm')?.value;
    if (term) {
      this.searchStarted.emit();
      this.searchService.search(this.type, term).pipe(
        catchError(err => {
          console.error('Error during search:', err);
          return throwError(() => new Error('Search failed'));
        })
      ).subscribe(results => {
        this.search.emit(results);
      });
    } else {
      this.reset.emit();  // Emite o evento de reset quando o campo de busca estiver vazio
    }
  }
}
