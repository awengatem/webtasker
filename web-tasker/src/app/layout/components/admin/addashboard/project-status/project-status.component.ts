import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss'],
})
export class ProjectStatusComponent implements OnInit {
  @ViewChild('fields') fields!: ElementRef;

  /**variables used by search and filter inputs */
  selectedValue = '';
  searchText = '';
  placeholder = 'enter username to search ...';
  documents!: any[];
  data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  /**variables for the status table */
  teamName: any;

  constructor(
    private projectStatusService: ProjectStatusService,
    private teamService: TeamService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {}

  /**what to do after select is changed */
  onSelected(): void {
    this.selectedValue = this.fields.nativeElement.value;
    console.log(this.selectedValue);
    this.searchText = `enter ${this.selectedValue} to search ...`;
  }

  /**get the project status docs from api */
  getStatusDocs() {
    this.projectStatusService.getProjectStatus().subscribe({
      next: (documents) => {
        //console.log(this.documents);
        this.documents = documents;
        //push new fields to retrieved documents
        this.documents.forEach(
          (document) => (
            (document.username = 'Unknown'),
            (document.projectName = 'Unknown'),
            (document.teamName = 'Unknown'),
            (document.newDuration = 'Unknown'),
            (document.startTime = 'Unknown'),
            (document.finishTime = 'Unknown')
          )
        );
        console.log(this.documents);
        //loop through the documents and assign new values
        for (let i = 0; i < this.documents.length; i++) {
          //assign team name
          this.getTeamName(this.documents[i].team_id).then((teamName) => {
            this.documents[i].teamName = teamName;
          });
          //assign project name
        }
        console.log(this.documents);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**get team name */
  getTeamName(teamId: string) {
    return new Promise((resolve, reject) => {
      this.teamService.getSpecificTeam(teamId).subscribe({
        next: (teamDoc) => {
          resolve(teamDoc.teamName);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**get project name */
  getProjectName(teamId: string) {
    return new Promise((resolve, reject) => {
      this.teamService.getSpecificTeam(teamId).subscribe({
        next: (teamDoc) => {
          resolve(teamDoc.teamName);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**get user name */
  getUserName(teamId: string) {
    return new Promise((resolve, reject) => {
      this.teamService.getSpecificTeam(teamId).subscribe({
        next: (teamDoc) => {
          resolve(teamDoc.teamName);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }
}
