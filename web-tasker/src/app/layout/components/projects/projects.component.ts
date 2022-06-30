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

  //methods used by navtab buttons for navigation
  showTab1() {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById('mon');
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById('tabNav1');
    this.tabElement.classList.add('active');
    console.log('clicked');
  }
  showTab2() {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById('tue');
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById('tabNav2');
    this.tabElement.classList.add('active');
  }
  showTab3() {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById('wed');
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById('tabNav3');
    this.tabElement.classList.add('active');
  }
  showTab4() {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById('thu');
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById('tabNav4');
    this.tabElement.classList.add('active');
  }
  showTab5() {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById('fri');
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById('tabNav5');
    this.tabElement.classList.add('active');
  }
  showTab6() {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById('sat');
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById('tabNav6');
    this.tabElement.classList.add('active');
  }
  showTab7() {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById('sun');
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById('tabNav7');
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