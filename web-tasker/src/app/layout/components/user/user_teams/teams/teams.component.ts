import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  teams!: any[];
  teamsLength = 0;
  teamDiv: any;
  teamStatus: any;
  submitted: boolean = false;
  /**used by search bar */
  searchText = '';

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTeams();
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      console.log(params);
    });
    this.scrollDown();
  }

  /**getting the teams */
  getTeams() {
    this.teamService.getUserTeams().subscribe((teams: any) => {
      console.log(teams);
      this.teams = teams;
      this.teamsLength = teams.length;
      //get team members for each
      this.getTeamMembers();
    });
  }

  /**scrolldown immediately after adding new team */
  scrollDown() {
    //ensuring intervals only run once
    if (this.teamService.getAddStatus() === true) {
      const setInterval_ID = window.setInterval(() => {
        this.teamDiv = document.getElementById('teams');
        this.teamDiv.scrollTop = this.teamDiv?.scrollHeight;
      }, 100);

      //stopping interval above after sometime
      window.setTimeout(() => {
        window.clearInterval(setInterval_ID);
      }, 500);
    }
    //unsetting the condition
    this.teamService.setAddStatus(false);
    //console.log(this.teamService.getAddStatus());
  }

  /**Get team members for each */
  getTeamMembers() {
    if (this.teams.length > 0) {
      for (let i = 0; i < this.teams.length; i++) {
        this.teamService
          .getTeamMembersDoc(this.teams[i]._id)
          .subscribe((members: any) => {
            console.log(members.length);
            //push number of members to teams
            this.teams[i].members = members.length;
          });
      }
    }
  }
}
