import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { IndicatorsListSectionComponent } from './components/ui/indicators-list-section/indicators-list-section.component';
import { IndicatorFilterSectionComponent } from './components/ui/indicator-filter-section/indicator-filter-section.component';
import { ConsultUsersPageComponent } from './pages/consult-users-page/consult-users-page.component';
import { ConfirmDeleteUserModalComponent } from './components/confirm-delete-user-modal/confirm-delete-user-modal.component';
import { UserFilterSectionComponent } from './components/ui/user-filter-section/user-filter-section.component';
import { UsersListSectionComponent } from './components/ui/users-list-section/users-list-section.component';
import { CreateUserFormComponent } from './components/create-user-form/create-user-form.component';
import { CreateFieldModalComponent } from './components/create-field-modal/create-field-modal.component';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { ResetPasswordFormComponent } from './components/auth/reset-password-form/reset-password-form.component';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { DescriptionServicePageComponent } from './pages/description-service-page/description-service-page.component';
import { AdminMenuComponent } from './components/admin/admin-menu/admin-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    IndicatorsListSectionComponent,
    IndicatorFilterSectionComponent,
    ConsultUsersPageComponent,
    ConfirmDeleteUserModalComponent,
    UserFilterSectionComponent,
    UsersListSectionComponent,
    CreateUserFormComponent,
    CreateFieldModalComponent,
    LoginFormComponent,
    ResetPasswordFormComponent,
    NavbarComponent,
    HomepageComponent,
    DescriptionServicePageComponent,
    AdminMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { }
