import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIndicatorsPageComponent } from './indicators-update-page.component';

describe('UpdateIndicatorsPageComponent', () => {
  let component: UpdateIndicatorsPageComponent;
  let fixture: ComponentFixture<UpdateIndicatorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateIndicatorsPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateIndicatorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
