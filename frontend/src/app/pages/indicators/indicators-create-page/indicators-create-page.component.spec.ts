import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIndicatorsPageComponent } from './indicators-create-page.component';

describe('CreateIndicatorsPageComponent', () => {
  let component: CreateIndicatorsPageComponent;
  let fixture: ComponentFixture<CreateIndicatorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIndicatorsPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateIndicatorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
