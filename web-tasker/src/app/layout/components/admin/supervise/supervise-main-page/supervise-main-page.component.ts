import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account-service.service';
import { SupervisorService } from 'src/app/services/api/supervisor.service';

@Component({
  selector: 'app-supervise-main-page',
  templateUrl: './supervise-main-page.component.html',
  styleUrls: ['./supervise-main-page.component.scss'],
})
export class SuperviseMainPageComponent implements OnInit {
  teams: any = [];
  supervisorId!: string;
  supervisorTeamsCount = 0;

  constructor(
    private supervisorService: SupervisorService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getSupervisor();
    this.getSupervisorTeams(this.supervisorId);
  }

  /**get the supervisor's userId */
  getSupervisor() {
    /**Get the user from token */
    const user = this.accountService.getUser();
    if (user) {
      this.supervisorId = user._id;
    }
  }

  /**Get teams assigned to a given supervisor*/
  getSupervisorTeams(userId: string) {
    /**Get supervisor teams*/
    this.supervisorService.getSupervisorTeams(userId).subscribe({
      next: (supervisorTeams) => {
        console.log(supervisorTeams);
        this.teams = supervisorTeams;
        this.supervisorTeamsCount = supervisorTeams.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
