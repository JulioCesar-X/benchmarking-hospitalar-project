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
  leaving: boolean = false;


  ngOnInit() {
    console.log("dasdadada", this.message)
    if (this.message) {
      setTimeout(() => {
        this.close();
      }, 2000); // Auto close after 5 seconds
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
