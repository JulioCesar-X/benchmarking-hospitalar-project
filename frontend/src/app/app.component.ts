import { Component, HostListener, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { LoggingService } from './core/services/logging.service';

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {

  constructor(private cdr: ChangeDetectorRef, private loggingService: LoggingService) { }

  toTopBtnVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const threshold = 300;
    this.toTopBtnVisible = window.scrollY > threshold;
    this.cdr.detectChanges();

    this.loggingService.log('Scroll position:', window.scrollY, 'Button visible:', this.toTopBtnVisible);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loggingService.log('Scroll to top initiated');
  }
}