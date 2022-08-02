import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /**local variables*/
  username!: string;
  projects!: any[];
  totalProjects: number = 0; 

  constructor(private account: AccountService, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getUsername();
    this.getProjects();
  }

  private getUsername(): any {
    this.username = this.account.getUser().username;
  }

  getProjects(){
    this.projectService.getProjects().subscribe((projects: any)=>{
      console.log(projects);
      this.projects = projects;
      this.totalProjects = projects.length;      
    });
  }
}
