import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { data } from 'jquery';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  //local variables
  status: boolean = true;

  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  user: any;

  @ViewChild('checkbox') private checkbox!: ElementRef;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    if (this.accountService.isLoggedIn()) {
      this.isLoggedIn = true;
      //this.roles = this.accountService.getUser().roles;
      this.user = this.accountService.getUserAccount();
    }
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
    const { username, password } = this.form;
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

  onSignup(){
    console.log("signup submit button works!");
  }

  reloadPage() {
    window.location.reload();
  }
}

/**very helpful content
 *
 */

//https://www.bezkoder.com/angular-13-jwt-auth-httponly-cookie/
