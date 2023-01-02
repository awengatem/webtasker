import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { GeneralService } from 'src/app/services/general.service';
import Swal from 'sweetalert2';
import Validation from '../../../../../auth/login/validation';

@Component({
  selector: 'app-edit-usermodal',
  templateUrl: './edit-usermodal.component.html',
  styleUrls: ['./edit-usermodal.component.scss'],
})
export class EditUsermodalComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  registerErrorMessage = '';
  registerFailed = false;
  submitted = false;
  flag: boolean = true;
  /**Data to be recieved from parent component */
  userId: string | null = null;
  receivedUserId!: string;

  constructor(
    public modalRef: MdbModalRef<EditUsermodalComponent>,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit(): void {
    /**build form */
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
        role: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        // password: [
        //   '',
        //   [
        //     Validators.required,
        //     Validators.minLength(6),
        //     Validators.maxLength(20),
        //   ],
        // ],
        // confirmPassword: ['', [Validators.required]],
      }
      // { validators: [Validation.match('password', 'confirmPassword')] }
    );

    /**update received userId */
    if (this.userId) {
      this.receivedUserId = this.userId;
      // load form with data to be editted
      this.loadFieldsToEdit(this.userId);
    }
    console.log(this.receivedUserId);
  }

  /**Method to load the form with values to be patched */
  loadFieldsToEdit(userId: string) {
    this.userAccountService.getSpecificUser(userId).subscribe((user) => {
      console.log(user);
      this.form.controls['username'].setValue(user.username);
      this.form.controls['email'].setValue(user.email);
      this.form.controls['firstName'].setValue(user.firstName);
      this.form.controls['lastName'].setValue(user.lastName);
      this.form.controls['role'].setValue(user.isProjectManager);
    });
  }

  /**Method to submit the form */
  submitForm(form: any) {
    this.submitted = true;
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
      // password: password,
      firstName: cFirstname,
      lastName: cLastname,
      isProjectManager: false,
    };

    /**patch the user to api*/
    if (this.userId) {
      this.userAccountService.editUser(this.userId, user).subscribe({
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
  }

  /**Method to close modal */
  close(): void {
    const closeMessage = 'Edit modal closed';
    this.modalRef.close(closeMessage);
  }
}
