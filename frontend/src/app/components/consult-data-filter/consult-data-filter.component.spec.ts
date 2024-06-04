import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultDataFilterComponent } from './consult-data-filter.component';

describe('ConsultDataFilterComponent', () => {
  let component: ConsultDataFilterComponent;
  let fixture: ComponentFixture<ConsultDataFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultDataFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultDataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
