import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesEditFormComponent } from './services-edit-form.component';

describe('ServicesEditFormComponent', () => {
  let component: ServicesEditFormComponent;
  let fixture: ComponentFixture<ServicesEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesEditFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
