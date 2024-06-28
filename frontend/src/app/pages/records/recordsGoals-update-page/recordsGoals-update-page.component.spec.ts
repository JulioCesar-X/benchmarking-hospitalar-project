import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsGoalsUpdatePageComponent } from './recordsGoals-update-page.component';

describe('RecordsGoalsUpdatePageComponent', () => {
  let component: RecordsGoalsUpdatePageComponent;
  let fixture: ComponentFixture<RecordsGoalsUpdatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordsGoalsUpdatePageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecordsGoalsUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
