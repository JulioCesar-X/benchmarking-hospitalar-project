import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms'
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { LoginFormComponent } from '../../components/auth/login-form/login-form.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NavbarComponent,
    LoginFormComponent,
    FormsModule,
    FooterComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
