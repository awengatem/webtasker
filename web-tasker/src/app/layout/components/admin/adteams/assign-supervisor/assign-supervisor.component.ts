import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SupervisorService } from 'src/app/services/api/supervisor.service';
import { TeamService } from 'src/app/services/api/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-supervisor',
  templateUrl: './assign-supervisor.component.html',
  styleUrls: ['./assign-supervisor.component.scss'],
})
export class AssignSupervisorComponent {
  //used by dropdown list
  dropdownList: any = [];
  userArr: any = [];
  supervisorArr: any = [];
  selectedItems: any = [];
  dropdownSettings!: IDropdownSettings;

  teamId!: string;

  /** supervisors already assigned to team*/
  supervisors: any = [];

  constructor(
    private teamService: TeamService,
    private supervisorService: SupervisorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Subscribe first
    this.route.params.subscribe((params: Params) => {
      // console.log(params);
      // const teamId = params['teamId'];
      // this.teamId = teamId;
    });

    const teamId = localStorage.getItem('capturedTeamId')!;
    this.teamId = teamId;

    //get team members first
    //this.getTeamMembers(this.teamId);

    //then get dropdown list data
    this.getSupervisors();
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      defaultOpen: true,
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  //populating the dropdown list
  getSupervisors() {
    let tmp: any = [];
    let usernames: any = [];
    let tmp2: any = [];
    let supervisorArr: any = [];
    let usernameArr: any = [];

    //get supervisors already in team first
    this.supervisorService.getTeamSupervisors(this.teamId).subscribe({
      next: (supervisors: any) => {
        // supervisors.forEach((supervisor: any) => {
        //   console.log(supervisor.username);
        // });
        for (let i = 0; i < supervisors.length; i++) {
          tmp2.push(supervisors[i]);
          //get only the usernames of supervisors
          usernames.push(supervisors[i].username);
        }
        this.supervisors = tmp2;
        //console.log(this.supervisors);

        //get all supervisors in db
        this.supervisorService.getSupervisors().subscribe({
          next: (supervisors: any) => {
            //push usernames and supervisors to respective array
            for (let i = 0; i < supervisors.length; i++) {
              usernameArr.push(supervisors[i].username);
              supervisorArr.push(supervisors[i]);
            }

            //filter out supervisors already assigned to team
            let filtered = usernameArr.filter(
              (item: any) => !usernames.includes(item)
            );
            //console.log(filtered);

            //create dropdownlist array using filtered usernames
            for (let i = 0; i < filtered.length; i++) {
              tmp.push({ item_id: i, item_text: filtered[i] });
            }
            //add usernames to dropdown list and users to array
            this.dropdownList = tmp;
            this.supervisorArr = supervisorArr;
          },
          error: (err: any) => {
            console.log(err);
            Swal.fire('Oops! Something went wrong', err.error.message, 'error');
          },
        });
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  addMember() {
    let teamMembers: any = [];
    //ensure members are selected
    if (this.selectedItems.length > 0) {
      this.selectedItems.forEach((item: any) => {
        let userId;
        //get user account id
        for (let i = 0; i < this.userArr.length; i++) {
          if (this.userArr[i].username === item.item_text) {
            userId = this.userArr[i]._id;
          }
        }
        //hardcode object to match api
        //get the post team members payload
        teamMembers.push({ user_account_id: userId, team_id: this.teamId });
      });
      //console.log(teamMembers);

      //post them to db
      this.teamService.addTeamMembers(teamMembers).subscribe({
        next: (res: any) => {
          console.log(res);
          this.router.navigate([`/ad_teams/${this.teamId}`]);
          Swal.fire('Added!', `Members have been added`, 'success');
        },
        error: (err: any) => {
          console.log(err);
          Swal.fire('Oops! Something went wrong', err.error.message, 'error');
        },
      });
    } else if (this.selectedItems.length <= 0) {
      Swal.fire('Alert!', `Please select a member to add`, 'warning');
    }
  }
}
