import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultUsersPageComponent } from './consult-users-page.component';

describe('ConsultUsersPageComponent', () => {
  let component: ConsultUsersPageComponent;
  let fixture: ComponentFixture<ConsultUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultUsersPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
