import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsListSectionComponent } from './records-list-section.component';

describe('RecordsListSectionComponent', () => {
  let component: RecordsListSectionComponent;
  let fixture: ComponentFixture<RecordsListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordsListSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecordsListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
