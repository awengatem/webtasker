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
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { TokenService } from 'src/app/services/token.service';
import { WebRequestService } from 'src/app/services/api/web-request.service';
import Swal from 'sweetalert2';
import Validation from './validation';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

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
  logsubmitted: boolean = false;
  isLoggedIn = false;
  isLoginFailed = false;
  signupFailed = false;
  loginErrorMessage = '';
  signupErrorMessage = '';
  roles: string[] = [];
  user: any;

  /**form used in login part */
  form: any = {
    username: null,
    password: null,
  };

  //test
  currentPage = 1;
  name = '';
  email2 = '';
  phone = '';
  address = '';

  nextPage() {
    this.currentPage++;
  }

  prevPage() {
    this.currentPage--;
  }

  /**form used in signup part */
  fSignup: FormGroup = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    gender: new FormControl(''),
    username: new FormControl(''),
    dob: new FormControl(''),
    telNo: new FormControl(''),
    idNo: new FormControl(''),
    area: new FormControl(''),
    county: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  @ViewChild('checkbox') private checkbox!: ElementRef;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private tokenService: TokenService,
    private userAccountService: UserAccountService,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService
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
        gender: ['', []],
        dob: ['', []],
        telNo: ['', []],
        idNo: ['', [Validators.required, Validators.minLength(8)]],
        area: ['', []],
        county: ['', []],
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
      //console.log('touching signup form');
      if (this.submitted === true) {
        this.submitted = false;
      }
    });
  }

  /*property to control styling of login and signup span elements*/
  isChecked: boolean = false;

  /*method used by checkbox*/
  toggleCheck() {
    if (this.checkbox.nativeElement.checked === true) {
      this.isChecked = true;
      //console.log('Checkbox is toggled');
    } else {
      this.isChecked = false;
    }
  }

  /**method flaps card */
  flapCard() {
    const status = this.checkbox.nativeElement.checked;
    this.checkbox.nativeElement.checked = !status;
    this.isChecked = !this.isChecked;
  }

  /*methods used by header buttons*/
  signUp() {
    console.log('signing up');
    if (this.isChecked === false) {
      this.flapCard();
    }
  }

  login() {
    console.log('login');
    if (this.isChecked === true) {
      this.flapCard();
    }
  }

  test() {
    console.log('working');
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

  get gender() {
    return this.fSignup.get('gender');
  }

  get dob() {
    return this.fSignup.get('dob');
  }

  get telNo() {
    return this.fSignup.get('telNo');
  }

  get idNo() {
    return this.fSignup.get('idNo');
  }

  get area() {
    return this.fSignup.get('area');
  }

  get county() {
    return this.fSignup.get('county');
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
        const { email, firstName, lastName, username, _id } = data.body.user;
        const filteredUser = {
          _id: _id,
          username: username,
          email: email,
          firstName: firstName,
          lastName: lastName,
        };
        /**below saves to session storage
         * local storage saving is done in authService
         */
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
        this.loginErrorMessage = err.error.message;
        console.log(err);
        this.isLoginFailed = true;
      },
    });
  }

  /**sign up methods */
  onSignup() {
    console.log('submission successful!!');
    console.log(this.fSignup.value);

    //get the form values
    const { email, firstname, lastname, username, password } =
      this.fSignup.value;

    /**creating user object to pass to server
     *properties name's should not be changed
     */
    /**trim off white space before sending to server */
    let cUsername = this.generalService.deepClean(username);
    let cEmail = this.generalService.deepClean(email);
    let cFirstname = this.generalService.deepClean(firstname);
    let cLastname = this.generalService.deepClean(lastname);

    const user = {
      username: cUsername,
      email: cEmail,
      password: password,
      firstName: cFirstname,
      lastName: cLastname,
      role: 'user',
    };

    /**post user to server*/
    this.userAccountService.registerUser(user).subscribe({
      next: (res: any) => {
        this.snackBarService.displaySnackbar('success', res.message);
        this.resetSignup();
        console.log(res);
        this.signupFailed = false;
      },
      error: (err) => {
        console.log(err);
        this.signupErrorMessage = err.error.message;
        this.signupFailed = true;
      },
    });
  }

  validate() {
    console.log('sign up button okay');
    this.submitted = true;
  }

  validateLogin() {
    console.log('sign in button okay');
    this.logsubmitted = true;
  }

  resetSignup() {
    this.submitted = false;
    this.fSignup.reset();
    this.flapCard();
  }

  reloadPage() {
    window.location.reload();
  }
}

/**very helpful content
 *
 */

//https://www.bezkoder.com/angular-13-jwt-auth-httponly-cookie/
