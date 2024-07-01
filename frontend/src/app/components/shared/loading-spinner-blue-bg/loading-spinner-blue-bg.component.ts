import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner-blue-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner-blue-bg.component.html',
  styleUrl: './loading-spinner-blue-bg.component.scss'
})
export class LoadingSpinnerBlueBGComponent {
  @Input() message: string = 'Carregando...';
}
