import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account-service.service';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { SupervisorService } from 'src/app/services/api/supervisor.service';
import { TeamService } from 'src/app/services/api/team.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-supervise-main-page',
  templateUrl: './supervise-main-page.component.html',
  styleUrls: ['./supervise-main-page.component.scss'],
})
export class SuperviseMainPageComponent implements OnInit {
  teams: any = [];
  projects: any = [];
  supervisorId!: string;
  supTeamCount = 0;
  supProjectCount = 0;

  /**used by search bar */
  searchText = '';

  earningsAmount = 20000; // Replace this with your actual earnings data
  theDifference = 30;
  currentTime = '11:00:00:11';
  todayDate = new Date().toString().split(' GMT')[0];

  /**variables used in team status */
  teamidArr: string[] = [];
  uniqueTeams: string[] = [];

  constructor(
    private supervisorService: SupervisorService,
    private accountService: AccountService,
    private teamService: TeamService,
    private projectStatusService: ProjectStatusService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.getSupervisor();
    this.getSupervisorTeams(this.supervisorId);
    this.getSupervisorProjects(this.supervisorId);
  }

  hasIncreased(): boolean {
    // Add your logic to determine if earnings have increased
    // For example, compare current earnings with previous earnings
    // Return true if increased, false otherwise
    return false /* your logic here */;
  }

  /**Get the supervisor's userId */
  getSupervisor() {
    /**Get the user from token */
    const user = this.accountService.getUser();
    if (user) {
      this.supervisorId = user._id;
    }
  }

  /**Get teams assigned to a given supervisor*/
  getSupervisorTeams(userId: string) {
    /**Get supervisor teams*/
    this.supervisorService.getSupervisorTeams(userId).subscribe({
      next: (supervisorTeams) => {
        console.log(supervisorTeams);
        this.teams = supervisorTeams;
        this.supTeamCount = supervisorTeams.length;
        /**get team members for each*/
        this.getTeamMembers();
        /**get team projects for each*/
        this.getTeamProjects();
        console.log(this.teams);
      },
      error: (err) => {
        console.log(err);
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
    /**get the team status here*/
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
        /**get unique teams*/
        this.uniqueTeams = [...new Set(this.teamidArr)];

        /**set status to active for each team in the unique array*/
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
            /**push number of projects to teams*/
            this.teams[i].projects = projects.length;
          });
      }
    }
  }

  /**Get the supervisor projects */
  getSupervisorProjects(userId: string) {
    /**Get supervisor projects*/
    this.supervisorService.getSupervisorProjects(userId).subscribe({
      next: (supervisorProjects) => {
        console.log(supervisorProjects);
        this.projects = supervisorProjects;
        this.supProjectCount = supervisorProjects.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**Set the team id in local storage to aid in the team-info component */
  captureTeamId(teamId: string) {
    this.generalService.captureTeamId(teamId);
  }
}
