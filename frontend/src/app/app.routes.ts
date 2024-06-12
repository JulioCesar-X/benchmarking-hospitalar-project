import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginPageComponent } from './pages/auth-pages/login-page/login-page.component';
import { ResetPasswordPageComponent } from './pages/auth-pages/reset-password-page/reset-password-page.component';
import { DescriptionServicePageComponent } from './pages/description-service-page/description-service-page.component';
import { ConsultUsersPageComponent } from './pages/user-pages/consult-users-page/consult-users-page.component';
import { CreateUserPageComponent } from './pages/user-pages/create-user-page/create-user-page.component';
import { UpdateIndicatorsPageComponent } from './pages/indicator-pages/update-indicators-page/update-indicators-page.component'
import { CreateIndicatorsPageComponent } from './pages/indicator-pages/create-indicators-page/create-indicators-page.component'
import { EditUserPageComponent } from './pages/user-pages/edit-user-page/edit-user-page.component'
import { ConsultDataPageComponent } from './pages/consult-data-page/consult-data-page.component'
import { UpdateGoalsPageComponent } from './pages/update-goals-page/update-goals-page.component'
import { AuthGuard } from './guards/auth.guard'
import {TesteComponent} from './teste/teste.component'


export const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'updateGoals', component: UpdateGoalsPageComponent },
  { path: 'teste', component: TesteComponent },
  { path: 'resetPassword', component: ResetPasswordPageComponent },
  { path: 'description/:serviceId', component: DescriptionServicePageComponent },
  { path: 'consultData', component: ConsultDataPageComponent },
  { path: 'consultUsers', component: ConsultUsersPageComponent, canActivate: [AuthGuard] },
  { path: 'createUser', component: CreateUserPageComponent, canActivate: [AuthGuard] },
  { path: 'editUser/:id', component: EditUserPageComponent, canActivate: [AuthGuard] },
  { path: 'updateIndicators', component: UpdateIndicatorsPageComponent, canActivate: [AuthGuard] },
  { path: 'createIndicator', component: CreateIndicatorsPageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];


