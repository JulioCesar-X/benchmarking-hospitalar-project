import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingService } from '../../../core/services/logging.service';

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

  constructor(private loggingService: LoggingService) { }

  ngOnInit() {
    if (this.message) {
      this.loggingService.info(`Feedback message displayed: ${this.message}`, this.type);
      setTimeout(() => {
        this.close();
      }, 2000);
    }
  }

  close() {
    this.leaving = true;
    setTimeout(() => {
      this.loggingService.info(`Feedback message closed: ${this.message}`, this.type);
      this.message = '';
      this.leaving = false;
    }, 500);
  }
}