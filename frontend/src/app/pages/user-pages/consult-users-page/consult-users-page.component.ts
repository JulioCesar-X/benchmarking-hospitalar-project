// import { Component, OnInit } from '@angular/core';
// import { NavbarComponent } from '../../../components/ui/navbar/navbar.component';
// import { MenuComponent } from '../../../components/user/menu/menu.component';
// import { UsersListSectionComponent } from '../../../components/user/users-list-section/users-list-section.component';
// import { UserFilterSectionComponent } from '../../../components/user/user-filter-section/user-filter-section.component';
// import { FooterComponent } from '../../../components/ui/footer/footer.component';


// @Component({
//   selector: 'app-consult-users-page',
//   standalone: true,
//   imports: [
//     NavbarComponent,
//     MenuComponent,
//     UsersListSectionComponent,
//     UserFilterSectionComponent,
//     FooterComponent
//   ],
//   templateUrl:'./consult-users-page.component.html',
//   styleUrl: './consult-users-page.component.scss'
// })

// export class ConsultUsersPageComponent {
//   searchFilter: string | undefined;

//   // handleFilterData(event: string) {
//   //   this.searchFilter = event;
//   // }
// }


import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { UsersListSectionComponent } from '../../../components/user/users-list-section/users-list-section.component';
import { UserFilterSectionComponent } from '../../../components/user/user-filter-section/user-filter-section.component';

@Component({
  selector: 'app-consult-users-page',
  standalone: true,
  imports: [
    MenuComponent,
    UsersListSectionComponent,
    UserFilterSectionComponent,

  ],
  templateUrl: './consult-users-page.component.html',
  styleUrls: ['./consult-users-page.component.scss']
})
export class ConsultUsersPageComponent {
  searchFilter: string | undefined;
}
