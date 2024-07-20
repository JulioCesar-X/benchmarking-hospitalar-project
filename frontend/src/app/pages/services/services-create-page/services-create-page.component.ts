import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { ServicesUpsertFormComponent } from '../../../components/services/services-upsert-form/services-upsert-form.component'

@Component({
  selector: 'app-services-create-page',
  standalone: true,
  imports: [
    MenuComponent,
    ServicesUpsertFormComponent
  ],
  templateUrl: './services-create-page.component.html',
  styleUrl: './services-create-page.component.scss'
})
export class ServicesCreatePageComponent {

}
