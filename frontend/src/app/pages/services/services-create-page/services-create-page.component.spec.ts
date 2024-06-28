import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServicesPageComponent } from './services-create-page.component';

describe('CreateServicesPageComponent', () => {
  let component: CreateServicesPageComponent;
  let fixture: ComponentFixture<CreateServicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateServicesPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateServicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
