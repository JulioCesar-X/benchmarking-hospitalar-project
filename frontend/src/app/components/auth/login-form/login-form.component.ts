import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormsModule, NgModel } from '@angular/forms';
import { LoginService } from '../../../login.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})

export class LoginFormComponent {
  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  onLogin() {
    this.loginService.login(this.email, this.password).subscribe(
      (response: any) => {
        this.router.navigate(['/consultUsers']);
      },
      error => {
        console.error('Login failed', error);
        // Handle login error (e.g., show an error message)
      }
    );
  }
}
