import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss'],
})
export class ProjectStatusComponent implements OnInit {
  @ViewChild('fields') fields!: ElementRef;
  projectsLength = 0;
  totalUsers = 0;
  projects!: any[];
  activeSessionDocs: string[] = [];
  projectidArr: string[] = [];
  uniqueProjects: string[] = [];

  /**variables used by search and filter inputs */
  selectedValue = '';
  //must match default selected value
  propName = 'projectName';
  placeholder = 'enter project name to search ...';

  /**note that the field properties should match the object
   * properties to be filtered
   */
  filterFields: { [key: string]: string } = {
    projectName: '',
    teamCount: '',
    status: '',
    duration: '',
    userPerc: '',
  };
  filter = {};

  constructor(
    private projectStatusService: ProjectStatusService,
    private projectService: ProjectService,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit(): void {
    this.composeProjectStatus();
  }

  /**what to do after select is changed */
  onSelected(): void {
    this.selectedValue = this.fields.nativeElement.value;
    console.log(this.selectedValue);
    /**clear the search bar text */
    Object.keys(this.filterFields).forEach((key) => {
      this.filterFields[key] = '';
    });

    this.placeholder = `enter ${this.selectedValue} to search ...`;
    /**update the filter fields */
    this.propName = this.selectedValue;
  }

  /**ensure that we preserve only fields to be filtered */
  updateFilters() {
    Object.keys(this.filterFields).forEach((key) =>
      this.filterFields[key] === '' ? delete this.filterFields[key] : key
    );
    this.filter = Object.assign({}, this.filterFields);
    console.log(this.filter);
  }

  /**compose final project status */
  composeProjectStatus() {
    this.projectService.getProjects().then((projects: any) => {
      this.projects = projects;
      this.projectsLength = projects.length;
      /**compute values for additional properties
       * these methods must be in this scope where projects are available
       *  otherwise they don't work
       */
      this.getActiveProjects();
      this.getTotalUsers().then((totalUsers: any) => {
        this.getProjectMembers(totalUsers);
      });
      this.getProjectDuration();
      //get project teams
      this.getProjectTeams();
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
      }
    }
  }

  /**getting active projects from active sessions to determine status*/
  getActiveProjects() {
    this.projectStatusService
      .getActiveStatusDocs()
      .then((documents: any) => {
        this.activeSessionDocs = documents;
        //get projectids only
        if (this.activeSessionDocs.length > 0) {
          this.activeSessionDocs.forEach((doc: any) => {
            this.projectidArr.push(doc.project_id);
          });
        }
        //get unique projects
        this.uniqueProjects = [...new Set(this.projectidArr)];
        //get the active projects from total projects
        for (let i = 0; i < this.uniqueProjects.length; i++) {
          for (let j = 0; j < this.projects.length; j++) {
            if (this.uniqueProjects[i] == this.projects[j]._id) {
              this.projects[j].status = 'active';
            }
          }
        }
        for (let i = 0; i < this.projects.length; i++) {
          if (this.projects[i].status != 'active') {
            this.projects[i].status = 'dormant';
          }
        }
      })
      .catch((error) => {
        console.log(error);
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

  /**Get team projects for each */
  getProjectTeams() {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectService
          .getProjectTeams(this.projects[i]._id)
          .subscribe((teams: any) => {
            // console.log(teams.length);
            //push number of teams to projects
            this.projects[i].teams = teams.length;
          });
      }
    }
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

  /**Compute user percentage */
  computeUserPercentage() {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        let members = this.projects[i].members;
        console.log(members);
        console.log(this.totalUsers);
        let userPerc = Math.round((members / this.totalUsers) * 100);
        this.projects[i].userPerc = userPerc;
      }
    }
  }
}
