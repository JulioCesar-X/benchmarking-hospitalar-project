import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';

import { NotificationsListSectionComponent } from '../../../components/notifications/notifications-list-section/notifications-list-section.component';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NotificationsListSectionComponent,
    MenuComponent
    
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

}
