import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { TeamService } from 'src/app/services/api/team.service';
import { GeneralService } from 'src/app/services/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-teammodal',
  templateUrl: './new-teammodal.component.html',
  styleUrls: ['./new-teammodal.component.scss'],
})
export class NewTeammodalComponent {
  form: any = {
    teamName: null,
  };
  submitted: boolean = false;

  constructor(
    public modalRef: MdbModalRef<NewTeammodalComponent>,
    private teamService: TeamService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {}

  createTeam() {
    const { teamName } = this.form; //data comes from template not here
    //remove unnecessary whitespace
    const newTeam = this.generalService.clean(teamName);
    this.teamService.createTeam(newTeam).subscribe({
      next: (response: any) => {
        console.log(response);
        //setting status to true to help in scrolldown method
        this.teamService.setAddStatus(true);
        //console.log(this.teamService.getAddStatus());
        this.close();
        Swal.fire(
          'Success!',
          `Team "${newTeam}" created successfully`,
          'success'
        );
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  submit() {
    this.submitted = true;
  }

  /**Method to close modal */
  close(): void {
    const closeMessage = 'New team modal closed';
    this.modalRef.close(closeMessage);
  }
}
