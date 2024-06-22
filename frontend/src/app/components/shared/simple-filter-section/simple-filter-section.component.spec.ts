import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFilterSectionComponent } from './simple-filter-section.component';

describe('SimpleFilterSectionComponent', () => {
  let component: SimpleFilterSectionComponent;
  let fixture: ComponentFixture<SimpleFilterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFilterSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleFilterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
