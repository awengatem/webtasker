import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss'],
})
export class ProjectStatusComponent implements OnInit {
  searchText = '';
  data = [1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  constructor() {}

  ngOnInit(): void {}
}
