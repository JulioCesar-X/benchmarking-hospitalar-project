import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { IndicatorsUpsertFormComponent } from '../../../components/indicators/indicators-upsert-form/indicators-upsert-form.component'


@Component({
  selector: 'app-update-indicators-page',
  standalone: true,
  imports: [    MenuComponent,
    IndicatorsUpsertFormComponent],
  templateUrl: './update-indicators-page.component.html',
  styleUrl: './update-indicators-page.component.scss'
})
export class UpdateIndicatorsPageComponent {

}
