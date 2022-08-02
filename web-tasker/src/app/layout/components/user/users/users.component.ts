import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @ViewChild('myNameElem')  myNameElem!: ElementRef;

  getValue() {
    console.log(this.myNameElem);
    this.myNameElem.nativeElement.innerHTML =
      'I am changed by ElementRef & ViewChild';
  }
}

//https://www.delftstack.com/howto/angular/getelementbyid-replacement-in-angular/#:~:text=The%20getElementById%20method%20returns%20the,or%20element%20in%20our%20document.
