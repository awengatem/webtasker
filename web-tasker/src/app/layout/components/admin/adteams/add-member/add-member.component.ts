import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {
  //used by dropdown list
  dropdownList: any = [];
  userArr: any = [];
  selectedItems: any = [];
  dropdownSettings!: IDropdownSettings;

  teamId!: string;

  //members already in team
  members: any = [];

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Joe' },
    //   { item_id: 2, item_text: 'Frank' },
    //   { item_id: 3, item_text: 'Joy' },
    //   { item_id: 4, item_text: 'Purity' },
    //   { item_id: 5, item_text: 'John' }
    // ];
    //Subscribe first
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      const teamId = params['teamId'];
      this.teamId = teamId;
    });

    //get team members first
    //this.getTeamMembers(this.teamId);

    //then get dropdown list data
    this.getUsers();
    this.selectedItems = [
      //{ item_id: 3, item_text: 'Pune' },
      //{ item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  //populating the dropdown list
  getUsers() {
    let tmp: any = [];
    let filteredTmp: any = [];
    let tmp2: any = [];
    let userArr: any = [];
    let test: any = [];

    //get members already in team first
    this.teamService.getTeamMembers(this.teamId).subscribe({
      next: (members: any) => {
        // members.forEach((member: any) => {
        //   console.log(member.username);
        // });
        for (let i = 0; i < members.length; i++) {
          tmp2.push(members[i]);
        }
        this.members = tmp2;
        console.log(this.members);

        //get all users in db
        this.teamService.getUsers().subscribe({
          next: (users: any) => {
            //push usernames and users to respective array
            for (let i = 0; i < users.length; i++) {
              tmp.push({ item_id: i, item_text: users[i].username });
              test.push(users[i].username);
              userArr.push(users[i]);
            }

            //filter out existing team members to avoid duplicates
            for (let j = 0; j < this.members.length; j++) {
              for (let i = 0; i < tmp.length; i++) {
                //pick out duplicates
                if (tmp[i].item_text === this.members[j].username) {
                  filteredTmp.push(this.members[j].username);
                }
              }
            }

            //filter members
            const filtered = users.forEach((user: any) => {
              const filtered = test.filter((test: any) => {
                test !== user.username;
              });
            });            

            console.log(filteredTmp);
            //add usernames to dropdown list and users to array
            this.dropdownList = tmp;
            //this.dropdownList = filteredTmp;
            this.userArr = userArr;
          },
          error: (err) => {
            console.log(err);
            Swal.fire('Oops! Something went wrong', err.error.message, 'error');
          },
        });
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /* //getting members already in team
  getTeamMembers(teamId: string) {
    let tmp: any = [];
    this.teamService.getTeamMembers(teamId).subscribe((members: any) => {
      // members.forEach((member: any) => {
      //   console.log(member.username);
      // });
      for (let i = 0; i < members.length; i++) {
        tmp.push(members[i]);
      }
      this.members = tmp;
      console.log(this.members);
      //return this.members;
    });
  }*/

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
        error: (err) => {
          console.log(err);
          Swal.fire('Oops! Something went wrong', err.error.message, 'error');
        },
      });
    } else if (this.selectedItems.length <= 0) {
      Swal.fire('Alert!', `Please select a member to add`, 'warning');
    }
  }
}
