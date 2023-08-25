import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupervisorService } from 'src/app/services/api/supervisor.service';

@Component({
  selector: 'app-supervise-main-page',
  templateUrl: './supervise-main-page.component.html',
  styleUrls: ['./supervise-main-page.component.scss'],
})
export class SuperviseMainPageComponent implements OnInit {
  teams: any = [];
  supervisorTeamsCount = 0;

  constructor(private supervisorService: SupervisorService) {}

  ngOnInit(): void {
    this.teams = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    this.getSupervisorTeams('63bb57a9222b3a4015e0699b');
  }

  /**Get teams assigned to a given supervisor*/
  getSupervisorTeams(userId: string) {
    /**Get supervisor teams*/
    this.supervisorService.getSupervisorTeams(userId).subscribe({
      next: (supervisorTeams) => {
        console.log(supervisorTeams);
        this.supervisorTeamsCount = supervisorTeams.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
