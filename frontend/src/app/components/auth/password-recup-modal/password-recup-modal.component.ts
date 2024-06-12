import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-recup-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-recup-modal.component.html',
  styleUrl: './password-recup-modal.component.scss'
})
export class PasswordRecupModalComponent {
  isError: boolean = false;
  @Input() isVisible = false;
  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.isVisible = false;
    this.closeEvent.emit();
  }

  email: string = '';

  //testar mais tarde metodos de recuperação de password!!!!
  submitEmail() {
    console.log("email para codigo de recuperaçao:", this.email)
    //logica para enviar codigo de recuperação
  }
}
