import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account-service.service';
import { SupervisorService } from 'src/app/services/api/supervisor.service';

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

  constructor(
    private supervisorService: SupervisorService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getSupervisor();
    this.getSupervisorTeams(this.supervisorId);
    this.getSupervisorProjects(this.supervisorId);
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
      },
      error: (err) => {
        console.log(err);
      },
    });
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
}
