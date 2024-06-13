import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesListSectionComponent } from './activities-list-section.component';

describe('ActivitiesListSectionComponent', () => {
  let component: ActivitiesListSectionComponent;
  let fixture: ComponentFixture<ActivitiesListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesListSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitiesListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
