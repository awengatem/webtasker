import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-team',
  templateUrl: './new-team.component.html',
  styleUrls: ['./new-team.component.scss']
})
export class NewTeamComponent implements OnInit {  
  form: any = {
    teamName: null,    
  };
  submitted: boolean = false;

  constructor(private teamService: TeamService, private router: Router) {}

  ngOnInit(): void {}

  createTeam() {
    const { teamName } = this.form; //data comes from template not here
    this.teamService.createTeam(teamName).subscribe({
      next: (response: any) => {
        console.log(response);
        //setting status to true to help in scrolldown method
        this.teamService.setAddStatus(true);
        //console.log(this.teamService.getAddStatus());
        this.router.navigate(['/ad_teams']);       
        Swal.fire('Success!', `Team "${teamName}" created successfully`, 'success');
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong',err.error.message, 'error',);        
      },
    });
  }

  submit(){
    this.submitted = true;
  }
}
