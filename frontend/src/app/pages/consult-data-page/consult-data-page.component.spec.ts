import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultDataPageComponent } from './consult-data-page.component';

describe('ConsultDataPageComponent', () => {
  let component: ConsultDataPageComponent;
  let fixture: ComponentFixture<ConsultDataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultDataPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
