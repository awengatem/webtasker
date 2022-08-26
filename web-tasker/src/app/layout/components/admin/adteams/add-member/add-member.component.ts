import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],  
})
export class AddMemberComponent implements OnInit {

  //used by dropdown list
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings!: IDropdownSettings;

  constructor() {}

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Joe' },
      { item_id: 2, item_text: 'Frank' },
      { item_id: 3, item_text: 'Joy' },
      { item_id: 4, item_text: 'Purity' },
      { item_id: 5, item_text: 'John' }
    ];
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
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  tester(){
    console.log(this.selectedItems);
  }
}
