import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgForm, FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { EventEmitter, Output } from '@angular/core';
import { LoadingSpinnerBlueBGComponent } from '../../shared/loading-spinner-blue-bg/loading-spinner-blue-bg.component';
import { PasswordRecupModalComponent } from '../../../components/auth/password-recup-modal/password-recup-modal.component'

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    PasswordRecupModalComponent,
    LoadingSpinnerBlueBGComponent
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
          this.router.navigate(['/consultUsers']);

          if(this.AuthService.getRole() == "admin" || this.AuthService.getRole() == "coordenador"){
            this.router.navigate(['/users']);
          }
           else {
            this.router.navigate(['/home']);
          }
        }
      },
      error => {
        console.error('Login failed', error);
        this.isLoading = false;

        // Handle login error (e.g., show an error message)
      }
    );
  }


  sendPasswordRecoveryCode(){

  }

  openModal(event: Event) {
    event.preventDefault();
    this.isModalVisible = true;
}

closeModal() {
    this.isModalVisible = false;
}
}

// import { Component, EventEmitter, Output } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../../login.service';

// @Component({
//   selector: 'app-login-form',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './login-form.component.html',
//   styleUrls: ['./login-form.component.scss']
// })
// export class LoginFormComponent {
//   @Output() loginEvent = new EventEmitter<{ email: string, password: string }>();

//   email: string = '';
//   password: string = '';

//   constructor(private AuthService: AuthService, private router: Router) { }

//   onLogin() {
//     this.loginEvent.emit({ email: this.email, password: this.password });
//   }
// }
