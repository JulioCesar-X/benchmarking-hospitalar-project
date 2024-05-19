import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInputsComponent } from './data-inputs.component';

describe('DataInputsComponent', () => {
  let component: DataInputsComponent;
  let fixture: ComponentFixture<DataInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataInputsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
