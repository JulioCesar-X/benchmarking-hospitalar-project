import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateIndicatorComponent } from './admin-create-indicator.component';

describe('AdminCreateIndicatorComponent', () => {
  let component: AdminCreateIndicatorComponent;
  let fixture: ComponentFixture<AdminCreateIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCreateIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
