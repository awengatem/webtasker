import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';

@Component({
  selector: 'app-proj-sessions',
  templateUrl: './proj-sessions.component.html',
  styleUrls: ['./proj-sessions.component.scss'],
})
export class ProjSessionsComponent {
  sessions!: any[];
  totalSessions = 0;
  projectId!: string;
  userId!: string;
  projectName: any;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'Position',
    'ProjectName',
    'TeamName',
    'Status',
    'NewDuration',
    'StartTime',
    'FinishTime',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private projectStatusService: ProjectStatusService) {
    //load data on table
    this.loadUserSessions();
  }

  ngOnInit(): void {
    //imitialize userId and projectId
    this.projectId = localStorage.getItem('project-id')!;
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
    const projectId = localStorage.getItem('project-id')!;
    const userId = localStorage.getItem('user-id')!;

    this.projectStatusService
      .getSpecUsernProjStatusDocs(userId, projectId)
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

  /**Method to convert timestamp to date */
  convertDate(timestamp: string): string {
    const date = new Date(timestamp);
    // const newDate = date.toLocaleString();
    return date.toLocaleString();
  }
}
