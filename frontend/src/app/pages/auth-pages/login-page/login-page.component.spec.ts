// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { LoginPageComponent } from './login-page.component';

// describe('LoginPageComponent', () => {
//   let component: LoginPageComponent;
//   let fixture: ComponentFixture<LoginPageComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [LoginPageComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(LoginPageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginPageComponent } from './login-page.component';
import { LoginFormComponent } from '../../../components/auth/login-form/login-form.component';
import { NavbarComponent } from '../../../components/ui/navbar/navbar.component';
import { FooterComponent } from '../../../components/ui/footer/footer.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoginPageComponent,
        NavbarComponent,
        LoginFormComponent,
        FooterComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading indicator on login', () => {
    component.onLoginStart();
    expect(component.isLoading).toBeTrue();
  });
});
