import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIndicatorFormComponent } from './update-indicator-form.component';

describe('UpdateIndicatorFormComponent', () => {
  let component: UpdateIndicatorFormComponent;
  let fixture: ComponentFixture<UpdateIndicatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateIndicatorFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateIndicatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
