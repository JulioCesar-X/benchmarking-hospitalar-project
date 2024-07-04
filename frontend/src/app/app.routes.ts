import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginPageComponent } from './pages/auth-pages/login-page/login-page.component';
import { ResetPasswordPageComponent } from './pages/auth-pages/reset-password-page/reset-password-page.component';
import { ServicesDescriptionPageComponent } from './pages/services/services-description-page/services-description-page.component';
import { UsersPageComponent } from './pages/user/users-page/users-page.component';
import { UserCreatePageComponent } from './pages/user/user-create-page/user-create-page.component';
import { RecordsGoalsUpdatePageComponent } from './pages/records/recordsGoals-update-page/recordsGoals-update-page.component'

import { UserUpdatePageComponent } from './pages/user/user-update-page/user-update-page.component'
import { ChartsPageComponent } from './pages/charts-page/charts-page.component'


import { AuthGuard } from './core/guards/auth.guard';

//indicators
import { IndicatorsPageComponent } from './pages/indicators/indicators-page/indicators-page.component';
import { IndicatorsCreatePageComponent } from './pages/indicators/indicators-create-page/indicators-create-page.component'
import { IndicatorsUpdatePageComponent } from './pages/indicators/indicators-update-page/indicators-update-page.component'
//activities
import { ActivitiesPageComponent } from './pages/activites/activities-page/activities-page.component'
import { ActivitiesCreatePageComponent } from './pages/activites/activities-create-page/activities-create-page.component'
import { ActivitiesUpdatePageComponent } from './pages/activites/activities-update-page/activities-update-page.component'
//services
import { ServicesPageComponent } from './pages/services/services-page/services-page.component'
import { ServicesCreatePageComponent } from './pages/services/services-create-page/services-create-page.component'
import { ServicesUpdatePageComponent } from './pages/services/services-update-page/services-update-page.component'
//notifications
import { NotificationsComponent } from './pages/notifications/notifications-page/notifications.component';
import { NotificationsCreatePageComponent } from './pages/notifications/notifications-create-page/notifications-create-page.component';

export const routes: Routes = [
  { path: 'home', component: HomepageComponent },

  //Rotas Auth
  { path: 'login', component: LoginPageComponent },
  { path: 'resetPassword', component: ResetPasswordPageComponent },

  //Rotas Users
  {
    path: 'users',
    children: [
      { path: '', component: UsersPageComponent, canActivate: [AuthGuard] },
      { path: 'create', component: UserCreatePageComponent, },
      { path: 'update/:id', component: UserUpdatePageComponent, canActivate: [AuthGuard] },
    ]
    //nao esquecer de colocar os guards nas rotas
  },

  //activities
  {
    path: 'activities',
    children: [
      { path: '', component: ActivitiesPageComponent },
      { path: 'create', component: ActivitiesCreatePageComponent },
      { path: 'update/:id', component: ActivitiesUpdatePageComponent },
    ]
  },

  //Services
  {
    path: 'services',
    children: [
      { path: '', component: ServicesPageComponent },
      { path: 'create', component: ServicesCreatePageComponent },
      { path: 'update/:id', component: ServicesUpdatePageComponent },
    ]
  },

  //Rotas indicadores
  {
    path: 'indicators',
    children: [
      { path: '', component: IndicatorsPageComponent },
      { path: 'create', component: IndicatorsCreatePageComponent },
      { path: 'update/:id', component: IndicatorsUpdatePageComponent },
    ]
  },

  { path: 'description/:serviceId', component: ServicesDescriptionPageComponent },

  { path: 'charts', component: ChartsPageComponent, canActivate: [AuthGuard] },
   { path: 'RecordGoalsUpdate', component: RecordsGoalsUpdatePageComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },


  //Rotas notificações
  {
    path: 'notifications',
    children: [
      { path: '', component: NotificationsComponent },
      { path: 'create', component: NotificationsCreatePageComponent },
    ]
  },

];


