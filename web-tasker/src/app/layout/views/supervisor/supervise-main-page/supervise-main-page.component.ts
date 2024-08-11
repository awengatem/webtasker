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

  /**used by search bar */
  searchText = '';

  //immanuel stuff
  //please delete if not useful
  isActive = false;
  earningsAmount = 20000; // Replace this with your actual earnings data
  theDifference = 30;
  currentTime = '11:00:00:11';
  bounceAnimationTrigger = true;
  todayDate = new Date().toString().split(' GMT')[0];

  constructor(
    private supervisorService: SupervisorService,
    private accountService: AccountService
  ) {}

  // Method to trigger animation and change color
  startBounceAnimation() {
    this.bounceAnimationTrigger = !this.bounceAnimationTrigger;
  }

  hasIncreased(): boolean {
    // Add your logic to determine if earnings have increased
    // For example, compare current earnings with previous earnings
    // Return true if increased, false otherwise
    return false /* your logic here */;
  }
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
