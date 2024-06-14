import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesListSectionComponent } from './services-list-section.component';

describe('ServicesListSectionComponent', () => {
  let component: ServicesListSectionComponent;
  let fixture: ComponentFixture<ServicesListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesListSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
