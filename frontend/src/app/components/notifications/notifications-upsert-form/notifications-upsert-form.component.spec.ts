import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsCreateFormComponent } from './notifications-create-form.component';

describe('NotificationsCreateFormComponent', () => {
  let component: NotificationsCreateFormComponent;
  let fixture: ComponentFixture<NotificationsCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsCreateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationsCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
