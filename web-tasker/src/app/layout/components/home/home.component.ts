import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  username!: string;
  constructor(private account: AccountService) {}

  ngOnInit(): void {
    this.getUsername();
  }

  private getUsername(): any {
    this.username = this.account.getUser().username;
  }
}
