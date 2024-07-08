import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { NotificationsCreateFormComponent } from '../../../components/notifications/notifications-create-form/notifications-create-form.component';

@Component({
  selector: 'app-notifications-create-page',
  standalone: true,
  imports: [MenuComponent, NotificationsCreateFormComponent],
  templateUrl: './notifications-create-page.component.html',
  styleUrl: './notifications-create-page.component.scss'
})
export class NotificationsCreatePageComponent {

}
