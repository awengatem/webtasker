import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-log-header',
  templateUrl: './log-header.component.html',
  styleUrls: ['./log-header.component.scss'],
})
export class LogHeaderComponent implements OnInit {
  @Output() login: EventEmitter<any> = new EventEmitter();
  @Output() signup: EventEmitter<any> = new EventEmitter();
  
  constructor() {}

  ngOnInit(): void {}

  logger(){
    this.login.emit();
  }

  signer(){
    this.signup.emit();
  }
}
