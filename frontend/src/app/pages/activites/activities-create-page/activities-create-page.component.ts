import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { ActivitiesUpsertFormComponent } from '../../../components/activities/activities-upsert-form/activities-upsert-form.component'


@Component({
  selector: 'app-activities-create-page',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ActivitiesUpsertFormComponent
  ],
  templateUrl: './activities-create-page.component.html',
  styleUrls: ['./activities-create-page.component.scss']
})
export class ActivitiesCreatePageComponent implements OnInit { 
  ngOnInit() {
   localStorage.removeItem('activeLink');
  }
}
