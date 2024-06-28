import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServicesPageComponent } from './services-update-page.component';

describe('UpdateServicesPageComponent', () => {
  let component: UpdateServicesPageComponent;
  let fixture: ComponentFixture<UpdateServicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateServicesPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateServicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
