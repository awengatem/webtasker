import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-teams',
  templateUrl: './project-teams.component.html',
  styleUrls: ['./project-teams.component.scss'],
})
export class ProjectTeamsComponent implements OnInit {
  /**used by search bar */
  searchText = '';

  constructor() {}

  ngOnInit(): void {}
}
