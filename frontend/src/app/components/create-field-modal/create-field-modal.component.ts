import { Component } from '@angular/core';
import { FormsModule,  } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-field-modal',
  standalone: true,
  imports: [FormsModule,
    CommonModule
  ],
  templateUrl: './create-field-modal.component.html',
  styleUrls: ['./create-field-modal.component.scss']
})
export class CreateFieldModalComponent {
  isError: boolean = false;
  restrictionType: string = 'all';
  selectedType: string = 'select';

  options: string[] = [];
  newOption: string = '';

  minLengthEnabled: boolean = false;
  maxLengthEnabled: boolean = false;
  minValueEnabled: boolean = false;
  maxValueEnabled: boolean = false;
  regexEnabled: boolean = false;


  addOption() {
    if (this.newOption.trim()) {
      this.options.push(this.newOption);
      this.newOption = ''; 
    }
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  trackByIndex(index: number, item: string): number {
    return index;
  }


  constructor() {}
}
