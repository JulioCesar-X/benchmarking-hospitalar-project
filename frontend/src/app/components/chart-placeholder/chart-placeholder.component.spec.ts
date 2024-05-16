import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPlaceholderComponent } from './chart-placeholder.component';

describe('ChartPlaceholderComponent', () => {
  let component: ChartPlaceholderComponent;
  let fixture: ComponentFixture<ChartPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartPlaceholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
