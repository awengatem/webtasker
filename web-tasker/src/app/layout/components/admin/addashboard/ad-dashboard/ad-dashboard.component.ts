import { Component, OnInit } from '@angular/core';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import Chart from 'chart.js/auto';

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
  projectsLength = 0;

  // arrays
  statusDocs = [];
  activeUserDocs = [];
  projects!: any[];
  projectidArr: string[] = [];
  teamidArr: string[] = [];
  uniqueProjects: string[] = [];
  uniqueTeams: string[] = [];

  //percentages
  totalPerc = 100;
  productivePerc = 0;
  breakPerc = 0;
  idlePerc = 0;
  activeUsersPerc = 0;
  activeProjectsPerc = 0;
  activeTeamsPerc = 0;

  // chart
  public chart: any;

  constructor(
    private userAccountService: UserAccountService,
    private projectService: ProjectService,
    private teamService: TeamService,
    private projectStatusService: ProjectStatusService
  ) {}

  ngOnInit(): void {
    this.init();
    // refresh data every 20 seconds
    window.setInterval(() => {
      this.init();
    }, 20000);
  }

  /**Initialize fetching of data */
  init() {
    // reset push arrays
    this.projectidArr = [];
    this.teamidArr = [];
    // initiate methods
    this.getTotalUsers();
    this.getTotalProjects();
    this.getTotalTeams();
    this.getRecentDocs();
    this.getStatusDocs();
    this.getActiveUsers();
    this.composeProjectStatus();
    this.createChart();
  }

  /**Get the number of total users */
  getTotalUsers() {
    return new Promise((resolve, reject) => {
      this.userAccountService.getUsers().subscribe({
        next: (users) => {
          this.totalUsers = users.length;
          resolve(this.totalUsers);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
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
        //get projectids and teamids only
        if (this.activeUserDocs.length > 0) {
          this.activeUserDocs.forEach((doc: any) => {
            this.projectidArr.push(doc.project_id);
            this.teamidArr.push(doc.team_id);
          });
        }
        //get unique projects
        this.uniqueProjects = [...new Set(this.projectidArr)];
        //get unique teams
        this.uniqueTeams = [...new Set(this.teamidArr)];
        //compute active percentages
        this.activeUsersPerc = Math.round(
          (this.activeUsers / this.totalUsers) * 100
        );
        this.activeProjectsPerc = Math.round(
          (this.uniqueProjects.length / this.totalProjects) * 100
        );
        this.activeTeamsPerc = Math.round(
          (this.uniqueTeams.length / this.totalTeams) * 100
        );
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
        // console.log(documents);
        this.statusDocs = documents;
        // categorize the status
        let productive = 0;
        let paused = 0;
        let idle = 0;
        this.statusDocs.forEach((doc: any) => {
          if (doc.status === 'running') {
            productive++;
          } else if (doc.status === 'paused') {
            paused++;
          } else if (doc.status === 'unproductive') {
            idle++;
          }
        });
        this.productiveUsers = productive;
        this.breakUsers = paused;
        this.idleUsers = idle;
        //compute percentages
        this.productivePerc = (this.productiveUsers / this.totalUsers) * 100;
        this.breakPerc = (this.breakUsers / this.totalUsers) * 100;
        this.idlePerc = (this.idleUsers / this.totalUsers) * 100;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**compose project status for the projects div */
  composeProjectStatus() {
    this.projectService.getProjects().then((projects: any) => {
      this.projects = projects;
      this.projectsLength = projects.length;
      /**compute values for additional properties
       * these methods must be in this scope where projects are available
       *  otherwise they don't work
       */
      this.getTotalUsers().then((totalUsers: any) => {
        this.getProjectMembers(totalUsers);
      });
      this.getProjectDuration();
      console.log(this.projects);
    });
  }

  /**Get project members */
  getProjectMembers(totalUsers: number) {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectService
          .getProjectMembers(this.projects[i]._id)
          .subscribe((members: any) => {
            // console.log(members.length);
            //push number of members to projects
            this.projects[i].members = members.length;
            // calculate user percentage
            let userPerc = Math.round((members.length / totalUsers) * 100);
            this.projects[i].userPerc = userPerc;
          });
        // adding the number of teams for UI
        this.projects[i].teamCount = this.projects[i].teams.length;
      }
    }
  }

  /**getting and computing the total duration per project */
  getProjectDuration() {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectStatusService
          .getProjectDuration(this.projects[i]._id)
          .then((duration) => {
            this.projects[i].duration = duration;
          });
      }
    }
  }

  /**Method to create chart */
  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: [
          '2022-05-10',
          '2022-05-11',
          '2022-05-12',
          '2022-05-13',
          '2022-05-14',
          '2022-05-15',
          '2022-05-16',
          '2022-05-17',
        ],
        datasets: [
          {
            label: 'Sales',
            data: ['467', '576', '572', '79', '92', '574', '573', '576'],
            backgroundColor: 'blue',
          },
          {
            label: 'Profit',
            data: ['542', '542', '536', '327', '17', '0.00', '538', '541'],
            backgroundColor: 'limegreen',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
