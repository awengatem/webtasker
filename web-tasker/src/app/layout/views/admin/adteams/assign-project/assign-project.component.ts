import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-project',
  templateUrl: './assign-project.component.html',
  styleUrls: ['./assign-project.component.scss'],
})
export class AssignProjectComponent implements OnInit {
  //used by dropdown list
  dropdownList: any = [];
  projectArr: any = [];
  selectedItems: any = [];
  dropdownSettings!: IDropdownSettings;

  teamId!: string;

  //projects already in team
  projects: any = [];

  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
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

    //record where you are
    this.projectService.setFromAssigning(true);

    //then get dropdown list data
    this.getProjects();
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
  getProjects() {
    let tmp: any = [];
    let projectNames: any = [];
    let tmp2: any = [];
    let projectArr: any = [];
    let projectnameArr: any = [];

    //get projects already assigned to team first
    this.teamService.getTeamProjects(this.teamId).subscribe({
      next: (projects: any) => {
        console.log(projects);
        //pushing team projects to respective array
        for (let i = 0; i < projects.length; i++) {
          tmp2.push(projects[i]);
          //get only the projectNames of projects
          projectNames.push(projects[i].projectName);
        }
        this.projects = tmp2;
        //console.log(this.projects);

        //get all projects in db
        this.projectService.getAllProjects().subscribe({
          next: (projects: any) => {
            //push projectnames and projects to respective array
            for (let i = 0; i < projects.length; i++) {
              projectnameArr.push(projects[i].projectName);
              projectArr.push(projects[i]);
            }

            //filter out projects already assigned to team
            let filtered = projectnameArr.filter(
              (item: any) => !projectNames.includes(item)
            );
            //console.log(filtered);

            //create dropdownlist array using filtered projectNames
            for (let i = 0; i < filtered.length; i++) {
              tmp.push({ item_id: i, item_text: filtered[i] });
            }
            //add projectNames to dropdown list and projects to array
            this.dropdownList = tmp;
            this.projectArr = projectArr;
          },
          error: (err) => {
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

  assignProject() {
    let teamProjects: any = [];
    //ensure members are selected
    if (this.selectedItems.length > 0) {
      this.selectedItems.forEach((item: any) => {
        let projectId;
        //get project document id
        for (let i = 0; i < this.projectArr.length; i++) {
          if (this.projectArr[i].projectName === item.item_text) {
            projectId = this.projectArr[i]._id;
          }
        }
        //hardcode object to match api
        //get the patch team projects payload
        teamProjects.push({ team_id: this.teamId, project_id: projectId });
      });
      //console.log(teamProjects);

      //post them to db
      this.teamService.assignTeamProjects(teamProjects).subscribe({
        next: (res: any) => {
          console.log(res);
          // this.router.navigate([`/ad_teams/${this.teamId}`]);
          this.navigateBack();
          Swal.fire('Assigned!', `Projects have been assigned`, 'success');
        },
        error: (err: any) => {
          console.log(err);
          Swal.fire('Oops! Something went wrong', err.error.message, 'error');
        },
      });
    } else if (this.selectedItems.length <= 0) {
      Swal.fire('Alert!', `Please select a project to assign`, 'warning');
    }
  }

  /**Navigate back to previous route */
  navigateBack() {
    const previousUrl = localStorage.getItem('previousUrl');
    if (previousUrl) {
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
