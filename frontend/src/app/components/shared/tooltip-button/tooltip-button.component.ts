import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from '../tooltip/tooltip.component'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-tooltip-button',
  standalone: true,
  imports: [TooltipComponent, CommonModule],
  templateUrl: './tooltip-button.component.html',
  styleUrls: ['./tooltip-button.component.scss']
})
export class TooltipButtonComponent {
  @Input() tooltipText: string='';
  @Input() tooltipPosition: 'left' | 'right' | 'top' | 'bottom'= 'left'; // Verifique essa linha
  @Input() icon: string='';
  @Input() altText: string='';

  tooltipVisible = true; // Tooltip começa visível

  @HostBinding('class.tooltip-hidden') isTooltipHidden = false;

  onMouseEnter(): void {
    this.tooltipVisible = true;
    // this.isTooltipHidden = false;
  }

  onMouseLeave(): void {
    this.tooltipVisible = false;
    // this.isTooltipHidden = true;
  }
}