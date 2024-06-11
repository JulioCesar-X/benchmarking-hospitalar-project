import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { NavbarComponent } from '../../../components/ui/navbar/navbar.component';
import { LoginFormComponent } from '../../../components/auth/login-form/login-form.component';
import { FooterComponent } from '../../../components/ui/footer/footer.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NavbarComponent,
    LoginFormComponent,
    FormsModule,
    FooterComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
// import { LoginFormComponent } from '../../components/auth/login-form/login-form.component';
// import { FooterComponent } from '../../components/ui/footer/footer.component';

// @Component({
//   selector: 'app-login-page',
//   standalone: true,
//   imports: [
//     CommonModule,
//     NavbarComponent,
//     LoginFormComponent,
//     FooterComponent
//   ],
//   templateUrl: './login-page.component.html',
//   styleUrls: ['./login-page.component.scss']
// })
// export class LoginPageComponent {
//   isLoading = false;


//   constructor(private http: HttpClient) { }

//   login(email: string, password: string) {
//     this.isLoading = true;
//     const url = 'https://benchmarking-hospitalar-project.onrender.com/login';
//     const body = { email, password };

//     this.http.post(url, body).subscribe(
//       response => {
//         this.isLoading = false;
//         console.log('Login bem-sucedido:', response);
//       },
//       error => {
//         this.isLoading = false;
//         console.error('Erro de login:', error);
//       }
//     );
//   }
//}
