import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsListPageComponent } from './indicators-page.component';

describe('IndicatorsListPageComponent', () => {
  let component: IndicatorsListPageComponent;
  let fixture: ComponentFixture<IndicatorsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorsListPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IndicatorsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
