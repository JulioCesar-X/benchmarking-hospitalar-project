import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-user-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete-user-modal.component.html',
  styleUrls: ['./confirm-delete-user-modal.component.scss']
})
export class ConfirmDeleteUserModalComponent {
  //@Input() user: { id: number; name: string; role: string };
  @Output() userDeleted = new EventEmitter<number>();

  constructor() {}

  confirmDeletion() {
    //Logic to delete user

    //this.userDeleted.emit(this.user.id); // Emit the event after deletion
  }
}
