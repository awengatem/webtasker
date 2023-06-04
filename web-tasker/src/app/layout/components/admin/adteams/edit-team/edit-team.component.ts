import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { TeamService } from 'src/app/services/api/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss'],
})
export class EditTeamComponent implements OnInit {
  form: any = {
    teamName: null,
  };
  submitted: boolean = false;
  teamId!: string;

  constructor(
    private teamService: TeamService,
    private generalService: GeneralService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      // this.teamId = params['teamId'];
      // console.log(this.teamId);
    });
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
        this.navigateBack();
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

  /**Method to navigate to previous route */
  navigateBack() {
    //check if previous location is from manage component
    let fromMng = window.sessionStorage.getItem('fromMng');
    if (fromMng === 'true') {
      //navigate to manager
      this.router.navigate(['ad_manage/teams']);
    } else {
      this.router.navigate(['/ad_teams']);
    }
  }

  submit() {
    this.submitted = true;
  }
}
