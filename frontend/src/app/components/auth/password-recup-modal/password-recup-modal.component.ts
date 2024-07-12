import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-recup-modal',
  standalone: true,
  imports: [FormsModule, CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './password-recup-modal.component.html',
  styleUrls: ['./password-recup-modal.component.scss']
})
export class PasswordRecupModalComponent {
  isError: boolean = false;
  @Input() isVisible = false;
  @Output() closeEvent = new EventEmitter<void>();

  email: string = '';

  constructor(private authService: AuthService) { }

  close() {
    this.isVisible = false;
    this.closeEvent.emit();
  }

  submitEmail() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log('Email de recuperação enviado:', response);
        this.close();
      },
      error: (error) => {
        console.error('Erro ao enviar email de recuperação:', error);
        this.isError = true;
      }
    });
  }
}