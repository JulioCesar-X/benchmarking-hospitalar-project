import { Component } from '@angular/core';
import { MenuComponent } from '../../components/user/menu/menu.component';
import { GoalsFilterSectionComponent } from '../../components/goals/goals-filter-section/goals-filter-section.component';
import { GoalsListSectionComponent} from '../../components/goals/goals-list-section/goals-list-section.component'

@Component({
  selector: 'app-update-goals-page',
  standalone: true,
  imports: [
    MenuComponent,
    GoalsFilterSectionComponent,
    GoalsListSectionComponent
  ],
  templateUrl: './update-goals-page.component.html',
  styleUrl: './update-goals-page.component.scss'
})
export class UpdateGoalsPageComponent {

}
