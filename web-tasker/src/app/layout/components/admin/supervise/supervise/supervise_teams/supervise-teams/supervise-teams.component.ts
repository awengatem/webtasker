import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervise-teams',
  templateUrl: './supervise-teams.component.html',
  styleUrls: ['./supervise-teams.component.scss'],
})
export class SuperviseTeamsComponent implements OnInit {
  teams: any = [];
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/supervise']);
  }

  ngOnInit(): void {
    this.teams = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  }
}
