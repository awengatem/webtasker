import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-new-usermodal',
  templateUrl: './new-usermodal.component.html',
  styleUrls: ['./new-usermodal.component.scss'],
})
export class NewUsermodalComponent implements OnInit {
  constructor(public modalRef: MdbModalRef<NewUsermodalComponent>) {}

  ngOnInit(): void {}
}
