import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateDataComponent } from './admin-create-data.component';

describe('AdminCreateDataComponent', () => {
  let component: AdminCreateDataComponent;
  let fixture: ComponentFixture<AdminCreateDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCreateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
