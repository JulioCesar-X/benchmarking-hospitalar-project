import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGoalsPageComponent } from './update-goals-page.component';

describe('UpdateGoalsPageComponent', () => {
  let component: UpdateGoalsPageComponent;
  let fixture: ComponentFixture<UpdateGoalsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGoalsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateGoalsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
