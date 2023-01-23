import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-project-teams',
  templateUrl: './project-teams.component.html',
  styleUrls: ['./project-teams.component.scss'],
})
export class ProjectTeamsComponent implements OnInit {
  projectId!: string;
  /**used by search bar */
  searchText = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      const projectId = params['projectId'];
      this.projectId = projectId;
    });
  }

  /**get teams */
  getProjectTeams(projectId: string){

  }
}
