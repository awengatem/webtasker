import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { GeneralService } from 'src/app/services/general.service';
import Swal from 'sweetalert2';
import Validation from '../../../../../auth/login/validation';

@Component({
  selector: 'app-new-usermodal',
  templateUrl: './new-usermodal.component.html',
  styleUrls: ['./new-usermodal.component.scss'],
})
export class NewUsermodalComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  registerErrorMessage = '';
  registerFailed = false;
  submitted = false;
  flag: boolean = true;

  constructor(
    public modalRef: MdbModalRef<NewUsermodalComponent>,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [Validation.match('password', 'confirmPassword')] }
    );
  }

  /**Method to submit the form */
  submitForm(form: any) {
    this.submitted = true;
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(form.value, null, 4));
    console.log(form.value);
    //get the form values
    const { username, email, firstName, lastName, password } = form.value;

    /**creating user object to pass to server
     *properties name's should not be changed
     */
    /**trim off white space before sending to server */
    let cUsername = this.generalService.deepClean(username);
    let cEmail = this.generalService.deepClean(email);
    let cFirstname = this.generalService.deepClean(firstName);
    let cLastname = this.generalService.deepClean(lastName);

    const user = {
      username: cUsername,
      email: cEmail,
      password: password,
      firstName: cFirstname,
      lastName: cLastname,
      isProjectManager: false,
    };

    /**post user to server*/
    this.userAccountService.registerUser(user).subscribe({
      next: (res: any) => {
        Swal.fire('Success!', res.message, 'success');
        this.form.reset();
        console.log(res);
        this.registerFailed = false;
        this.close();
      },
      error: (err) => {
        console.log(err.error.message);
        this.registerErrorMessage = err.error.message;
        this.registerFailed = true;
      },
    });
  }

  /**Method to close modal */
  close(): void {
    const closeMessage = 'New user modal closed';
    this.modalRef.close(closeMessage);
  }
}