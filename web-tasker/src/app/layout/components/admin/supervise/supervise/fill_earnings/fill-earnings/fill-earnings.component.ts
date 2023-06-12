import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-fill-earnings',
  templateUrl: './fill-earnings.component.html',
  styleUrls: ['./fill-earnings.component.scss']
})
export class FillEarningsComponent {
  selectedOption: string;
  dropDownOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  sessions!: any[];
  totalSessions = 0;
  projectId!: string;
  userId!: string;
  projectName: any = 'projectName';
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'Position',
    'Username',
    'ProjectName',
    'TeamName',
    'Status',
    'NewDuration',
    'StartTime',
    'FinishTime',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectStatusService: ProjectStatusService,
    private router: Router
  ) {
    //load data on table
    this.loadUserSessions();
    this.selectedOption = '';
  }

  onSelectedOption(option: string): void {
    this.selectedOption = option;
    // Perform any additional logic based on the selected option
  }

  ngOnInit(): void {
    //imitialize userId and projectId
    this.projectId = localStorage.getItem('capturedProjectId')!;
    this.userId = localStorage.getItem('user-id')!;
    //get project name
    this.getProjectName();
  }

    /**get project name */
    getProjectName() {
      this.projectStatusService
        .getProjectName(this.projectId)
        .then((projectName) => {
          this.projectName = projectName;
        });
    }
  
    /**method used by search filter */
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  
    /**Method to load table data */
    loadUserSessions() {
      const projectId = localStorage.getItem('capturedProjectId')!;
  
      //get the status docs
      this.projectStatusService
        .getSpecProjStatusDocs(projectId)
        .then((sessions: any) => {
          // add numbering to the sessions
          for (let session of sessions) {
            session.position = sessions.indexOf(session) + 1;
          }
          this.dataSource = new MatTableDataSource(sessions);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // refresh usercount
          this.totalSessions = sessions.length;
          console.log(sessions);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  
    loadProjectInfo() {
      const projectId = localStorage.getItem('capturedProjectId')!;
      this.router.navigate([`/ad_projects/${projectId}`]);
    }
  
    /**Method to convert timestamp to date */
    convertDate(timestamp: string): string {
      const date = new Date(timestamp);
      // const newDate = date.toLocaleString();
      return date.toLocaleString();
    }
  }
  