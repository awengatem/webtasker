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
  //must match default selected value
  propName = 'username';
  placeholder = 'enter username to search ...';
  documents!: any[];
  docLength = 0;

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

  constructor(private projectStatusService: ProjectStatusService) {}

  ngOnInit(): void {
    this.getStatusDocs();
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
      .getActiveStatusDocs()
      .then((documents: any) => {
        this.documents = documents;
        this.docLength = documents.length;
        console.log(this.documents);        
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
