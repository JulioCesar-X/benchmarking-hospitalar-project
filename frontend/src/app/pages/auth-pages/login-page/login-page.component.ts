import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { LoginFormComponent } from '../../../components/auth/login-form/login-form.component';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [

    LoginFormComponent,
    FormsModule,

  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
