import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';

@Component({
  selector: 'app-description-service-page',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './description-service-page.component.html',
  styleUrl: './description-service-page.component.scss'
})
export class DescriptionServicePageComponent {

}
