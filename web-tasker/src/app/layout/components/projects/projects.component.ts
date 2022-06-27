import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //navigation of schedule
  tabElement: any;
  openTab: any;

  tabIdArray: string[] = [];
  loopElement: any;
  loopResult: any;

  getOpenTab(): string {
    this.tabIdArray = ["tabNav1","tabNav2","tabNav3","tabNav4","tabNav5"];
    this.tabIdArray.forEach((tab)=>{
      this.loopElement = document.getElementById(tab);
      if (this.loopElement.classList.contains("active")) {
        this.loopResult = tab;
      }
    });
    return this.loopResult;
  }

  showTab1(){
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove("active");
    this.tabElement = document.getElementById("tabNav1");
    this.tabElement.classList.add("active");
    console.log("clicked");
  }
  showTab2(){
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove("active");
    this.tabElement = document.getElementById("tabNav2");
    this.tabElement.classList.add("active");
  }
  showTab3(){
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove("active");
    this.tabElement = document.getElementById("tabNav3");
    this.tabElement.classList.add("active");
  }
  showTab4(){
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove("active");
    this.tabElement = document.getElementById("tabNav4");
    this.tabElement.classList.add("active");
  }
  showTab5(){
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove("active");
    this.tabElement = document.getElementById("tabNav5");
    this.tabElement.classList.add("active");
  }
  
}
