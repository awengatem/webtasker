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
    this.getUsername();
  }

  toggleSidebar(){
    this.toggleSidebarForMe.emit(); 
  }

  logger(){
    this.logout.emit();
  }

  getUsername(): any{
    this.username = this.account.getUser().username;
  }
}
