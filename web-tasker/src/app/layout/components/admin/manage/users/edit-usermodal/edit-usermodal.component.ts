import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { GeneralService } from 'src/app/services/general.service';
import Swal from 'sweetalert2';
import Validation from '../../../../../auth/login/validation';
import { genders, roles } from '../../../../../../helpers/common/store';
import { CountyService } from 'src/app/services/api/county.service';
import { SiteService } from 'src/app/services/api/site.service';

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
  /**used by datepicker */
  minDate = new Date(1930, 0, 1);
  maxDate = new Date();
  date: any;
  genders = genders;
  counties: any;
  countyNames: any = [];
  countySites: any;
  countySiteNames: any = [];
  roles = roles;
  siteId = '';

  constructor(
    public modalRef: MdbModalRef<EditUsermodalComponent>,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private countyService: CountyService,
    private siteService: SiteService,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit(): void {
    /**get Counties from db */
    this.getCounties();

    /**build first form */
    this.defaultForm = this.fb.group({
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
      site: ['', [Validators.required]],
      county: ['', [Validators.required]],
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
        site: ['', [Validators.required]],
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

  /**Method to detect selection of county */
  changeCounty(e: any) {
    console.log(e.value);
    const countyName = e.value;
    /**reset the site field */
    this.form.controls['site'].setValue(null);

    /**populate the sites options immediately after county change */
    if (countyName) {
      /**loop through the county objects array and find countyNumber */
      for (let county of this.counties) {
        if (countyName === county.countyName) {
          /**Get the county sites */
          this.getCountySites(county.countyNumber);
        }
      }
    }
  }

  /**Method to detect selection of site */
  changeSite(e: any) {
    console.log(e.value);
    const siteName = e.value;

    /**populate the sites options immediately after county change */
    if (siteName) {
      /**loop through the site objects array and find siteNumber */
      for (let site of this.countySites) {
        if (siteName === site.siteName) {
          /**Set the site_id */
          this.siteId = site._id;
        }
      }
    }
  }

  /**Method to load the form with values to be patched */
  loadFieldsToEdit(userId: string) {
    this.userAccountService.getSpecificUser(userId).subscribe((user) => {
      console.log(user);
      this.form.controls['username'].setValue(user.username);
      this.form.controls['email'].setValue(user.email);
      this.form.controls['firstName'].setValue(user.firstName);
      this.form.controls['lastName'].setValue(user.lastName);
      this.form.controls['dob'].setValue(new Date(user.dob));
      this.form.controls['idNo'].setValue(user.idNumber);
      this.form.controls['gender'].setValue(user.gender);
      this.form.controls['telNo'].setValue(user.telNumber);
      this.form.controls['role'].setValue(user.role);
      this.siteId = user.site_id;

      /**get the rest of the fields from db */
      this.getSite(user.site_id).then((site: any) => {
        this.form.controls['site'].setValue(site.siteName);
        /**get the county of user's site */
        this.getCountyOfSite(site.countyNumber).then((county: any) => {
          this.form.controls['county'].setValue(county.countyName);
          /**Get the county sites */
          this.getCountySites(county.countyNumber);
        });
      });
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

    let user = {};

    /**check if password is available to include for patching */
    if (password) {
      user = {
        username: cUsername,
        email: cEmail,
        firstName: cFirstname,
        lastName: cLastname,
        dob: cDob,
        idNumber: idNo,
        gender: gender,
        telNumber: telNo,
        site_id: this.siteId,
        role: role,
        password: password,
      };
    } else {
      user = {
        username: cUsername,
        email: cEmail,
        firstName: cFirstname,
        lastName: cLastname,
        dob: dob,
        idNumber: idNo,
        gender: gender,
        telNumber: telNo,
        site_id: this.siteId,
        role: role,
      };
    }
    console.log(user);

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

  /**Get site from db */
  getSite(siteId: string) {
    return new Promise((resolve, reject) => {
      this.siteService.getSpecifiedSite(siteId).subscribe({
        next: (site) => {
          console.log(site);
          resolve(site);
        },
        error: (err) => {
          console.log(err);
          reject(err);
        },
      });
    });
  }

  /**Get county of site */
  getCountyOfSite(countyNumber: string) {
    return new Promise((resolve, reject) => {
      this.countyService.getCountyOfSite(countyNumber).subscribe({
        next: (county) => {
          console.log(county);
          resolve(county);
        },
        error: (err) => {
          console.log(err);
          reject(err);
        },
      });
    });
  }

  /**Get counties from db */
  getCounties() {
    this.countyService.getCounties().subscribe({
      next: (data) => {
        // console.log(data);
        /**push county objects to counties array */
        this.counties = data;
        /**push county names to county names array */
        this.counties.forEach((county: any) => {
          this.countyNames.push(county.countyName);
        });
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
        /**push county site objects to county sites array */
        this.countySites = data;
        /**empty county site names array first*/
        this.countySiteNames = [];
        /**push county site names to county site names array */
        this.countySites.forEach((site: any) => {
          this.countySiteNames.push(site.siteName);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**capitalize a word */
  capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  /**Method to close modal */
  close(): void {
    const closeMessage = 'Edit modal closed';
    this.modalRef.close(closeMessage);
  }
}
