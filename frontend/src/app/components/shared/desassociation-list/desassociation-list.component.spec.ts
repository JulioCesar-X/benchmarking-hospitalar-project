import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesassociationListComponent } from './desassociation-list.component';

describe('DesassociationListComponent', () => {
  let component: DesassociationListComponent;
  let fixture: ComponentFixture<DesassociationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesassociationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesassociationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
