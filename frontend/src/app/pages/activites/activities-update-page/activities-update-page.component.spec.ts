import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesEditarPageComponent } from './activities-update-page.component';

describe('ActivitiesEditarPageComponent', () => {
  let component: ActivitiesEditarPageComponent;
  let fixture: ComponentFixture<ActivitiesEditarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesEditarPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActivitiesEditarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
