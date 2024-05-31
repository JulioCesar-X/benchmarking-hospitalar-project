import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { AdminMenuComponent } from '../../components/admin/admin-menu/admin-menu.component';
import {CreateIndicatorFormComponent} from '../../components/create-indicator-form/create-indicator-form.component'
import { FooterComponent } from '../../components/ui/footer/footer.component';

@Component({
  selector: 'app-create-indicators-page',
  standalone: true,
  imports: [
    NavbarComponent,
    AdminMenuComponent,
    CreateIndicatorFormComponent,
    FooterComponent
  ],
  templateUrl: './create-indicators-page.component.html',
  styleUrl: './create-indicators-page.component.scss'
})
export class CreateIndicatorsPageComponent {

}
