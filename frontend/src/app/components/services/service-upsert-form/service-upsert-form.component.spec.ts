import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceUpsertFormComponent } from './service-upsert-form.component';

describe('ServiceUpsertFormComponent', () => {
  let component: ServiceUpsertFormComponent;
  let fixture: ComponentFixture<ServiceUpsertFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceUpsertFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceUpsertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
