import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CreateIndicatorFormComponent } from '../../../components/indicators/create-indicator-form/create-indicator-form.component'

@Component({
  selector: 'app-create-indicators-page',
  standalone: true,
  imports: [
    MenuComponent,
    CreateIndicatorFormComponent,
  ],
  templateUrl: './create-indicators-page.component.html',
  styleUrl: './create-indicators-page.component.scss'
})
export class CreateIndicatorsPageComponent {

}
