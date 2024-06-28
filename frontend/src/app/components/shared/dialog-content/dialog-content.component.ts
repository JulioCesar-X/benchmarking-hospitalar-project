import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, FeedbackComponent]
})
export class DialogContentComponent {
  @Input() message: string = 'Tem a certeza que quer remover este item?';
  @Input() loadingMessage: string = 'Removendo item...';
  isLoading = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' = 'success';

  constructor(public dialogRef: MatDialogRef<DialogContentComponent>) { }

  closeModal(): void {
    this.dialogRef.close();
  }

  confirmAction(): void {
    this.isLoading = true;
    // Simular ação de exclusão
    setTimeout(() => {
      this.isLoading = false;
      this.feedbackMessage = 'Item removido com sucesso!';
      this.feedbackType = 'success';
      setTimeout(() => {
        this.dialogRef.close(true);
      }, 3000); // Espera 3 segundos antes de fechar o modal
    }, 2000); // Simulação de 2 segundos para exclusão
  }
}
