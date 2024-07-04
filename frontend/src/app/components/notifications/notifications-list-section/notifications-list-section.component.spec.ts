import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsListSectionComponent } from './notifications-list-section.component';

describe('NotificationsListSectionComponent', () => {
  let component: NotificationsListSectionComponent;
  let fixture: ComponentFixture<NotificationsListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsListSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationsListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
