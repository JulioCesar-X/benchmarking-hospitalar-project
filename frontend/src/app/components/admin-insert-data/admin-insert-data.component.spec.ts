import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInsertDataComponent } from './admin-insert-data.component';

describe('AdminInsertDataComponent', () => {
  let component: AdminInsertDataComponent;
  let fixture: ComponentFixture<AdminInsertDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInsertDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminInsertDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
