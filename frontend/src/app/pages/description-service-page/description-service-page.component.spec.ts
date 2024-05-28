import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionServicePageComponent } from './description-service-page.component';

describe('DescriptionServicePageComponent', () => {
  let component: DescriptionServicePageComponent;
  let fixture: ComponentFixture<DescriptionServicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionServicePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DescriptionServicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
