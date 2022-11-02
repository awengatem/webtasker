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
        for (let i = 0; i < this.documents.length; i++) {}
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTeamName(teamId: string): string {
    let result = '';
    this.teamService.getSpecificTeam(teamId).subscribe({
      next: (teamDoc) => {
        result = teamDoc.teamName;
      },
      error: (err) => {
        console.log(err);
      },
    });
    return result;
  }
}
