import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('checkbox') private checkbox!: ElementRef;

  constructor() {}

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
}
