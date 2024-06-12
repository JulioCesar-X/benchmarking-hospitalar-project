import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { MenuComponent } from '../../components/user/menu/menu.component';
import { GoalsFilterSectionComponent } from '../../components/goals/goals-filter-section/goals-filter-section.component';
import { GoalsListSectionComponent} from '../../components/goals/goals-list-section/goals-list-section.component'
import { FooterComponent } from '../../components/ui/footer/footer.component';

@Component({
  selector: 'app-update-goals-page',
  standalone: true,
  imports: [NavbarComponent,
    MenuComponent,
    GoalsFilterSectionComponent,
    FooterComponent,
    GoalsListSectionComponent
  ],
  templateUrl: './update-goals-page.component.html',
  styleUrl: './update-goals-page.component.scss'
})
export class UpdateGoalsPageComponent {

}
