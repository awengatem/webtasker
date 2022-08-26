import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProjectService } from 'src/app/services/project.service';

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
    private projectService: ProjectService,
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
    this.getProjects();
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
  getProjects() {
    let tmp: any = [];
    this.projectService.getAllProjects().subscribe((projects: any) => {
      for (let i = 0; i < projects.length; i++) {
        tmp.push({ item_id: i, item_text: projects[i].projectName });
      }
      //console.log(projects);
      this.dropdownList = tmp;
    });
  }

  tester() {
    console.log(this.selectedItems);
  }

}
