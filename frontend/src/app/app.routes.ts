import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginPageComponent } from './pages/auth-pages/login-page/login-page.component';
import { ResetPasswordPageComponent } from './pages/auth-pages/reset-password-page/reset-password-page.component';
import { DescriptionServicePageComponent } from './pages/description-service-page/description-service-page.component';
import { ConsultUsersPageComponent } from './pages/user-pages/consult-users-page/consult-users-page.component';
import { CreateUserPageComponent } from './pages/user-pages/create-user-page/create-user-page.component';
import { RecordsGoalsUpdatePageComponent } from './pages/records/update-records-page/update-recordsGoals-page.component'

import { EditUserPageComponent } from './pages/user-pages/edit-user-page/edit-user-page.component'
import { ConsultDataPageComponent } from './pages/consult-data-page/consult-data-page.component'


import { AuthGuard } from './guards/auth.guard'
import {TesteComponent} from './teste/teste.component'

//indicators
import {IndicatorsListPageComponent} from './pages/indicators/indicators-list-page/indicators-list-page.component';
import { CreateIndicatorsPageComponent } from './pages/indicators/create-indicators-page/create-indicators-page.component'
import { UpdateIndicatorsPageComponent } from './pages/indicators/update-indicators-page/update-indicators-page.component'
//activities
import { ActivitiesPageComponent } from './pages/activites/activities-page/activities-page.component'
import { ActivitiesCreatePageComponent } from './pages/activites/activities-create-page/activities-create-page.component'
import { ActivitiesInsertPageComponent } from './pages/activites/activities-insert-page/activities-insert-page.component'
//services
import {ServicesPageComponent} from './pages/services/services-page/services-page.component'
import {CreateServicesPageComponent} from './pages/services/create-services-page/create-services-page.component'
import {UpdateServicesPageComponent} from './pages/services/update-services-page/update-services-page.component'


export const routes: Routes = [
  { path: 'home', component: HomepageComponent },

  //Rotas Auth
  { path: 'login', component: LoginPageComponent },
  { path: 'resetPassword', component: ResetPasswordPageComponent },



  //Rotas Users
  { path: 'consultUsers', component: ConsultUsersPageComponent, canActivate: [AuthGuard] },
  { path: 'createUser', component: CreateUserPageComponent, canActivate: [AuthGuard] },
  { path: 'editUser/:id', component: EditUserPageComponent, canActivate: [AuthGuard] },
//nao esquecer de colocar os guards nas rotas
  //activities
  {
    path: 'activities',
    children: [
      { path: '', component: ActivitiesPageComponent },
      { path: 'create', component: ActivitiesCreatePageComponent },
      { path: 'update/:id', component: ActivitiesInsertPageComponent },
    ]
  },
  //Services
  {
    path: 'services',
    children: [
      { path: '', component: ServicesPageComponent },
      { path: 'create', component: CreateServicesPageComponent },
      { path: 'update/:id', component: UpdateServicesPageComponent },
    ]
  },
    //Rotas indicadores
    {
      path: 'indicators',
      children: [
        { path: '', component: IndicatorsListPageComponent },
        { path: 'create', component: CreateIndicatorsPageComponent },
        { path: 'update/:id', component: UpdateIndicatorsPageComponent },
      ]
    },




  { path: 'description/:serviceId', component: DescriptionServicePageComponent },



  { path: 'teste', component: TesteComponent },
  { path: 'consultData', component: ConsultDataPageComponent },

  { path: 'RecordGoalsUpdate', component: RecordsGoalsUpdatePageComponent, canActivate: [AuthGuard] },


  { path: '', redirectTo: 'home', pathMatch: 'full' }
];


