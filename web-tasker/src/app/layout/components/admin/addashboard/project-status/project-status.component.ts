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
  documents!: any[];
  projectsLength = 0;
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
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.composeProjectStatus();
    this.getActiveProjects();
    this.getProjectDuration();
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
    this.getProjects().then((projects: any) => {
      this.projects = projects;
      this.projectsLength = projects.length;
      //compute values for additional properties
      this.getProjectMembers();
      console.log(this.projects);
    });
  }

  /**Getting all projects */
  getProjects() {
    return new Promise<any>((resolve, reject) => {
      this.projectService.getAllProjects().subscribe({
        next: (documents: any) => {
          this.documents = documents;
          //add additional properties
          this.documents.forEach(
            (document: any) => (
              (document.members = 0),
              (document.teamCount = 0),
              (document.status = 'Unknown'),
              (document.duration = 0),
              (document.userPerc = 0)
            )
          );
          resolve(this.documents);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
      //get project members
      // this.getProjectMembers();
    });
  }

  /**Get project members */
  getProjectMembers() {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectService
          .getProjectMembers(this.projects[i]._id)
          .subscribe((members: any) => {
            // console.log(members.length);
            //push number of members to projects
            this.projects[i].members = members.length;
          });
        // adding the number of teams for UI
        this.projects[i].teamCount = this.projects[i].teams.length;
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
    this.projectStatusService
      .getProjectDuration('63527d2c5615ae0e6cb75528')
      .then((duration) => {
        console.log(duration);
      });
  }
}
