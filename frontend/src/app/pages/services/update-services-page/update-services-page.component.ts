import { Component , OnInit} from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../../components/shared/filter/filter.component'
import { ServiceUpsertFormComponent } from '../../../components/services/service-upsert-form/service-upsert-form.component'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-services-page',
  standalone: true,
  imports: [
    FilterComponent,
    MenuComponent,
    ServiceUpsertFormComponent
  ],
  templateUrl: './update-services-page.component.html',
  styleUrl: './update-services-page.component.scss'
})
export class UpdateServicesPageComponent {
  serviceId!: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === null) {
      console.error('Service ID is missing');
      // Redirecionar usuário ou mostrar uma mensagem de erro
    } else {
      this.serviceId = parseInt(id, 10);
    }
  }
}


