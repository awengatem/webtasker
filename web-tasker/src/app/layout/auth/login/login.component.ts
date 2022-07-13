import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isChecked: boolean = true;

  toggleCheck(){
    this.isChecked = !this.isChecked;
    console.log("Check is toggled");
  }

  test(){
    console.log("signing up");
  }
}
