import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';

@Component({
  selector: 'app-active-sessions',
  templateUrl: './active-sessions.component.html',
  styleUrls: ['./active-sessions.component.scss'],
})
export class ActiveSessionsComponent implements OnInit {
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
      .getActiveStatusDocs()
      .then((documents: any) => {
        this.documents = documents;
        this.docLength = documents.length;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
