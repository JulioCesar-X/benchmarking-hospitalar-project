import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DescriptionServicePageComponent } from './pages/description-service-page/description-service-page.component';
import { ConsultUsersPageComponent } from './pages/consult-users-page/consult-users-page.component';
import { CreateUserPageComponent } from './pages/create-user-page/create-user-page.component';
import { UpdateIndicatorsPageComponent } from './pages/update-indicators-page/update-indicators-page.component'

export const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'description', component: DescriptionServicePageComponent },
  { path: 'consultUsers', component: ConsultUsersPageComponent },
  { path: 'createUser', component: CreateUserPageComponent },
  { path: 'updateIndicators', component: UpdateIndicatorsPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
