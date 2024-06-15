import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesInsertPageComponent } from './activities-insert-page.component';

describe('ActivitiesInsertPageComponent', () => {
  let component: ActivitiesInsertPageComponent;
  let fixture: ComponentFixture<ActivitiesInsertPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesInsertPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitiesInsertPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
