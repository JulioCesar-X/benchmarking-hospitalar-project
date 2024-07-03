import { Component, HostListener, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef   } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    RouterModule,
    FooterComponent,
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // to accept lordIcon element in the component
})
export class AppComponent {

  constructor(private cdr: ChangeDetectorRef) {}

  toTopBtnVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const threshold = 200; // Change this to set a different scroll threshold
    this.toTopBtnVisible = window.scrollY > threshold;
    this.cdr.detectChanges(); // Manually trigger change detection

    console.log(this.toTopBtnVisible)
    console.log("t:", threshold,"w", window.scrollY)
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
