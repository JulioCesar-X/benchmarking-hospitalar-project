import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecupModalComponent } from './password-recup-modal.component';

describe('PasswordRecupModalComponent', () => {
  let component: PasswordRecupModalComponent;
  let fixture: ComponentFixture<PasswordRecupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecupModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordRecupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
