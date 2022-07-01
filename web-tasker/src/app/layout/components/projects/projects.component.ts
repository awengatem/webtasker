import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {}

  //navigation of schedule
  tabElement: any;
  openTab: any;
  butElement: any;

  tabIdArray: string[] = [];
  loopElement: any;
  loopResult: any;

  butIdArray: string[] = [];
  loopButElement: any;
  butResult: any;

  //getting the open tab
  getOpenTab(): string {
    this.tabIdArray = [
      'tabNav1',
      'tabNav2',
      'tabNav3',
      'tabNav4',
      'tabNav5',
      'tabNav6',
      'tabNav7',
    ];
    this.tabIdArray.forEach((tab) => {
      this.loopElement = document.getElementById(tab);
      if (this.loopElement.classList.contains('active')) {
        this.loopResult = tab;
      }
    });
    return this.loopResult;
  }

  //remove active link on tab
  removeActive() {
    this.butIdArray = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    this.butIdArray.forEach((tab) => {
      this.loopButElement = document.getElementById(tab);
      if (this.loopButElement.classList.contains('active')) {
        this.loopButElement.classList.remove('active');
      }
    });
  }

  //method used by navtab buttons for navigation
  showTab(bId: string,tabId: string) {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById(bId);
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById(tabId);
    this.tabElement.classList.add('active');
  }

  //methods for testing backend api
  createNewProject(){
    this.projectService.createProject('finleys project').subscribe((response: any)=>{
      console.log(response);
    });
  }

  getProjects(){
    this.projectService.getProject().subscribe((response: any)=>{
      response.forEach((item: any)=>{
        console.log(item.title);
      });
      //console.log(response);
    });
  }
}