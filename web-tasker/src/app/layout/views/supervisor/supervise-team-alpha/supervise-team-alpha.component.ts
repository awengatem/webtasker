import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../../../angular-material.module';

@Component({
  selector: 'app-supervise-team-alpha',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularMaterialModule],
  templateUrl: './supervise-team-alpha.component.html',
  styleUrls: ['./supervise-team-alpha.component.scss']
})
export class SuperviseTeamAlphaComponent implements OnInit {
  activeMembers: any[] = [
    { firstName: 'John', lastName: 'Doe', role: 'Team Lead', status: 'active' },
    { firstName: 'Jane', lastName: 'Smith', role: 'Developer', status: 'active' },
    { firstName: 'Mike', lastName: 'Johnson', role: 'Designer', status: 'active' },
    { firstName: 'Sarah', lastName: 'Wilson', role: 'Developer', status: 'active' }
  ];

  teamMembers: any[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', role: 'Team Lead', email: 'john@example.com', projects: 3, earnings: 5000 },
    { id: 2, firstName: 'Jane', lastName: 'Smith', role: 'Developer', email: 'jane@example.com', projects: 2, earnings: 4000 },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', role: 'Designer', email: 'mike@example.com', projects: 2, earnings: 4500 },
    { id: 4, firstName: 'Sarah', lastName: 'Wilson', role: 'Developer', email: 'sarah@example.com', projects: 3, earnings: 4800 },
    { id: 5, firstName: 'Tom', lastName: 'Brown', role: 'Developer', email: 'tom@example.com', projects: 1, earnings: 3500 }
  ];

  projects: any[] = [
    { id: 1, name: 'E-commerce Platform', members: 3, status: 'Active', completion: 75 },
    { id: 2, name: 'Mobile App', members: 2, status: 'Active', completion: 45 },
    { id: 3, name: 'CRM System', members: 4, status: 'Active', completion: 60 },
    { id: 4, name: 'Analytics Dashboard', members: 2, status: 'Pending', completion: 30 }
  ];

  totalEarnings: number = this.teamMembers.reduce((sum, member) => sum + member.earnings, 0);
  
  tabs: string[] = ['Team Members', 'Projects', 'Earnings'];
  activeTabIndex: number = 0;

  constructor() {}

  ngOnInit() {
    // Initialize your data here
  }

  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  getTotalProjects(): number {
    return this.projects.length;
  }

  getActiveProjects(): number {
    return this.projects.filter(p => p.status === 'Active').length;
  }
  
}
