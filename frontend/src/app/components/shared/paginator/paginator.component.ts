import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() length = 50;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions = [5, 10, 20, 50, 100];
  @Output() page = new EventEmitter<PageEvent>();


  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: any;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.page.emit(e); // quando isso esta aqui o problema acontece
    console.log("pageEvent", e);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  
  onPageChange(event: PageEvent): void {
    console.log("fff>>>", event);
    this.page.emit(event);

  }
}





