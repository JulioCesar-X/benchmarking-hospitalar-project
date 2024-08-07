import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { NotificationService } from './../../../core/services/notifications/notification.service';
import { User } from '../../../core/models/user.model';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-notifications-create-form',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    FeedbackComponent,
    MatTooltipModule
  ],
  templateUrl: './notifications-upsert-form.component.html',
  styleUrls: ['./notifications-upsert-form.component.scss']
})
export class NotificationsCreateFormComponent implements OnInit {
  users: User[] = [];
  selectedUser: number | null = null;
  subject: string = '';
  message: string = '';
  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' = 'success';
  isLoading: boolean = false;
  subjectError: string = '';
  messageError: string = '';

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private loggingService: LoggingService
  ) { }

  ngOnInit() {

    this.fetchUsers();

  }

  fetchUsers() {
    this.userService.indexUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        this.showFeedback('Failed to fetch users', 'error');
        this.loggingService.error('Failed to fetch users', error);
      }
    );
  }

  validateSubject() {
    if (this.subject.length > 80) {
      this.subjectError = 'O assunto não pode ter mais de 80 caracteres.';
    } else {
      this.subjectError = '';
    }
  }

  validateMessage() {
    if (this.message.length > 200) {
      this.messageError = 'A mensagem não pode ter mais de 200 caracteres.';
    } else {
      this.messageError = '';
    }
  }

  onSubmit() {
    this.validateSubject();
    this.validateMessage();

    if (this.subjectError || this.messageError || !this.selectedUser || !this.subject || !this.message) {
      return;
    }

    this.isLoading = true; // Inicie o estado de carregamento
    const newNotification = {
      userId: this.selectedUser,
      title: this.subject,
      message: this.message
    };

    this.notificationService.storeNotification(newNotification).subscribe(
      () => {
        this.showFeedback('Mensagem enviada com sucesso!', 'success');
        this.loggingService.log('Notification sent successfully');
        this.resetForm();
      },
      (error) => {
        this.showFeedback('Falha ao enviar mensagem, tente novamente!', 'error');
        this.loggingService.error('Failed to send notification', error);
      }
    ).add(() => {
      this.isLoading = false; // Finalize o estado de carregamento
    });
  }

  showFeedback(message: string, type: 'success' | 'error') {
    this.feedbackMessage = message;
    this.feedbackType = type;
  }

  resetForm() {
    this.selectedUser = null;
    this.subject = '';
    this.message = '';
    this.subjectError = '';
    this.messageError = '';
  }
}