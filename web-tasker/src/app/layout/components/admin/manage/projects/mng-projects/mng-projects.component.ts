import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { ProjectService } from 'src/app/services/api/project.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { NewProjectModalComponent } from '../../../adprojects/new-projectmodal/new-projectmodal.component';

@Component({
  selector: 'app-mng-projects',
  templateUrl: './mng-projects.component.html',
  styleUrls: ['./mng-projects.component.scss'],
})
export class MngProjectsComponent implements OnInit {
  /**variables */
  totalProjects = 0;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'Select',
    'Projectname',
    'Teams',
    'CreatedAt',
    'CreatedBy',
    'Edit',
    'Delete',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**define modal */
  modalRef: MdbModalRef<NewProjectModalComponent> | null = null;
  isModalOpen: boolean = false; //add background blur

  constructor(
    private projectService: ProjectService,
    private snackBarService: SnackBarService,
    private modalService: MdbModalService
  ) {
    //load data on table
    this.loadAllProjects();
  }

  ngOnInit(): void {}

  /**Get the projects */
  getProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        console.log(projects);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**check whether all are selected */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((r) => this.selection.select(r));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.EmpId + 1
    }`;
  }
  /**method used by search filter */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**Delete selected project(s) */
  deleteSelected() {
    // debugger;
    const selectedProjectsArr = this.selection.selected;
    let projectIdArr: any = [];
    console.log(selectedProjectsArr);
    if (selectedProjectsArr.length > 0) {
      //push only project ids in an array
      selectedProjectsArr.forEach((item) => {
        projectIdArr.push(item._id);
      });
      console.log(projectIdArr);
      //confirm and delete projects
      Swal.fire({
        title: `Delete ${selectedProjectsArr.length} projects from the database?`,
        text: 'This process is irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        confirmButtonColor: '#e74c3c',
        cancelButtonText: 'No, let me think',
        cancelButtonColor: '#22b8f0',
      }).then((result) => {
        //delete projects from db
        if (result.value) {
          this.deleteMultipe(projectIdArr);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.snackBarService.displaySnackbar(
            'error',
            'operation has been cancelled'
          );
          //reset the selection
          this.selection = new SelectionModel<any>(true, []);
        }
      });
    } else {
      this.snackBarService.displaySnackbar('error', 'no selected records');
    }
  }

  /**Method to confirm project deletion */
  confirmDeletion(projectId: string, projectname: string) {
    Swal.fire({
      title: `Delete "${projectname}" from the database?`,
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete project from db
      if (result.value) {
        this.deleteProject(projectId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.snackBarService.displaySnackbar(
          'error',
          'operation has been cancelled'
        );
      }
    });
  }

  /**Method to deletemultiple */
  deleteMultipe(projectIdArr: any[]) {
    if (projectIdArr.length > 0) {
      this.projectService.deleteMultipleProjects(projectIdArr).subscribe({
        next: (response: any) => {
          console.log(response);
          this.snackBarService.displaySnackbar('success', response.message);
          this.loadAllProjects();
        },
        error: (err) => {
          console.log(err);
          Swal.fire('Oops! Something went wrong', err.error.message, 'error');
        },
      });
    }
  }

  /**Delete a specified project */
  deleteProject(projectId: string) {
    this.projectService.deleteProject(projectId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBarService.displaySnackbar('success', response.message);
        this.loadAllProjects();
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Method to reload user table */
  loadAllProjects() {
    //reset the selection
    this.selection = new SelectionModel<any>(true, []);
    //load data
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        //add project teams
        if (projects) {
          for (let project of projects) {
            this.projectService
              .getProjectTeams(project._id)
              .subscribe((teams: any) => {
                // console.log(teams.length);
                //push number of teams to projects
                project.teams = teams.length;
              });
          }
        }
        //add projects to table
        this.dataSource = new MatTableDataSource(projects);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // refresh usercount
        this.totalProjects = projects.length;
        console.log(projects);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**Method to convert timestamp to date */
  convertDate(timestamp: string): string {
    const date = new Date(timestamp);
    // const newDate = date.toLocaleString();
    return date.toLocaleString();
  }

  /**Method to set location to help
   *  navigate back to previous route
   */
  setLocation() {
    window.sessionStorage.setItem('fromMng', 'true');
  }

  /**save the project id to local storage*/
  saveProjectId(projectId: string) {
    localStorage.setItem('capturedProjectId', projectId);
  }

  /**Method to navigate to project info */
  navigate(projectId: string) {
    //set location then save id to local storage
    this.setLocation();
    this.saveProjectId(projectId);
  }

  /**METHODS USED BY MODAL */
  /**open new user modal */
  openNewProjectModal() {
    this.isModalOpen = true;
    this.modalRef = this.modalService.open(NewProjectModalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
    });
    //listen when closed
    this.modalRef.onClose.subscribe((message: any) => {
      console.log(message);
      this.isModalOpen = false;
      /**Refresh projects */
      this.loadAllProjects();
    });
  }
}
