import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificationsManagementComponent } from './admin-notifications-management.component';

describe('AdminNotificationsManagementComponent', () => {
  let component: AdminNotificationsManagementComponent;
  let fixture: ComponentFixture<AdminNotificationsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNotificationsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminNotificationsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
