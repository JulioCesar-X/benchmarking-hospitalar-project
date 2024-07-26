import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginPageComponent } from './pages/auth-pages/login-page/login-page.component';
import { ResetPasswordPageComponent } from './pages/auth-pages/reset-password-page/reset-password-page.component';
import { ServicesDescriptionPageComponent } from './pages/services/services-description-page/services-description-page.component';
import { UsersPageComponent } from './pages/user/users-page/users-page.component';
import { UserCreatePageComponent } from './pages/user/user-create-page/user-create-page.component';
import { RecordsGoalsUpdatePageComponent } from './pages/records/recordsGoals-update-page/recordsGoals-update-page.component';
import { UserUpdatePageComponent } from './pages/user/user-update-page/user-update-page.component';
import { ChartsPageComponent } from './pages/charts-page/charts-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ChartDataResolver } from './core/resolvers/chart-data.resolver';
import { NotificationsResolver } from './core/resolvers/notifications-resolver';

//indicators
import { IndicatorsPageComponent } from './pages/indicators/indicators-page/indicators-page.component';
import { IndicatorsCreatePageComponent } from './pages/indicators/indicators-create-page/indicators-create-page.component';
import { IndicatorsUpdatePageComponent } from './pages/indicators/indicators-update-page/indicators-update-page.component';
//activities
import { ActivitiesPageComponent } from './pages/activites/activities-page/activities-page.component';
import { ActivitiesCreatePageComponent } from './pages/activites/activities-create-page/activities-create-page.component';
import { ActivitiesUpdatePageComponent } from './pages/activites/activities-update-page/activities-update-page.component';
//services
import { ServicesPageComponent } from './pages/services/services-page/services-page.component';
import { ServicesCreatePageComponent } from './pages/services/services-create-page/services-create-page.component';
import { ServicesUpdatePageComponent } from './pages/services/services-update-page/services-update-page.component';
//notifications
import { NotificationsComponent } from './pages/notifications/notifications-page/notifications.component';
import { NotificationsCreatePageComponent } from './pages/notifications/notifications-create-page/notifications-create-page.component';
import { PasswordRecupModalComponent } from './components/auth/password-recup-modal/password-recup-modal.component';
import { RecordsGoalsUpdateResolver } from './core/resolvers/records-goals-update.resolver';

export const routes: Routes = [
  {
    path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: PasswordRecupModalComponent },
  { path: 'reset-password', component: ResetPasswordPageComponent },
  {
    path: 'users',
    children: [
      { path: '', component: UsersPageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', ''] } },
      { path: 'create', component: UserCreatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
      { path: 'update/:id', component: UserUpdatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin'] } },
    ]
  },
  {
    path: 'activities',
    children: [
      { path: '', component: ActivitiesPageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
      { path: 'create', component: ActivitiesCreatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
      { path: 'update/:id', component: ActivitiesUpdatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
    ]
  },
  {
    path: 'services',
    children: [
      { path: '', component: ServicesPageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
      { path: 'create', component: ServicesCreatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
      { path: 'update/:id', component: ServicesUpdatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
    ]
  },
  {
    path: 'indicators',
    children: [
      { path: '', component: IndicatorsPageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
      { path: 'create', component: IndicatorsCreatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
      { path: 'update/:id', component: IndicatorsUpdatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
    ]
  },
  { path: 'description/:serviceId', component: ServicesDescriptionPageComponent },
  {
    path: 'charts',
    component: ChartsPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['root', 'admin', 'coordenador'], reuse: false },
    resolve: { chartData: ChartDataResolver },
  },
  {
    path: 'user-charts',
    component: ChartsPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['user'], reuse: false },
    resolve: { chartData: ChartDataResolver },
  },
  {
    path: 'record-goals-update',
    component: RecordsGoalsUpdatePageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['root', 'admin', 'coordenador'] },
    resolve: { recordGoalsData: RecordsGoalsUpdateResolver }
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  //Rotas notificações
  {
    path: 'notifications',
    children: [
      {
        path: '', component: NotificationsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] }
      },
      { path: 'create', component: NotificationsCreatePageComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['root', 'admin', 'coordenador'] } },
    ]
  },
];