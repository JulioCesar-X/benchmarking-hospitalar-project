import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesUpsertFormComponent } from './activities-upsert-form.component';

describe('ActivitiesUpsertFormComponent', () => {
  let component: ActivitiesUpsertFormComponent;
  let fixture: ComponentFixture<ActivitiesUpsertFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesUpsertFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitiesUpsertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
