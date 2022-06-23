import { Component, EventEmitter, OnInit, Output } from '@angular/core';

interface sideNavToggle{
  screenWidth: number;
  isExpanded: boolean;
}

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<sideNavToggle> = new EventEmitter();

  //variables
  screenWidth = 0;
  isExpanded: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  toggleCollapse(): void{
    this.isExpanded = !this.isExpanded;
    this.onToggleSideNav.emit({isExpanded: this.isExpanded,screenWidth:this.screenWidth});
  }

}
