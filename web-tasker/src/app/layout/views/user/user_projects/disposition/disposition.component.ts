import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DispositionService } from 'src/app/services/api/disposition.service';
import { GeneralService } from 'src/app/services/general.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-disposition',
  templateUrl: './disposition.component.html',
  styleUrls: ['./disposition.component.scss'],
})
export class DispositionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  defaultForm: FormGroup = new FormGroup({});
  otherForm: FormGroup = new FormGroup({});
  reasons: string[] = ['Tea break', 'Lunch break', 'Short break'];
  reason: string = this.reasons[2]; //this is used as default selected value
  submitted: boolean = false;
  isTextAreaOpen: boolean = false;
  projectId!: string;
  teamId!: string;

  constructor(
    private dispositionService: DispositionService,
    private generalService: GeneralService,
    private fb: FormBuilder,
    private webSocketService: SocketIoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const projectId = params['projectId'];
      const teamId = params['teamId'];
      this.projectId = projectId;
      this.teamId = teamId;
    });

    /**build forms */
    this.defaultForm = this.fb.group({
      reason: this.reason,
    });
    this.otherForm = this.fb.group({
      other: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
    });
    /**initialize default form*/
    this.form = this.defaultForm;
  }

  /**method to post reasom for pause to db */
  createDisposition(form: any) {
    const { reason, other } = form.value;
    let reasonTxt = '';
    /**get the user input reason */
    if (reason) {
      reasonTxt = reason;
    } else if (other) {
      reasonTxt = other;
    }
    console.log(reasonTxt);
    //remove unneccessary whitespace
    const cleanReason = this.generalService.clean(reasonTxt);
    this.dispositionService.createDisposition(cleanReason).subscribe({
      next: (response: any) => {
        console.log(response);
        this.pauseTimer()
          .then(() => {
            Swal.fire(
              'Success!',
              `Your reason has been submitted and session paused successfully.`,
              'success'
            );
          })
          .catch((err) => {
            console.log(err);
          });
        this.router.navigate([
          `/projects/${this.projectId}/${this.teamId}/action`,
        ]);
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**method to pause timer */
  pauseTimer() {
    return new Promise((resolve, reject) => {
      this.webSocketService.emit('pause', {});
      resolve(true);
    });
  }

  /**method to show text area */
  toggleTextArea(event: any) {
    /**Swap forms if checked*/
    if (event.value === 'other') {
      this.isTextAreaOpen = true;
      this.form = this.otherForm;
    } else {
      /**attach selected value to default form */
      this.isTextAreaOpen = false;
      this.defaultForm = this.fb.group({
        reason: event.value,
      });
      this.form = this.defaultForm;
    }
  }

  /**Method to submit the form */
  submitForm(form: any) {
    this.submitted = true;
    console.log(form.value);
    //proceed to submit form to db
    this.createDisposition(form);
  }
}
