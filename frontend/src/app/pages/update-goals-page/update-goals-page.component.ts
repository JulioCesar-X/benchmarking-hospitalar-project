import { Component } from '@angular/core';
import { MenuComponent } from '../../components/user/menu/menu.component';
import { GoalsListSectionComponent} from '../../components/goals/goals-list-section/goals-list-section.component'

@Component({
  selector: 'app-update-goals-page',
  standalone: true,
  imports: [
    MenuComponent,
    GoalsListSectionComponent
  ],
  templateUrl: './update-goals-page.component.html',
  styleUrl: './update-goals-page.component.scss'
})
export class UpdateGoalsPageComponent {

}
