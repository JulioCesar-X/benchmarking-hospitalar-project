import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpsertFormComponent } from './users-upsert-form.component';

describe('UserUpsertFormComponent', () => {
  let component: UserUpsertFormComponent;
  let fixture: ComponentFixture<UserUpsertFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUpsertFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUpsertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
