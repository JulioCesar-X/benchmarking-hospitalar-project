import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFilterSectionComponent } from './user-filter-section.component';

describe('UserFilterSectionComponent', () => {
  let component: UserFilterSectionComponent;
  let fixture: ComponentFixture<UserFilterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFilterSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserFilterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
