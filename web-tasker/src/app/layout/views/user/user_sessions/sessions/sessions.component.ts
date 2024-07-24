import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
  sessions!: any[];
  totalSessions = 0;
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

  constructor(
    private projectStatusService: ProjectStatusService // private _snackBar: MatSnackBar
  ) {
    //load data on table
    this.loadUserSessions();
  }

  ngOnInit(): void {
    //reload the data periodically
    const interval_id = window.setInterval(() => {
      this.loadUserSessions();
    }, 60000);
    /**save the interval-id to local storage for
     * clearing after leaving page*/
    localStorage.setItem('user-sessions-interval', interval_id.toString());
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
    /**get userId */
    const userId: string = localStorage.getItem('user-id')!;
    this.projectStatusService
      .getSpecUserStatusDocs(userId)
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
