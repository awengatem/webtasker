import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-disposition',
  templateUrl: './disposition.component.html',
  styleUrls: ['./disposition.component.scss'],
})
export class DispositionComponent implements OnInit {
  form: any = {
    reason: null,
  };
  submitted: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  createDisposition() {
    console.log('disposition created');
  }

  submit() {
    this.submitted = true;
  }
}
