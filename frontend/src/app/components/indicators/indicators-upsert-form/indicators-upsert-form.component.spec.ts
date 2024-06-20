import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsUpsertFormComponent } from './indicators-upsert-form.component';

describe('IndicatorsUpsertFormComponent', () => {
  let component: IndicatorsUpsertFormComponent;
  let fixture: ComponentFixture<IndicatorsUpsertFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorsUpsertFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicatorsUpsertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
