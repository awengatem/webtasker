import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {
  form: any = {
    teamName: null,
  };
  submitted: boolean = false;
  teamId!: string;

  constructor(
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  //getting capturedTeam
  capturedTeam!: string;

  ngOnInit(): void {
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      this.teamId = params['teamId'];
      console.log(this.teamId);
    });

    //get the selected team
    this.capturedTeam = this.teamService.getCapturedTeam();
    this.form.teamName = this.capturedTeam;
  }

  /**edit method */
  editTeam() {
    const { teamName } = this.form; //data comes from template not here
    this.teamService.editTeam(this.teamId, teamName).subscribe({
      next: (response: any) => {
        console.log(response);
        //setting status to true to help in scrolldown method
        this.teamService.setAddStatus(true);
        //console.log(this.teamService.getAddStatus());
        this.router.navigate(['/ad_teams']);
        Swal.fire('Success!', `team "${teamName}" updated successfully`, 'success');        
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong',err.error.message, 'error');        
      },
    });
  }

  submit() {
    this.submitted = true;
  }
}
