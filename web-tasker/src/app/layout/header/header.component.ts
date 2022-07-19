import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter();

  constructor(private account: AccountService) { }

  username!: string;

  ngOnInit(): void {
    this.getUser();
  }

  toggleSidebar(){
    this.toggleSidebarForMe.emit(); 
  }

  logger(){
    this.logout.emit();
  }

  getUser(): any{
    this.account.getUserAccount().subscribe((response: any) =>{      
      this.username = response.username;
      console.log(this.username);
    })
  }
}
