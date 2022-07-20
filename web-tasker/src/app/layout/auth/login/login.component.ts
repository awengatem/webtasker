import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { data } from 'jquery';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  user: any;

  @ViewChild('checkbox') private checkbox!: ElementRef;

  constructor(private authService: AuthService,private accountService: AccountService) {}

  ngOnInit(): void {
    if(this.accountService.isLoggedIn()){
      this.isLoggedIn = true;
      //this.roles = this.accountService.getUser().roles;
      this.user = this.accountService.getUser().body.user;
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

  test(){
    console.log("loggged in");
  }

  /*login methods*/
  onLoginButtonClicked(){
    const {username,password} = this.form;
    this.authService.login(username,password).subscribe((res: HttpResponse<any>)=>{
      console.log(res);
    })
  }

  onSubmit(){
    const {username,password} = this.form;
    this.authService.login(username,password).subscribe({
      next: data =>{
        this.accountService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        //this.roles = this.accountService.getUser().roles;
        this.user = this.accountService.getUser().body.user;
        //this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(){
    window.location.reload();
  }
}

/**very helpful content
 * 
 */

//https://www.bezkoder.com/angular-13-jwt-auth-httponly-cookie/