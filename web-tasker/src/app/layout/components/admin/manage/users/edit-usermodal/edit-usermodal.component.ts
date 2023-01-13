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
  defaultForm: FormGroup = new FormGroup({});
  passwordForm: FormGroup = new FormGroup({});
  registerErrorMessage = '';
  registerFailed = false;
  submitted = false;
  includePassword: boolean = false;
  flag: boolean = true;
  /**variable used by checkbox*/
  checkboxValue!: boolean;
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
    /**build first form */
    this.defaultForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
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
      role: ['', [Validators.required]],
    });

    /**build second form including passwords */
    this.passwordForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
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
        role: ['', [Validators.required]],
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

    /**initialize default form*/
    this.form = this.defaultForm;

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
      this.form.controls['role'].setValue(user.role);
    });
  }

  /**Method used by checkbox */
  showPasswordFields(event: any) {
    // console.log(event.checked);
    this.includePassword = event.checked;

    /**Use form with password fields if checked*/
    if (event.checked) {
      this.form = this.passwordForm;
      if (this.userId) this.loadFieldsToEdit(this.userId);
    } else {
      this.form = this.defaultForm;
      if (this.userId) this.loadFieldsToEdit(this.userId);
    }
  }

  /**Method to submit the form */
  submitForm(form: any) {
    this.submitted = true;
    console.log(form.value);
    //get the form values
    const { username, email, firstName, lastName, role, password } = form.value;

    /**creating user object to pass to server
     *properties name's should not be changed
     */
    /**trim off white space before sending to server */
    let cUsername = this.generalService.deepClean(username);
    let cEmail = this.generalService.deepClean(email);
    let cFirstname = this.generalService.deepClean(firstName);
    let cLastname = this.generalService.deepClean(lastName);

    let user = {};

    /**check if password is available to include for patching */
    if (password) {
      user = {
        username: cUsername,
        email: cEmail,
        firstName: cFirstname,
        lastName: cLastname,
        role: role,
        password: password,
      };
    } else {
      user = {
        username: cUsername,
        email: cEmail,
        firstName: cFirstname,
        lastName: cLastname,
        role: role,
      };
    }

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
