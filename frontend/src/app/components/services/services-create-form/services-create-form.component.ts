import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-services-create-form',
  standalone: true,
  imports: [        CommonModule,
        FormsModule,
        
        NotificationComponent],
  templateUrl: './services-create-form.component.html',
  styleUrl: './services-create-form.component.scss'
})
export class ServicesCreateFormComponent {
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  imageName: string = '';
  selectedFile: File | null = null;

  isLoading = false; 
  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.http.post('/api/upload', formData).subscribe({
        next: (response) => console.log('Upload successful', response),
        error: (error) => console.error('Upload error', error)
      });
    } else {
      console.error('File is missing');
    }
  }

  createService(){

  }
}
