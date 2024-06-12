import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import necessary form module
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.scss'],
  standalone:true,
  imports: [CommonModule, FormsModule], // Include FormsModule here
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
}
