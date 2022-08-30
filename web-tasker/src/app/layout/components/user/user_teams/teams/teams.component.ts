import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams!: any[];
  teamDiv: any;
  teamStatus: any;

  /**Used by modal */
  form: any = {
    teamName: null,
  };
  submitted: boolean = false;

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

  getTeams() {
    this.teamService.getAllTeams().subscribe((teams: any) => {
      console.log(teams);
      this.teams = teams;
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

  /**Capture team to help load it to edit component */
  captureTeam(team: string) {
    this.teamService.setCapturedTeam(team);
  } 
}
