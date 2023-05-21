import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { TeamService } from 'src/app/services/api/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ad-teams',
  templateUrl: './ad-teams.component.html',
  styleUrls: ['./ad-teams.component.scss'],
})
export class AdTeamsComponent implements OnInit {
  teams!: any[];
  teamsLength = 0;
  teamDiv: any;
  teamStatus: any;
  submitted: boolean = false;
  /**used by search bar */
  searchText = '';

  /**variables used in team status */
  teamidArr: string[] = [];
  uniqueTeams: string[] = [];

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private projectStatusService: ProjectStatusService
  ) {}

  ngOnInit(): void {
    this.getTeams();
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      console.log(params);
    });
    this.scrollDown();
  }

  getTeams() {
    this.teamService.getAllTeams().subscribe((teams: any) => {
      this.teams = teams;
      /**pushs team status to teams*/
      this.teams.forEach((team) => (team.status = 'Unknown'));
      this.teamsLength = teams.length;
      //get team members for each
      this.getTeamMembers();
      console.log(this.teams);
    });
  }

  /**scrolldown immediately after adding new team */
  scrollDown() {
    //ensuring intervals only run once
    if (this.teamService.getAddStatus() === true) {
      const setInterval_ID = window.setInterval(() => {
        this.teamDiv = document.getElementById('teams');
        this.teamDiv.scrollTop = this.teamDiv?.scrollHeight;
      }, 100);

      //stopping interval above after sometime
      window.setTimeout(() => {
        window.clearInterval(setInterval_ID);
      }, 500);
    }
    //unsetting the condition
    this.teamService.setAddStatus(false);
    //console.log(this.teamService.getAddStatus());
  }

  /**ACTION METHODS USED BY ALERT*/
  alertConfirmation(teamId: string, teamName: string) {
    Swal.fire({
      title: `Delete "${teamName}"?`,
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete team from db
      if (result.value) {
        this.deleteteam(teamId, teamName);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          `Team "${teamName}" still in our database.)`,
          'error'
        );
      }
    });
  }

  /**Delete method */
  deleteteam(teamId: string, teamName: string) {
    this.teamService.deleteTeam(teamId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.router.navigate(['/ad_teams']);
        Swal.fire('Removed!', `team "${teamName}" has been removed`, 'success');
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Get team members for each */
  getTeamMembers() {
    if (this.teams.length > 0) {
      for (let i = 0; i < this.teams.length; i++) {
        this.teamService
          .getTeamMembersDoc(this.teams[i]._id)
          .subscribe((members: any) => {
            // console.log(members.length);
            //push number of members to teams
            this.teams[i].members = members.length;
          });
      }
    }
    //get the team status here
    this.getTeamStatus();
  }

  /**Get the team status from active status docs
   * identify active teams
   */
  getTeamStatus() {
    /**reset the active teams and teams variables */
    this.uniqueTeams = [];

    this.projectStatusService
      .getActiveStatusDocs()
      .then((documents: any) => {
        /**capture the team ids */
        if (documents.length > 0) {
          for (let doc of documents) {
            this.teamidArr.push(doc.team_id);
          }
        }
        //get unique teams
        this.uniqueTeams = [...new Set(this.teamidArr)];

        //set status to active for each team in the unique array
        if (this.teams.length > 0) {
          for (let team of this.teams) {
            for (let id of this.uniqueTeams) {
              if (id === team._id) {
                team.status = 'Active';
              }
            }
          }
          //set others to unproductive
          for (let team of this.teams) {
            if (team.status != 'Active') {
              team.status = 'Unproductive';
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  submit() {
    this.submitted = true;
  }

  /**Set the team id in local storage to aid in the team-info component */
  captureTeamId(teamId: string) {
    /**store this in localstorage to aid in next compomnent */
    localStorage.setItem('capturedTeamId', teamId);
  }
}
