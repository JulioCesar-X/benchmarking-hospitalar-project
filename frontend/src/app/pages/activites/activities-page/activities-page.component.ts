import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../../components/shared/filter/filter.component'
import {ActivitiesListSectionComponent} from '../../../components/activities/activities-list-section/activities-list-section.component'

@Component({
  selector: 'app-activities-page',
  standalone: true,
  imports: [    CommonModule, MenuComponent,
    FilterComponent,
    ActivitiesListSectionComponent],
  templateUrl: './activities-page.component.html',
  styleUrl: './activities-page.component.scss'
})
export class ActivitiesPageComponent {

}
