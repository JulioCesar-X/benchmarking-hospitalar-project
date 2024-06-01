import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/ui/navbar/navbar.component';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CreateIndicatorFormComponent } from '../../../components/indicator/create-indicator-form/create-indicator-form.component'
import { FooterComponent } from '../../../components/ui/footer/footer.component';

@Component({
  selector: 'app-create-indicators-page',
  standalone: true,
  imports: [
    NavbarComponent,
    MenuComponent,
    CreateIndicatorFormComponent,
    FooterComponent
  ],
  templateUrl: './create-indicators-page.component.html',
  styleUrl: './create-indicators-page.component.scss'
})
export class CreateIndicatorsPageComponent {

}
