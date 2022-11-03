import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { UserAccountService } from 'src/app/services/api/user-account.service';
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
  docLength = 0;

  constructor(private projectStatusService: ProjectStatusService) {}

  ngOnInit(): void {
    this.getStatusDocs();
  }

  /**what to do after select is changed */
  onSelected(): void {
    this.selectedValue = this.fields.nativeElement.value;
    console.log(this.selectedValue);
    /**clear the search bar text */
    this.searchText = '';
    this.placeholder = `enter ${this.selectedValue} to search ...`;
  }

  /**getting documents from service */
  getStatusDocs() {
    this.projectStatusService
      .getStatusDocs()
      .then((documents: any) => {
        this.documents = documents;
        this.docLength = documents.length;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
