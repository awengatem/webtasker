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
  // form: any = {
  //   other: null,
  // };
  reason: string = 'Short break';
  reasons: string[] = ['Tea break', 'Lunch break', 'Short break'];
  submitted: boolean = false;
  isTextAreaOpen: boolean = false;
  projectId!: string;

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
      this.projectId = projectId;
    });

    /**build form */
    this.form = this.fb.group({
      other: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  /**method to post reasom for pause to db */
  createDisposition() {
    // const { reason } = this.form; //data from template not here
    // //remove unneccessary whitespace
    // const cleanReason = this.generalService.clean(reason);
    // this.dispositionService.createDisposition(cleanReason).subscribe({
    //   next: (response: any) => {
    //     console.log(response);
    //     this.pauseTimer()
    //       .then(() => {
    //         Swal.fire(
    //           'Success!',
    //           `Your reason has been submitted and session paused successfully.`,
    //           'success'
    //         );
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //     this.router.navigate([`/projects/${this.projectId}/action`]);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     Swal.fire('Oops! Something went wrong', err.error.message, 'error');
    //   },
    // });
  }

  /**method to pause timer */
  pauseTimer() {
    return new Promise((resolve, reject) => {
      this.webSocketService.emit('pause', {});
      resolve(true);
    });
  }

  /**method to show text area */
  toggleTextArea(event: any, form: any) {
    const { other } = form.value;
    /**Show textarea if checked*/
    if (event.value === other) {
      console.log('other checked');
      this.isTextAreaOpen = true;
    } else {
      this.isTextAreaOpen = false;
    }
  }

  /**Method to submit the form */
  submitForm(form: any) {
    this.submitted = true;
    console.log(form.value);
  }
}
