import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesCreatePageComponent } from './activities-create-page.component';

describe('ActivitiesCreatePageComponent', () => {
  let component: ActivitiesCreatePageComponent;
  let fixture: ComponentFixture<ActivitiesCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesCreatePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitiesCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
