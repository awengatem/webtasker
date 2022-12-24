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
  documents2!: any[];
  docLength = 0;
  projectsLength = 0;
  projects!: any[];

  /**variables used by search and filter inputs */
  selectedValue = '';
  //must match default selected value
  propName = 'username';
  placeholder = 'enter username to search ...';

  /**note that the field properties should match the object
   * properties to be filtered
   */
  filterFields: { [key: string]: string } = {
    username: '',
    projectName: '',
    teamName: '',
    status: '',
    newDuration: '',
    startTime: '',
    finishTime: '',
  };
  filter = {};

  constructor(
    private projectStatusService: ProjectStatusService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getStatusDocs();
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

  /**getting documents from service */
  getStatusDocs() {
    this.projectStatusService
      .getStatusDocs()
      .then((documents: any) => {
        this.documents = documents;
        // console.log(this.documents);
        this.docLength = documents.length;
      })
      .catch((error) => {
        console.log(error);
      });
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
          this.documents2 = documents;
          //add additional properties
          this.documents2.forEach(
            (document: any) => (
              (document.members = 0),
              (document.duration = 0),
              (document.userPerc = 0)
            )
          );
          resolve(this.documents2);
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
      }
    }
  }
}
