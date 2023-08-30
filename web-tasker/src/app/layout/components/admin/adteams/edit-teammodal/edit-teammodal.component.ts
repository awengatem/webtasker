import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { TeamService } from 'src/app/services/api/team.service';
import { GeneralService } from 'src/app/services/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-teammodal',
  templateUrl: './edit-teammodal.component.html',
  styleUrls: ['./edit-teammodal.component.scss'],
})
export class EditTeammodalComponent implements OnInit {
  form: any = {
    teamName: null,
  };
  submitted: boolean = false;
  teamId!: string;

  constructor(
    public modalRef: MdbModalRef<EditTeammodalComponent>,
    private teamService: TeamService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    const teamId = localStorage.getItem('capturedTeamId')!;
    this.teamId = teamId;

    //get the selected team
    if (this.teamId) {
      this.loadFieldsToEdit(this.teamId);
      document.getElementById('autofocus')!.focus();
    }
  }

  /**edit method */
  editTeam() {
    const { teamName } = this.form; //data comes from template not here
    //remove unnecessary whitespace
    const newTeam = this.generalService.clean(teamName);
    this.teamService.editTeam(this.teamId, newTeam).subscribe({
      next: (response: any) => {
        console.log(response);
        //setting status to true to help in scrolldown method
        this.teamService.setAddStatus(true);
        //console.log(this.teamService.getAddStatus());
        // this.navigateBack();
        Swal.fire(
          'Success!',
          `team "${newTeam}" updated successfully`,
          'success'
        );
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Method to load the form with values to be patched */
  loadFieldsToEdit(teamId: string) {
    this.teamService.getSpecificTeam(teamId).subscribe((team) => {
      console.log(team);
      this.form.teamName = team.teamName;
    });
  }

  submit() {
    this.submitted = true;
  }

  /**Method to close modal */
  close(): void {
    const closeMessage = 'Edit team modal closed';
    this.modalRef.close(closeMessage);
  }
}
