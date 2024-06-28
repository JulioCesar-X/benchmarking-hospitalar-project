import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { IndicatorsUpsertFormComponent } from '../../../components/indicators/indicators-upsert-form/indicators-upsert-form.component';

@Component({
  selector: 'app-indicators-create-page',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    IndicatorsUpsertFormComponent
  ],
  templateUrl: './indicators-create-page.component.html',
  styleUrls: ['./indicators-create-page.component.scss']
})
export class IndicatorsCreatePageComponent { }
