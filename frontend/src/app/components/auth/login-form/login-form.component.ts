import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgForm, FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { EventEmitter, Output } from '@angular/core';
import { PasswordRecupModalComponent } from '../../../components/auth/password-recup-modal/password-recup-modal.component'
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    PasswordRecupModalComponent,
    LoadingSpinnerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})

export class LoginFormComponent {
  isModalVisible = false;

  email: string = '';
  password: string = '';
  isLoading = false;
  errorMessage: string = '';

  constructor(private AuthService: AuthService, private router: Router) { }

  @Output() loginEvent = new EventEmitter<{ email: string, password: string }>();

  onLogin() {
    this.isLoading = true;

    this.AuthService.login(this.email, this.password).subscribe(
      (response: any) => {
        this.isLoading = false;

        if (response == null) {
          console.log('Login successful' + response);
          this.errorMessage = 'Login failed!'
        } else {
          this.errorMessage = ''
          console.log('Login successful' + response);
          this.router.navigate(['/home']);

          if(this.AuthService.getRole() == "admin" || this.AuthService.getRole() == "coordenador" ||  this.AuthService.getRole() == "root"){
            this.router.navigate(['/home']);

          }
        }
      },
      error => {
        this.errorMessage = 'Login failed!'
        console.error('Login failed', error);
        this.isLoading = false;
      }
    );
  }

  openModal(event: Event) {
    event.preventDefault();
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}