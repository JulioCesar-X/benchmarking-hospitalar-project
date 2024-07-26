import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatButtonModule } from '@angular/material/button';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, FeedbackComponent, MatButtonModule]
})
export class DialogContentComponent {
  @Input() message: string = 'Tem a certeza que quer remover este item?';
  @Input() loadingMessage: string = 'Removendo item...';
  isLoading = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' = 'success';

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loggingService: LoggingService
  ) {
    if (data) {
      this.message = data.message || this.message;
      this.loadingMessage = data.loadingMessage || this.loadingMessage;
    }
  }

  closeModal(): void {
    this.loggingService.info('Dialog closed without action');
    this.dialogRef.close();
  }

  confirmAction(): void {
    this.isLoading = true;
    this.loggingService.info('Action confirmed, starting loading');
    setTimeout(() => {
      this.isLoading = false;
      this.feedbackMessage = 'Item removido com sucesso!';
      this.feedbackType = 'success';
      this.loggingService.info('Item successfully removed');
      this.dialogRef.close(true);
    }, 2000);
  }
}