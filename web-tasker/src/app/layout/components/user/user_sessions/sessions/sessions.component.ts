import { Component } from '@angular/core';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
  sessions!: any[];
  sessionsLength = 0;
  /**used by  the search bar */
  searchText = '';

  constructor() {}

  ngOnInit(): void {}
}
