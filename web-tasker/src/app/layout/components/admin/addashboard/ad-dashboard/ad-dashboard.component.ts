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
  memberChartArr!: any[];
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
  labels = [1, 2, 3, 4, 5, 6, 7];
  chartData = {
    labels: this.labels,
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  };

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
    }, 2000000);
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
    // this.createChart();
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

  /**compose project status for the projects div and draw the chart */
  composeProjectStatus() {
    this.projectService.getProjects().then((projects: any) => {
      this.projects = projects;
      this.projectsLength = projects.length;
      /**compute values for additional properties
       * these methods must be in this scope where projects are available
       *  otherwise they don't work
       */
      this.getTotalUsers().then((totalUsers: any) => {
        this.getProjectMembers(totalUsers).then((projects: any) => {
          // split resolved member chart array
          let result = this.splitMemberChartArr(projects);
          console.log(result);
        });
      });
      this.getProjectDuration();
      console.log(this.projects);
    });
  }

  /**Get project members ===> then
   * resolves object pair array of project name and members
   */
  getProjectMembers(totalUsers: number) {
    return new Promise((resolve, reject) => {
      if (this.projects.length > 0) {
        let memberArr: any = [];
        let x = 0;
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
              // prepare object to be used by chart
              let obj = {
                members: members.length,
                projectName: this.projects[i].projectName,
              };
              memberArr.push(obj);
              x++;
              //resolve array from within here where its available
              if (x === this.projects.length) resolve(memberArr);
            });
          // adding the number of teams for UI
          this.projects[i].teamCount = this.projects[i].teams.length;
        }
      }
    });
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

  /**method to split memberChartArr */
  splitMemberChartArr(memberChartArr: any[]) {
    let array = memberChartArr,
      result = array.reduce((r, o) => {
        Object.entries(o).forEach(([k, v]) => (r[k] = r[k] || []).push(v));
        return r;
      }, Object.create(null));

    return result;
  }

  /**Method to create chart */
  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'bar', //this denotes tha type of chart
      data: this.chartData,
      options: {
        aspectRatio: 3.0,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
