import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import necessary form module
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FilterComponent} from '../components/shared/filter/filter.component'
import { Filter } from '../models/Filter.model';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.scss'],
  standalone:true,
  imports: [CommonModule,
     FormsModule,
     FilterComponent], // Include FormsModule here
  animations: [
    trigger('dropdownAnimation', [
      state('open', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('closed', style({
        opacity: 0,
        transform: 'scale(0.95)'
      })),
      transition('closed => open', [
        animate('100ms ease-out')
      ]),
      transition('open => closed', [
        animate('75ms ease-in')
      ]),
    ])
  ]
})
export class TesteComponent {
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  /*  */
  selectedTab: string = 'Records';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  filterData(filter: Filter){
    //this is the function that receives the filter and filters the data
  }
}
