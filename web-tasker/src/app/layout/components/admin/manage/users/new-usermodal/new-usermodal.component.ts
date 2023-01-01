import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-new-usermodal',
  templateUrl: './new-usermodal.component.html',
  styleUrls: ['./new-usermodal.component.scss'],
})
export class NewUsermodalComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(
    public modalRef: MdbModalRef<NewUsermodalComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  /**Method to close modal */
  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage);
  }
}
