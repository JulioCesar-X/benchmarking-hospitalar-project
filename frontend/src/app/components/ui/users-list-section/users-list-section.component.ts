import { Component } from '@angular/core';
import { FormsModule,  } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-users-list-section',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
  ],
  templateUrl: './users-list-section.component.html',
  styleUrl: './users-list-section.component.scss'
})
export class UsersListSectionComponent {
  options: User[] = [];

  ngOnInit() {
    // Simulating an API call to fetch users
    this.options = [
      { id: 1, name: 'John Doe', role: 'Admin' },
      { id: 2, name: 'Jane Smith', role: 'User' }
      // Add more users as needed
    ];
  }

  removeUser(id: number) {
    this.options = this.options.filter(user => user.id !== id);
    // Add API call to remove user from the database
  }
  editUser(index: number) {
    //should redirect to edit user page
  }

  trackByIndex(index: number, item: User): number {
    return item.id;
  }
}
