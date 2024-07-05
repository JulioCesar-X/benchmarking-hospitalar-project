import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() position: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() visible: boolean = true;

  getTransform(position: 'left' | 'right' | 'top' | 'bottom'): string {
    switch (position) {
      case 'left':
      case 'right':
        return 'translateY(-50%)';
      case 'top':
      case 'bottom':
        return 'translateX(-50%)';
      default:
        return '';
    }
  }

}