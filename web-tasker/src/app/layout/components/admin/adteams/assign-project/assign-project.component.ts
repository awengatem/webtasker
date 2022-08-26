import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-assign-project',
  templateUrl: './assign-project.component.html',
  styleUrls: ['./assign-project.component.scss']
})
export class AssignProjectComponent implements OnInit {

  //used by dropdown list
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings!: IDropdownSettings;

  teamId!: string;

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
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      const teamId = params['teamId'];
      this.teamId = teamId;
      console.log(this.teamId);     
    });

    //get dropdown list data
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
      itemsShowLimit: 3,
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
    this.teamService.getUsers().subscribe((users: any) => {
      for (let i = 0; i < users.length; i++) {
        tmp.push({ item_id: i, item_text: users[i].username });
      }
      //console.log(users);
      this.dropdownList = tmp;
    });
  }

  tester() {
    console.log(this.selectedItems);
  }

}
