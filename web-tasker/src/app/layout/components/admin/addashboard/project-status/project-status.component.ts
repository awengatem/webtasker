import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss'],
})
export class ProjectStatusComponent implements OnInit {
  searchText = '';
  constructor() {}

  ngOnInit(): void {}
}
