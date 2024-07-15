import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  leaving: boolean = false;

  ngOnInit() {
    if (this.message) {
      setTimeout(() => {
        this.close();
      }, 2000);
    }
  }

  close() {
    this.leaving = true;
    setTimeout(() => {
      this.message = '';
      this.leaving = false;
    }, 500);
  }
}