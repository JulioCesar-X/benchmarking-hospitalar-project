import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorFilterSectionComponent } from './indicator-filter-section.component';

describe('IndicatorFilterSectionComponent', () => {
  let component: IndicatorFilterSectionComponent;
  let fixture: ComponentFixture<IndicatorFilterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorFilterSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicatorFilterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
