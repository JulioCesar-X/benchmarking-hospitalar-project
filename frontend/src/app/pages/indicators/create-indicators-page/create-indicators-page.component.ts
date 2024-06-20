import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { IndicatorsUpsertFormComponent } from '../../../components/indicators/indicators-upsert-form/indicators-upsert-form.component'

@Component({
  selector: 'app-create-indicators-page',
  standalone: true,
  imports: [
    MenuComponent,
    IndicatorsUpsertFormComponent
  ],
  templateUrl: './create-indicators-page.component.html',
  styleUrl: './create-indicators-page.component.scss'
})
export class CreateIndicatorsPageComponent {

}
