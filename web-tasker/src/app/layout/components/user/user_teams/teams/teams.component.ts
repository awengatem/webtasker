import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { TeamService } from 'src/app/services/api/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
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

  /**getting the teams */
  getTeams() {
    this.teamService.getUserTeams().subscribe((teams: any) => {
      this.teams = teams;
      /**pushs team status to teams*/
      this.teams.forEach((team) => (team.status = 'Unknown'));
      this.teamsLength = teams.length;
      //get team members and status for each
      this.getTeamMembers().then(() => {
        this.getTeamStatus();
      });
      this.getTeamProjects();
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

  /**Get team members for each */
  getTeamMembers() {
    return new Promise((resolve, reject) => {
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
      resolve(true);
    });
  }

  /**Get the team status from active status docs
   * identify active teams
   */
  getTeamStatus() {
    /**reset the active teams and projects variables */
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

  /**Get team projects for each */
  getTeamProjects() {
    if (this.teams.length > 0) {
      for (let i = 0; i < this.teams.length; i++) {
        this.teamService
          .getTeamProjects(this.teams[i]._id)
          .subscribe((projects: any) => {
            // console.log(projects.length);
            //push number of projects to teams
            this.teams[i].projects = projects.length;
          });
      }
    }
  }

  /**Set the team id in local storage to aid in the team-info component */
  captureTeamId(teamId: string) {
    /**store this in localstorage to aid in next compomnent */
    localStorage.setItem('capturedTeamId', teamId);
  }
}
