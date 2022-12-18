import { Component, OnInit } from '@angular/core';
import { UserAccountService } from 'src/app/services/api/user-account.service';

@Component({
  selector: 'app-ad-dashboard',
  templateUrl: './ad-dashboard.component.html',
  styleUrls: ['./ad-dashboard.component.scss'],
})
export class AdDashboardComponent implements OnInit {
  totalUsers = 0;
  totalProjects = 0;
  totalTeams = 0;
  constructor(private userAccountService: UserAccountService) {}

  ngOnInit(): void {}

  /**Get the number of total users */
  getTotalUsers() {
    this.userAccountService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /**Get the number of totalt projects */
  getTotalProjects() {
    
  }

  /**Get the number of total teams */
  getTotalTeams() {}
}
