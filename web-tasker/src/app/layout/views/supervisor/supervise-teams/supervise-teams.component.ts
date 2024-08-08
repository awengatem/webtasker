import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/api/team.service';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { TeamFilterPipe } from 'src/app/filter.pipe';

@Component({
  selector: 'app-supervise-teams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    TeamFilterPipe,
  ],
  templateUrl: './supervise-teams.component.html',
  styleUrl: './supervise-teams.component.scss',
})
export class SuperviseTeamsComponent implements OnInit {
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
    private projectStatusService: ProjectStatusService
  ) {}

  ngOnInit(): void {
    this.getTeams();
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      console.log(params);
    });
  }

  getTeams() {
    this.teamService.getAllTeams().subscribe((teams: any) => {
      this.teams = teams;
      /**pushs team status to teams*/
      this.teams.forEach((team) => (team.status = 'Unknown'));
      this.teamsLength = teams.length;
      //get team members for each
      this.getTeamMembers();
      //get team projects for each
      this.getTeamProjects();
      console.log(this.teams);
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
              } else {
                team.status = 'Unproductive';
              }
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
    /**store this in localstorage to aid in next component */
    localStorage.setItem('capturedTeamId', teamId);
  }

  submit() {
    this.submitted = true;
  }

  /**METHODS USED BY MODAL */
}
