import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListSectionComponent } from './users-list-section.component';

describe('UsersListSectionComponent', () => {
  let component: UsersListSectionComponent;
  let fixture: ComponentFixture<UsersListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
