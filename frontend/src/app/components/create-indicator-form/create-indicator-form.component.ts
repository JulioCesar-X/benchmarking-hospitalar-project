import { Component } from '@angular/core';
import { CreateFieldModalComponent } from '../create-field-modal/create-field-modal.component'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-indicator-form',
  standalone: true,
  imports: [ CreateFieldModalComponent,
    CommonModule
  ],
  templateUrl: './create-indicator-form.component.html',
  styleUrl: './create-indicator-form.component.scss'
})
export class CreateIndicatorFormComponent {
  isModalVisible = false;

  openModal(event: Event) {
     event.preventDefault();
    this.isModalVisible = true;
  }
  closeModal() {
     this.isModalVisible = false;
   }
}
