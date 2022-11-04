import { Component, OnInit } from '@angular/core';
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
  form: any = {
    reason: null,
  };
  submitted: boolean = false;
  projectId!: string;

  constructor(
    private dispositionService: DispositionService,
    private generalService: GeneralService,
    private webSocketService: SocketIoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const projectId = params['projectId'];
      this.projectId = projectId;
    });
  }

  /**method to post reasom for pause to db */
  createDisposition() {
    const { reason } = this.form; //data from template not here
    //remove unneccessary whitespace
    const cleanReason = this.generalService.clean(reason);
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
        this.router.navigate([`/project/${this.projectId}/action`]);
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

  submit() {
    this.submitted = true;
  }
}
