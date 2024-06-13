import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsListSectionComponent } from './indicators-list-section.component';

describe('IndicatorsListSectionComponent', () => {
  let component: IndicatorsListSectionComponent;
  let fixture: ComponentFixture<IndicatorsListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorsListSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicatorsListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
