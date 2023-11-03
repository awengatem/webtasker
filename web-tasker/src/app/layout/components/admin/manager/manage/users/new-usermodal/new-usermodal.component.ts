import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { GeneralService } from 'src/app/services/general.service';
import Swal from 'sweetalert2';
import Validation from '../../../../../../auth/login/validation';
import { genders, roles } from '../../../../../../../helpers/common/store';
import { CountyService } from 'src/app/services/api/county.service';
import { SiteService } from 'src/app/services/api/site.service';

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

  /**used by datepicker */
  minDate = new Date(1930, 0, 1);
  maxDate = new Date();
  date: any;
  genders = genders;
  counties: any;
  countySites: any;
  roles = roles;
  siteId = '';

  constructor(
    public modalRef: MdbModalRef<NewUsermodalComponent>,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private countyService: CountyService,
    private siteService: SiteService,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit(): void {
    /**get Counties from db */
    this.getCounties();

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
        dob: ['', [Validators.required]],
        idNo: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        gender: ['', [Validators.required]],
        telNo: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        site: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        county: ['', [Validators.required]],
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
  }

  /**Method to detect selection of county */
  changeCounty(e: any) {
    console.log(e.value);
    const county = e.value;

    /**populate the sites options immediately after county change */
    if (county) {
      /**Get the county sites */
      this.getCountySites(county.countyNumber);
    }
  }

  /**Method to detect selection of site */
  changeSite(e: any) {
    console.log(e.value);
    const site = e.value;

    /**populate the sites options immediately after county change */
    if (site) {
      this.siteId = site._id;
    }
  }

  /**Method to submit the form */
  submitForm(form: any) {
    this.submitted = true;
    // show form
    // console.log(form.value);
    //get the form values
    const {
      username,
      email,
      firstName,
      lastName,
      dob,
      idNo,
      gender,
      telNo,
      role,
      password,
    } = form.value;

    /**creating user object to pass to server
     *properties name's should not be changed
     */
    /**trim off white space before sending to server */
    let cUsername = this.generalService.deepClean(username);
    let cEmail = this.generalService.deepClean(email);
    let cFirstname = this.generalService.deepClean(firstName);
    let cLastname = this.generalService.deepClean(lastName);    
    const cDob = dob.toLocaleDateString();

    const user = {
      username: cUsername,
      email: cEmail,
      password: password,
      firstName: cFirstname,
      lastName: cLastname,
      dob: cDob,
      idNumber: idNo,
      gender: gender,
      telNumber: telNo,
      site_id: this.siteId,
      role: role,
    };
    console.log(user);
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

  /**Get counties from db */
  getCounties() {
    this.countyService.getCounties().subscribe({
      next: (data) => {
        // console.log(data);
        /**push county names to counies array */
        this.counties = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**Get county sites from db */
  getCountySites(countyNumber: string) {
    this.siteService.getCountySites(countyNumber).subscribe({
      next: (data) => {
        console.log(data);
        /**push county names to sites array */
        this.countySites = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**Method to close modal */
  close(): void {
    const closeMessage = 'New user modal closed';
    this.modalRef.close(closeMessage);
  }
}
