import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGraphicComponent } from './data-graphic.component';

describe('DataGraphicComponent', () => {
  let component: DataGraphicComponent;
  let fixture: ComponentFixture<DataGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGraphicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
