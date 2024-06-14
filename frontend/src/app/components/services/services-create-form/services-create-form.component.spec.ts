import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesCreateFormComponent } from './services-create-form.component';

describe('ServicesCreateFormComponent', () => {
  let component: ServicesCreateFormComponent;
  let fixture: ComponentFixture<ServicesCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesCreateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
