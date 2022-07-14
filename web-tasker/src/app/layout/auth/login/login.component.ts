import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('checkbox') private checkbox!: ElementRef;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  //property to control styling of login and signup span elements
  isChecked: boolean = false;

  //method used by checkbox
  toggleCheck() {
    this.isChecked = !this.isChecked;
    console.log('Checkbox is toggled');
  }

  //methods used by header buttons
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

  onLoginButtonClicked(email: string,password: string){
    this.authService.login(email,password).subscribe((res: HttpResponse<any>)=>{
      console.log(res);
    })
  }
}
