import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsListSectionComponent } from './goals-list-section.component';

describe('GoalsListSectionComponent', () => {
  let component: GoalsListSectionComponent;
  let fixture: ComponentFixture<GoalsListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsListSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalsListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
