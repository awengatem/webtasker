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
    /**update received userId */
    if (this.userId) this.receivedUserId = this.userId;
    console.log(this.receivedUserId);
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

  /**Method to load the form with values to be patched */
  loadFieldsToEdit(userId: string) {
    this.userAccountService.getSpecificUser(userId).subscribe((user) => {
      console.log(user);
      // this.massage = null;
      // this.dataSaved = false;
      // this.employeeIdUpdate = employee.EmpId;
      // this.employeeForm.controls['FirstName'].setValue(employee.FirstName);
      // this.employeeForm.controls['LastName'].setValue(employee.LastName);
      // this.employeeForm.controls['DateofBirth'].setValue(employee.DateofBirth);
      // this.employeeForm.controls['EmailId'].setValue(employee.EmailId);
      // this.employeeForm.controls['Gender'].setValue(employee.Gender);
      // this.employeeForm.controls['Address'].setValue(employee.Address);
      // this.employeeForm.controls['Pincode'].setValue(employee.Pincode);
      // this.employeeForm.controls['Country'].setValue(employee.CountryId);
      // this.allState = this.employeeService.getState(employee.CountryId);
      // this.CountryId = employee.CountryId;
      // this.employeeForm.controls['State'].setValue(employee.StateId);
      // this.allCity = this.employeeService.getCity(employee.StateId);
      // this.StateId = employee.StateId;
      // this.employeeForm.controls['City'].setValue(employee.Cityid);
      // this.CityId = employee.Cityid;
      // this.isMale = employee.Gender.trim() == '0' ? true : false;
      // this.isFeMale = employee.Gender.trim() == '1' ? true : false;
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
    this.userAccountService.editUser(this.receivedUserId, user).subscribe({
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
    const closeMessage = 'Edit modal closed';
    this.modalRef.close(closeMessage);
  }
}
