import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm, FormsModule, NgModel } from '@angular/forms';
import { LoginService } from '../../../login.service';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})

export class LoginFormComponent {
  email: string = '';
  password: string = '';
  isLoading = false;

  constructor(private loginService: LoginService, private router: Router) {}

  @Output() loginEvent = new EventEmitter<{ email: string, password: string }>();

  onLogin() {
    this.isLoading = true;
    this.loginService.login(this.email, this.password).subscribe(
      (response: any) => {
        console.log('Login successful');
        this.isLoading = false;
        this.router.navigate(['/consultUsers']);
      },
      error => {
        console.error('Login failed', error);
        this.isLoading = false;
        // Handle login error (e.g., show an error message)
      }
    );
  }
}

// import { Component, EventEmitter, Output } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { LoginService } from '../../../login.service';

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

//   constructor(private loginService: LoginService, private router: Router) { }

//   onLogin() {
//     this.loginEvent.emit({ email: this.email, password: this.password });
//   }
// }
