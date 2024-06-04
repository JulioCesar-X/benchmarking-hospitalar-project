import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-data-graphic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-graphic.component.html',
  styleUrl: './data-graphic.component.scss'
})
export class DataGraphicComponent {
  @Input() data: { amount: number, day: string }[] = [];
  totalSpent: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.data.forEach(element => {
      this.totalSpent += element.amount;
    });
  }

  togglePriceBox(event: Event): void {
    const priceBox = (event.target as HTMLElement).previousElementSibling;
    if (priceBox) {
      priceBox.classList.toggle('hide');
    }
  }
}
