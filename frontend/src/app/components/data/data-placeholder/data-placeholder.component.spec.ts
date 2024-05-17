import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPlaceholderComponent } from './data-placeholder.component';

describe('DataPlaceholderComponent', () => {
  let component: DataPlaceholderComponent;
  let fixture: ComponentFixture<DataPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPlaceholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
