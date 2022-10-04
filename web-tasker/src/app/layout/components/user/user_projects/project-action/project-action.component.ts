import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-action',
  templateUrl: './project-action.component.html',
  styleUrls: ['./project-action.component.scss']
})
export class ProjectActionComponent implements OnInit {
  /**local variables */
  activeStatus: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
