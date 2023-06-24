import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss'],
})
export class TeamsPageComponent {
  members: any = [];
  projects: any = [];
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/supervise_teams']);
  }

  ngOnInit(): void {
    this.members = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.projects = [1, 1, 1, 1, 1, 1];
  }
}
