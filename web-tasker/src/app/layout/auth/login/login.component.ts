import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { data } from 'jquery';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import Validation from './validation';

// /**directive helps detect form touched */
// @Directive({
//   selector: '[focus-field]',
// })
// export class FocusDirective {
//   @HostListener('focusin', ['$event']) onFocus() {
//     console.log('a field was focused!');
//   }
// }

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**local variables */
  status: boolean = true;
  submitted: boolean = false;

  /**form used in login part */
  form: any = {
    username: null,
    password: null,
  };

  /**form used in signup part */
  fSignup: FormGroup = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  user: any;

  @ViewChild('checkbox') private checkbox!: ElementRef;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    /**helps during login */
    if (this.accountService.isLoggedIn()) {
      this.isLoggedIn = true;
      //this.roles = this.accountService.getUser().roles;
      this.user = this.accountService.getUserAccount();
    }

    /**building form */
    this.fSignup = this.formBuilder.group(
      {
        firstname: ['', [Validators.required, Validators.minLength(3)]],
        lastname: ['', [Validators.required, Validators.minLength(3)]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: [Validation.match('password', 'confirmPassword')] }
    );

    /**helps detect form touched */
    this.fSignup.valueChanges.subscribe((res) => {
      //console.log('touching');
      if (this.submitted === true) {
        this.submitted = false;
      }
    });
  }

  /*property to control styling of login and signup span elements*/
  isChecked: boolean = false;

  /*method used by checkbox*/
  toggleCheck() {
    this.isChecked = !this.isChecked;
    console.log('Checkbox is toggled');
  }

  /*methods used by header buttons*/
  signUp() {
    console.log('signing up');
    this.checkbox.nativeElement.checked = true;
    this.isChecked = true;
  }

  login() {
    console.log('login');
    this.checkbox.nativeElement.checked = false;
    this.isChecked = false;
  }

  test() {
    console.log('loggged in');
  }

  /**functions used by reactive form fSignup */

  /**getter to access form.controls */
  get f(): { [key: string]: AbstractControl } {
    return this.fSignup.controls;
  }

  get firstname() {
    return this.fSignup.get('firstname');
  }

  get lastname() {
    return this.fSignup.get('lastname');
  }

  get username() {
    return this.fSignup.get('username');
  }

  get email() {
    return this.fSignup.get('email');
  }

  get password() {
    return this.fSignup.get('password');
  }

  get confirmPassword() {
    return this.fSignup.get('confirmPassword');
  }

  /*login methods*/
  onLoginButtonClicked() {
    const { username, password } = this.form;
    this.authService
      .login(username, password)
      .subscribe((res: HttpResponse<any>) => {
        console.log(res);
      });
  }

  onSignin() {
    const { username, password } = this.form; //data comes from template not here
    this.authService.login(username, password).subscribe({
      next: (data) => {
        console.log(data);
        const { authTokens, email, firstName, lastName, username, _id } =
          data.body.user;
        const filteredUser = {
          authTokens: authTokens,
          _id: _id,
          username: username,
          email: email,
          firstName: firstName,
          lastName: lastName,
        };
        //below saves to session storage
        this.accountService.saveUser(filteredUser);
        this.tokenService.saveAccessToken(data.body.accessToken);
        this.tokenService.saveRefreshToken(data.body.user.authTokens);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        //this.roles = this.accountService.getUser().roles;
        this.user = this.accountService.getUser();
        //this.reloadPage();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }

  onSignup() {
    this.submitted = true;
    console.log('signup submit button works!');
  }

  reloadPage() {
    window.location.reload();
  }
}

/**very helpful content
 *
 */

//https://www.bezkoder.com/angular-13-jwt-auth-httponly-cookie/
