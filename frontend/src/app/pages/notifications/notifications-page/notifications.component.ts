import { Component } from '@angular/core';

import { NotificationsListSectionComponent } from '../../../components/notifications/notifications-list-section/notifications-list-section.component';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NotificationsListSectionComponent,
    
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

}
