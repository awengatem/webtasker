import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { TeamService } from 'src/app/services/api/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-team',
  templateUrl: './new-team.component.html',
  styleUrls: ['./new-team.component.scss'],
})
export class NewTeamComponent implements OnInit {
  form: any = {
    teamName: null,
  };
  submitted: boolean = false;

  constructor(
    private teamService: TeamService,
    private router: Router,
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
        this.navigateBack();
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

  /**Method to navigate to previous route */
  navigateBack() {
    //check if previous location is from manage component
    let fromMng = window.sessionStorage.getItem('fromMng');
    if (fromMng === 'true') {
      //navigate to manager
      this.router.navigate(['ad_manage/teams']);
      //clear previous location
      window.sessionStorage.removeItem('fromMng');
    } else {
      this.router.navigate(['/ad_teams']);
    }
  }

  submit() {
    this.submitted = true;
  }
}
