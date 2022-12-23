import { Component, OnInit } from '@angular/core';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import { UserAccountService } from 'src/app/services/api/user-account.service';

@Component({
  selector: 'app-ad-dashboard',
  templateUrl: './ad-dashboard.component.html',
  styleUrls: ['./ad-dashboard.component.scss'],
})
export class AdDashboardComponent implements OnInit {
  totalUsers = 0;
  totalProjects = 0;
  totalTeams = 0;
  activeUsers = 0;
  recentSessions = 0;
  productiveUsers = 0;
  breakUsers = 0;
  idleUsers = 0;
  coursesPercentage = 80;

  // arrays
  statusDocs = [];
  activeUserDocs = [];
  uniqueProjects: string[] = [];
  projectidArr: string[] = [];

  //percentages
  totalPerc = 100;
  productivePerc = 0;
  breakPerc = 0;
  idlePerc = 0;

  constructor(
    private userAccountService: UserAccountService,
    private projectService: ProjectService,
    private teamService: TeamService,
    private projectStatusService: ProjectStatusService
  ) {}

  ngOnInit(): void {
    this.getTotalUsers();
    this.getTotalProjects();
    this.getTotalTeams();
    this.getActiveUsers();
    this.getRecentDocs();
    this.getStatusDocs();
  }

  /**Get the number of total users */
  getTotalUsers() {
    this.userAccountService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /**Get the number of totalt projects */
  getTotalProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.totalProjects = projects.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**Get the number of total teams */
  getTotalTeams() {
    this.teamService.getAllTeams().subscribe({
      next: (teams) => {
        this.totalTeams = teams.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**getting number of active users from service */
  getActiveUsers() {
    this.projectStatusService
      .getActiveStatusDocs()
      .then((documents: any) => {
        this.activeUserDocs = documents;
        this.activeUsers = documents.length;
        //get projectids only
        if (this.activeUserDocs.length > 0) {
          this.activeUserDocs.forEach((doc: any) => {
            this.projectidArr.push(doc.project_id);
          });
        }
        //get unique projects
        // this.uniqueProjects = [...new Set(this.projectidArr)];
        // console.log(this.projectidArr);
        console.log(this.uniqueProjects);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**getting number of recent sessions */
  getRecentDocs() {
    this.projectStatusService
      .getRecentFDocs()
      .then((documents: any) => {
        this.recentSessions = documents.length;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**Getting user status statistics */
  getStatusDocs() {
    this.projectStatusService
      .getUserStatus()
      .then((documents: any) => {
        console.log(documents);
        this.statusDocs = documents;
        // categorize the status
        this.statusDocs.forEach((doc: any) => {
          if (doc.status === 'running') {
            this.productiveUsers++;
          } else if (doc.status === 'paused') {
            this.breakUsers++;
          } else if (doc.status === 'unproductive') {
            this.idleUsers++;
          }
        });
        //compute percentages
        this.productivePerc = (this.productiveUsers / this.totalUsers) * 100;
        this.breakPerc = (this.breakUsers / this.totalUsers) * 100;
        this.idlePerc = (this.idleUsers / this.totalUsers) * 100;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
