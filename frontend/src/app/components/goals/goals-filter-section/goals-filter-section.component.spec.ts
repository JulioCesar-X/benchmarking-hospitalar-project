import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsFilterSectionComponent } from './goals-filter-section.component';

describe('GoalsFilterSectionComponent', () => {
  let component: GoalsFilterSectionComponent;
  let fixture: ComponentFixture<GoalsFilterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsFilterSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalsFilterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
