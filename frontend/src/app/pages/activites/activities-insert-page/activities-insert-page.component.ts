import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CommonModule } from '@angular/common';
import {ActivitiesUpsertFormComponent} from '../../../components/activities/activities-upsert-form/activities-upsert-form.component'


@Component({
  selector: 'app-activities-insert-page',
  standalone: true,
  imports: [  CommonModule, MenuComponent,
    ActivitiesUpsertFormComponent
    ],
  templateUrl: './activities-insert-page.component.html',
  styleUrl: './activities-insert-page.component.scss'
})
export class ActivitiesInsertPageComponent {

}
