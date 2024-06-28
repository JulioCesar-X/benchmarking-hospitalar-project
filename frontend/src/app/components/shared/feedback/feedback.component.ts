import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';

  ngOnInit() {
    if (this.message) {
      setTimeout(() => {
        this.close();
      }, 5000); // Auto close after 5 seconds
    }
  }

  close() {
    this.message = '';
  }
}
