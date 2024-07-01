import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerBlueBGComponent } from './loading-spinner-blue-bg.component';

describe('LoadingSpinnerBlueBGComponent', () => {
  let component: LoadingSpinnerBlueBGComponent;
  let fixture: ComponentFixture<LoadingSpinnerBlueBGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerBlueBGComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingSpinnerBlueBGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
