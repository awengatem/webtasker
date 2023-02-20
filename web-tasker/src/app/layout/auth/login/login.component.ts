import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**local variables */
  status: boolean = true;
  submitted1: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  logsubmitted: boolean = false;
  isLoggedIn = false;
  isLoginFailed = false;
  signupFailed = false;
  loginErrorMessage = '';
  signupErrorMessage = '';
  roles: string[] = [];
  user: any;
  currentPage = 3;

  userDetails: Record<string, any> = {};

  /**form used in login part */
  form: any = {
    username: null,
    password: null,
  };

  /*property to control styling of login and signup span elements*/
  isChecked: boolean = false;

  /**combined signup array */
  // userDetails: any;

  /**forms used in signup part */
  fSignup1: FormGroup = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    dob: new FormControl(''),
    idNo: new FormControl(''),
    gender: new FormControl(''),
  });
  fSignup2: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    telNo: new FormControl(''),
  });
  fSignup3: FormGroup = new FormGroup({
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

  minDate = new Date(1930, 0, 1);
  maxDate = new Date();
  date: any;
  genders: any = ['male', 'female', 'other'];
  counties: any = [
    'Baringo',
    'Bomet',
    'Bungoma',
    'Busia',
    'Elgeyo-Marakwet',
    'Embu',
    'Garissa',
    'HomaBay',
    'Isiolo',
    'Kajiado',
    'Kakamega',
    'Kericho',
    'Kiambu',
    'Kilifi',
    'Kirinyaga',
    'Kisii',
    'Kisumu',
    'Kitui',
    'Kwale',
    'Laikipia',
    'Lamu',
    'Machakos',
    'Makueni',
    'Mandera',
    'Marsabit',
    'Meru',
    'Migori',
    'Mombasa',
    "Murang'a",
    'Nairobi',
    'Nakuru',
    'Nandi',
    'Narok',
    'Nyamira',
    'Nyandarua',
    'Nyeri',
    'Samburu',
    'Siaya',
    'Taita-Taveta',
    'TanaRiver',
    'Tharaka-Nithi',
    'TransNzoia',
    'Turkana',
    'UasinGishu',
    'Vihiga',
    'Wajir',
    'WestPokot',
  ];

  ngOnInit(): void {
    /**helps during login */
    if (this.accountService.isLoggedIn()) {
      this.isLoggedIn = true;
      //this.roles = this.accountService.getUser().roles;
      this.user = this.accountService.getUserAccount();
    }

    /**building form */
    this.fSignup1 = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required]],
      idNo: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['', [Validators.required]],
    });
    this.fSignup2 = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      telNo: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(20),
        ],
      ],
    });
    this.fSignup3 = this.formBuilder.group(
      {
        area: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        county: ['', [Validators.required]],
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
    this.fSignup1.valueChanges.subscribe((res) => {
      //console.log('touching signup form');
      if (this.submitted1 === true) {
        this.submitted1 = false;
      }
    });
    this.fSignup2.valueChanges.subscribe((res) => {
      //console.log('touching signup form');
      if (this.submitted2 === true) {
        this.submitted2 = false;
      }
    });
    this.fSignup3.valueChanges.subscribe((res) => {
      //console.log('touching signup form');
      if (this.submitted3 === true) {
        this.submitted3 = false;
      }
    });
  }

  /**Method to store values and navigate forward */
  nextPage(val: number) {
    if (val === 1) {
      const { firstname, lastname, dob, idNo, gender } = this.fSignup1.value;
      this.userDetails['firstname'] = firstname;
      this.userDetails['lastname'] = lastname;
      this.userDetails['dob'] = dob.toLocaleDateString();
      this.userDetails['idNo'] = idNo;
      this.userDetails['gender'] = gender;
      // log output
      console.log(this.userDetails);
      this.currentPage++;
    } else if (val === 2) {
      const { username, email, telNo } = this.fSignup2.value;
      this.userDetails['username'] = username;
      this.userDetails['email'] = email;
      this.userDetails['telNo'] = telNo;
      //log output
      console.log(this.userDetails);
      this.currentPage++;
    } else if (val === 3) {
      // form is finished complete and submit it
      const { area, county, password } = this.fSignup3.value;
      this.userDetails['area'] = area;
      //getting rid of index numbering
      const countyArr = county.split(' ');
      let countyNew = county;
      countyArr[1] ? (countyNew = countyArr[1]) : (countyNew = county);
      this.userDetails['county'] = countyNew;
      this.userDetails['password'] = password;
      //log output
      console.log(this.userDetails);
    }
  }

  /**Method to navigate backward */
  prevPage() {
    this.currentPage--;
  }

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

  /**Method to detect selection of gender */
  changeGender(e: any) {
    this.gender?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  /**Method to detect selection of county */
  changeCounty(e: any) {
    this.county?.setValue(e.target.value, {
      onlySelf: true,
    });
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
    return this.fSignup1.controls;
  }

  get firstname() {
    return this.fSignup1.get('firstname');
  }

  get lastname() {
    return this.fSignup1.get('lastname');
  }

  get dob() {
    return this.fSignup1.get('dob');
  }

  get idNo() {
    return this.fSignup1.get('idNo');
  }

  get gender() {
    return this.fSignup1.get('gender');
  }

  get username() {
    return this.fSignup2.get('username');
  }

  get email() {
    return this.fSignup2.get('email');
  }

  get telNo() {
    return this.fSignup2.get('telNo');
  }

  get area() {
    return this.fSignup3.get('area');
  }

  get county() {
    return this.fSignup3.get('county');
  }

  get password() {
    return this.fSignup3.get('password');
  }

  get confirmPassword() {
    return this.fSignup3.get('confirmPassword');
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

  /**Method to check duplicates from db first */
  checkDuplicates() {
    const { username, email } = this.fSignup2.value;

    /**trim off white space before sending to server */
    let cUsername = this.generalService.deepClean(username);
    let cEmail = this.generalService.deepClean(email);

    const details = {
      username: cUsername,
      email: cEmail,
    };

    /**post user to server*/
    this.userAccountService.registerUser(details).subscribe({
      next: (res: any) => {
        this.snackBarService.displaySnackbar('success', res.message);
        console.log(res);
        this.signupFailed = false;
      },
      error: (err) => {
        console.log(err);
        this.signupErrorMessage = err.error.message;
        this.signupFailed = true;
        this.submitted2 = false;
      },
    });
  }

  /**sign up methods */
  onSignup() {
    console.log('submission successful!!');
    console.log(this.fSignup1.value);

    //get the form values
    const { email, firstname, lastname, username, password } =
      this.fSignup1.value;

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

  validate(formNo: number) {
    console.log('sign up button okay');
    if (formNo === 1) {
      this.submitted1 = true;
    } else if (formNo === 2) {
      this.submitted2 = true;
    } else if (formNo === 3) {
      this.submitted3 = true;
    }
  }

  subTest() {
    console.log('test accomplished!!');
  }

  validateLogin() {
    console.log('sign in button okay');
    this.logsubmitted = true;
  }

  resetSignup() {
    this.submitted1 = false;
    this.fSignup1.reset();
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
