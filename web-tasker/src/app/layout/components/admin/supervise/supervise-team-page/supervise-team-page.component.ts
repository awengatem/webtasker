import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervise-team-page',
  templateUrl: './supervise-team-page.component.html',
  styleUrls: ['./supervise-team-page.component.scss'],
})
export class SuperviseTeamPageComponent {
  members: any = [];
  projects: any = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.members = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.projects = [1, 1, 1, 1, 1, 1];
  }
}
