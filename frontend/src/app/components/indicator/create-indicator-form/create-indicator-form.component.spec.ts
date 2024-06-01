import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIndicatorFormComponent } from './create-indicator-form.component';

describe('CreateIndicatorFormComponent', () => {
  let component: CreateIndicatorFormComponent;
  let fixture: ComponentFixture<CreateIndicatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIndicatorFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateIndicatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
