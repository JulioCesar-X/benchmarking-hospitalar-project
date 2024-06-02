import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { ResetPasswordFormComponent } from '../../components/auth/reset-password-form/reset-password-form.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [NavbarComponent,
    FooterComponent,
    ResetPasswordFormComponent
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent {

}
