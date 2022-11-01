import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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

  data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  constructor() {}

  ngOnInit(): void {}

  /**what to do after select is changed */
  onSelected(): void {
    this.selectedValue = this.fields.nativeElement.value;
    console.log(this.selectedValue);
    this.searchText = `enter ${this.selectedValue} to search ...`;
  }
}
