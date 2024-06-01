import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DescriptionServicePageComponent } from './pages/description-service-page/description-service-page.component';
import { ConsultUsersPageComponent } from './pages/user-pages/consult-users-page/consult-users-page.component';
import { CreateUserPageComponent } from './pages/user-pages/create-user-page/create-user-page.component';
import { UpdateIndicatorsPageComponent } from './pages/indicator-pages/update-indicators-page/update-indicators-page.component'
import { CreateIndicatorsPageComponent } from './pages/indicator-pages/create-indicators-page/create-indicators-page.component'
import { authGuard } from './guards/auth.guard'


//o canActivate é um guard que verifica se o user esta com login feito antes de avançar
//utilizar canMatch para a rota dos results que redireciona para a pagina de description?
//basicamente canMatch é 2 rotas iguais (home e home por exemplo), mas que renderizam componentes
//diferentes condicionalmente
export const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'description/:serviceId', component: DescriptionServicePageComponent },
  { path: 'consultUsers', component: ConsultUsersPageComponent, canActivate: [authGuard] },
  { path: 'createUser', component: CreateUserPageComponent, canActivate: [authGuard] },
  { path: 'updateIndicators', component: UpdateIndicatorsPageComponent, canActivate: [authGuard] },
  { path: 'createIndicator', component: CreateIndicatorsPageComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];


